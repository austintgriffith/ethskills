#!/usr/bin/env node
// Drives a real MetaMask extension in a disposable Playwright profile.
// MetaMask pages run LavaMoat scuttling: page.evaluate, waitForFunction and
// allTextContents throw there. Use locator actions, innerText, getAttribute and url().

import { createHash, randomBytes } from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, realpathSync, rmSync } from "node:fs";
import { mkdir, readFile, rm, writeFile, mkdtemp } from "node:fs/promises";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const METAMASK = {
  version: "13.54.0",
  url: "https://github.com/MetaMask/metamask-extension/releases/download/v13.54.0/metamask-chrome-13.54.0.zip",
  sha256: "14f73006fc9b0b185b645fcd96f52e23fba5cc1d71d3a091b6dfb04f83fdfe2b",
};

const PASSWORD = Symbol("password");

const ONBOARDING = {
  "/onboarding/welcome": ["onboarding-create-wallet"],
  "/onboarding/welcome?login=new": ["onboarding-create-with-srp-button"],
  "/onboarding/create-password": [PASSWORD, "create-password-terms", "create-password-submit"],
  "/onboarding/setup-passkey": ["passkey-maybe-later-button"],
  "/onboarding/review-recovery-phrase": ["recovery-phrase-remind-later"],
  "/onboarding/metametrics": ["metametrics-i-agree"],
  "/onboarding/completion": ["onboarding-complete-done"],
};

const SECRET_ROUTES = ["/onboarding/create-password", "/onboarding/review-recovery-phrase"];

const APPROVE_BUTTONS = ["confirm-btn", "confirm-footer-button"];

export async function loadPlaywright(from = process.cwd()) {
  try {
    const resolved = createRequire(path.join(from, "noop.js")).resolve("playwright");
    const playwright = await import(pathToFileURL(resolved).href);
    return playwright.chromium ?? playwright.default.chromium;
  } catch {
    throw new Error(`playwright is not installed under ${from}; install it in the verification runtime, then run \`npx playwright install chromium\``);
  }
}

export async function installMetaMask(cacheDir) {
  const extensionDir = path.join(cacheDir, `metamask-${METAMASK.version}`);
  if (existsSync(path.join(extensionDir, "manifest.json"))) return extensionDir;
  const response = await fetch(METAMASK.url);
  if (!response.ok) throw new Error(`MetaMask ${METAMASK.version} download failed: HTTP ${response.status}`);
  const archive = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(archive).digest("hex");
  if (digest !== METAMASK.sha256) throw new Error(`MetaMask ${METAMASK.version} sha256 mismatch: ${digest}`);
  await mkdir(cacheDir, { recursive: true });
  const zip = `${extensionDir}.zip`;
  await writeFile(zip, archive);
  await rm(extensionDir, { recursive: true, force: true });
  execFileSync("unzip", ["-q", zip, "-d", extensionDir]);
  await rm(zip);
  return extensionDir;
}

export async function launchWallet(chromium, { profileDir, extensionDir }) {
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: [`--disable-extensions-except=${extensionDir}`, `--load-extension=${extensionDir}`, "--no-first-run", "--no-default-browser-check"],
  });
  const worker = context.serviceWorkers().find(item => item.url().startsWith("chrome-extension://"))
    ?? await context.waitForEvent("serviceworker", { predicate: item => item.url().startsWith("chrome-extension://"), timeout: 60_000 });
  const extensionId = new URL(worker.url()).hostname;
  const origin = `chrome-extension://${extensionId}`;
  const wallet = context.pages().find(page => page.url().startsWith(origin))
    ?? await context.waitForEvent("page", { predicate: page => page.url().startsWith(origin), timeout: 30_000 }).catch(() => undefined)
    ?? await context.newPage();
  if (!wallet.url().startsWith(origin)) await wallet.goto(`${origin}/home.html`);
  for (const page of context.pages()) if (page !== wallet && page.url().startsWith(origin)) await page.close();
  return { context, extensionId, wallet, metamaskVersion: METAMASK.version };
}

function route(page) {
  return new URL(page.url()).hash.slice(1) || "/";
}

async function visibleTestIds(page) {
  const elements = page.locator("[data-testid]:visible");
  const ids = [];
  for (let index = 0, count = await elements.count(); index < count && ids.length < 40; index++) {
    ids.push(await elements.nth(index).getAttribute("data-testid").catch(() => null));
  }
  return ids.filter(Boolean);
}

async function waitForRouteChange(page, from, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (route(page) !== from) return true;
    await page.waitForTimeout(200);
  }
  return false;
}

export async function onboardWallet(wallet, { timeout = 30_000 } = {}) {
  const origin = `chrome-extension://${new URL(wallet.url()).host}`;
  await wallet.getByTestId("onboarding-create-wallet").or(wallet.getByTestId("app-header-logo")).first().waitFor({ timeout });
  let password = randomBytes(24).toString("base64url");
  try {
    for (let step = 0; step < 20; step++) {
      const current = route(wallet);
      if (!current.startsWith("/onboarding")) return;
      const actions = ONBOARDING[current];
      if (!actions) {
        const ids = SECRET_ROUTES.includes(current) ? ["[secret screen omitted]"] : await visibleTestIds(wallet);
        throw new Error(`MetaMask ${METAMASK.version} showed unmapped onboarding route ${current}; visible test ids: ${ids.join(" ")}. Add it to ONBOARDING in eth-verify/scripts/metamask.mjs and rerun selftest.`);
      }
      for (const action of actions) {
        if (action === PASSWORD) {
          await wallet.getByTestId("create-password-new-input").fill(password);
          await wallet.getByTestId("create-password-confirm-input").fill(password);
        } else {
          await wallet.getByTestId(action).click({ timeout });
        }
      }
      if (current === "/onboarding/completion") {
        await wallet.waitForTimeout(1_000);
        await wallet.goto(`${origin}/home.html`);
        await wallet.getByTestId("app-header-logo").first().waitFor({ timeout });
      } else if (!await waitForRouteChange(wallet, current, timeout)) {
        throw new Error(`MetaMask onboarding did not leave ${current} after ${actions.filter(item => item !== PASSWORD).join(", ")}`);
      }
    }
    throw new Error(`MetaMask onboarding did not reach the wallet home; last route ${route(wallet)}`);
  } finally {
    password = undefined;
  }
}

// MetaMask 13 shows dApp requests in the side panel, which Playwright cannot list.
// The same pending request renders in notification.html opened as a tab.
export async function openPrompt(context, extensionId, { timeout = 30_000 } = {}) {
  const prompt = await context.newPage();
  const buttons = prompt.locator(APPROVE_BUTTONS.map(id => `[data-testid="${id}"]`).join(", "));
  const deadline = Date.now() + timeout;
  for (;;) {
    await prompt.goto(`chrome-extension://${extensionId}/notification.html`);
    if (await buttons.first().waitFor({ timeout: 3_000 }).then(() => true, () => false)) break;
    if (Date.now() > deadline) {
      const shown = `${route(prompt)} ${(await visibleTestIds(prompt)).join(" ")}`;
      await prompt.close();
      throw new Error(`No pending MetaMask request appeared within ${timeout} ms; notification.html showed ${shown}`);
    }
  }
  const text = (await prompt.locator("body").innerText()).replace(/\s+/g, " ").trim();
  return { page: prompt, text, route: route(prompt), button: buttons.first() };
}

export async function approve(context, extensionId, { origin, expect = [], timeout = 30_000 }) {
  const { host, hostname } = new URL(origin);
  const prompt = await openPrompt(context, extensionId, { timeout });
  try {
    const shownOrigin = prompt.route.startsWith("/connect") ? hostname : host;
    const missing = [shownOrigin, ...expect].filter(item => !prompt.text.includes(item));
    if (missing.length) throw new Error(`MetaMask prompt is missing ${missing.join(", ")}; refusing to approve. Prompt: ${prompt.text.slice(0, 400)}`);
    const deadline = Date.now() + timeout;
    let label;
    while (Date.now() < deadline) {
      label = (await prompt.button.innerText()).trim();
      if ((label === "Confirm" || label === "Connect") && await prompt.button.isEnabled()) break;
      await prompt.page.waitForTimeout(250);
    }
    if (label !== "Confirm" && label !== "Connect") {
      await prompt.button.click().catch(() => {});
      await prompt.page.waitForTimeout(1_000);
      const alert = (await prompt.page.getByRole("dialog").last().innerText().catch(() => "")).replace(/\s+/g, " ").slice(0, 400);
      throw new Error(`MetaMask prompt still shows "${label}" instead of Confirm after ${timeout} ms; refusing to approve. Alert: ${alert}. Prompt: ${prompt.text.slice(0, 300)}`);
    }
    await prompt.button.click({ timeout });
    return { route: prompt.route, text: prompt.text };
  } finally {
    await prompt.page.close().catch(() => {});
  }
}

export async function reject(context, extensionId, { timeout = 30_000 } = {}) {
  const prompt = await openPrompt(context, extensionId, { timeout });
  try {
    await prompt.page.locator('[data-testid="cancel-btn"], [data-testid="confirm-footer-cancel-button"]').first().click({ timeout });
    return { route: prompt.route, text: prompt.text };
  } finally {
    await prompt.page.close().catch(() => {});
  }
}

const FIXTURE = `<!doctype html><title>metamask selftest</title><pre id="log"></pre><script>
const out = document.getElementById("log");
window.call = (method, params) => ethereum.request({ method, params }).then(
  value => (out.textContent += method + " " + JSON.stringify(value) + "\\n", value),
  error => (out.textContent += method + " ERROR " + error.message + "\\n", Promise.reject(error)));
</script>`;

async function rpc(url, method, params = []) {
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
  const body = await response.json();
  if (body.error) throw new Error(`${method}: ${body.error.message}`);
  return body.result;
}

async function freePort() {
  const server = createServer().listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const { port } = server.address();
  await new Promise(resolve => server.close(resolve));
  return port;
}

async function selftest() {
  const chromium = await loadPlaywright();
  const work = await mkdtemp(path.join(tmpdir(), "eth-verify-metamask-"));
  const rpcPort = await freePort();
  const rpcUrl = `http://127.0.0.1:${rpcPort}`;
  const anvil = spawn("anvil", ["--host", "127.0.0.1", "--port", String(rpcPort), "--chain-id", "31337"], { stdio: "ignore" });
  const server = createServer((_, response) => response.writeHead(200, { "content-type": "text/html" }).end(FIXTURE)).listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const appUrl = `http://127.0.0.1:${server.address().port}`;
  let context;
  let cleaned;
  const cleanup = () => cleaned ??= (async () => {
    await context?.close().catch(() => {});
    server.close();
    anvil.kill();
    await rm(work, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  })();
  for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => cleanup().then(() => process.exit(130)));
  try {
    for (let attempt = 0; attempt < 50 && !await rpc(rpcUrl, "eth_chainId").catch(() => null); attempt++) await new Promise(resolve => setTimeout(resolve, 200));
    const extensionDir = await installMetaMask(path.join(work, "extension"));
    const launched = await launchWallet(chromium, { profileDir: path.join(work, "profile"), extensionDir });
    context = launched.context;
    // Playwright's own SIGINT handler exits the process before async cleanup finishes.
    process.once("exit", () => {
      anvil.kill();
      rmSync(work, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    });
    const { extensionId, wallet } = launched;
    await onboardWallet(wallet);
    console.log(`PASS onboarding MetaMask ${METAMASK.version}`);

    const app = await context.newPage();
    await app.goto(appUrl);
    const confirm = (method, params, expect) => Promise.all([
      app.evaluate(([method, params]) => window.call(method, params), [method, params]),
      approve(context, extensionId, { origin: appUrl, expect }),
    ]).then(([value]) => value);
    const [account] = await confirm("eth_requestAccounts", []);
    console.log(`PASS connect ${account}`);

    await rpc(rpcUrl, "anvil_setBalance", [account, "0x56BC75E2D63100000"]);
    await confirm("wallet_addEthereumChain", [{ chainId: "0x7a69", chainName: "Anvil selftest", rpcUrls: [rpcUrl], nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 } }], ["Anvil selftest"]);
    if (await app.evaluate(() => window.call("eth_chainId", [])) !== "0x7a69") throw new Error("MetaMask did not switch to the Anvil selftest chain");
    console.log("PASS add and switch to local chain 31337");

    const typedData = { types: { EIP712Domain: [{ name: "name", type: "string" }, { name: "chainId", type: "uint256" }], Message: [{ name: "amount", type: "uint256" }] }, primaryType: "Message", domain: { name: "Selftest", chainId: 31337 }, message: { amount: "7" } };
    const signature = await confirm("eth_signTypedData_v4", [account, JSON.stringify(typedData)], ["Message"]);
    if (!/^0x[0-9a-f]{130}$/i.test(signature)) throw new Error(`unexpected signature ${signature}`);
    console.log("PASS EIP-712 signature");

    const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const before = BigInt(await rpc(rpcUrl, "eth_getBalance", [recipient, "latest"]));
    const hash = await confirm("eth_sendTransaction", [{ from: account, to: recipient, value: "0x2386f26fc10000" }], ["0.01 ETH"]);
    let receipt;
    for (let attempt = 0; attempt < 50 && !receipt; attempt++) {
      receipt = await rpc(rpcUrl, "eth_getTransactionReceipt", [hash]);
      if (!receipt) await new Promise(resolve => setTimeout(resolve, 200));
    }
    const after = BigInt(await rpc(rpcUrl, "eth_getBalance", [recipient, "latest"]));
    if (receipt?.status !== "0x1" || after - before !== 10n ** 16n) throw new Error(`transaction ${hash} did not transfer 0.01 ETH`);
    console.log(`PASS transaction ${hash} mined with status 1`);
  } finally {
    await cleanup();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  if (process.argv[2] !== "selftest") {
    console.error("usage: node metamask.mjs selftest");
    process.exit(2);
  }
  selftest().catch(error => {
    console.error(`FAIL ${error.message}`);
    process.exit(1);
  });
}
