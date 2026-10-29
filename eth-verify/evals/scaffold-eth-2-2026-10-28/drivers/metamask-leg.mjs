import { chromium } from "/tmp/mm-rt/node_modules/playwright/index.mjs";
import { installMetaMask, launchWallet, onboardWallet, approve, reject, openPrompt, METAMASK } from "/tmp/mm-rt/metamask.mjs";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = "/tmp/se2-verify-report/metamask", WORK = "/tmp/se2-mm-work", APP = "http://localhost:3000/debug", ORIGIN = "http://localhost:3000";
const RPC = "http://127.0.0.1:8545", CONTRACT = "0x700b6a60ce7eaaea56f065753d8dcb9653dbad35";
const log = []; const note = (step, data = {}) => { const r = { t: new Date().toISOString(), step, ...data }; log.push(r); console.log(JSON.stringify(r)); writeFileSync(`${OUT}/journey.json`, JSON.stringify(log, null, 2)); };
const rpc = async (method, params = []) => { const r = await (await fetch(RPC, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) })).json(); if (r.error) throw new Error(`${method}: ${r.error.message}`); return r.result; };
mkdirSync(WORK, { recursive: true });
const extensionDir = await installMetaMask(`${WORK}/extension`);
const { context, extensionId, wallet } = await launchWallet(chromium, { profileDir: `${WORK}/profile`, extensionDir });
note("launched", { metamask: METAMASK.version, extensionId, profile: `${WORK}/profile (persistent, temporary)`, chromium: context.browser()?.version() ?? null });
const errors = [];
let app;
const shot = name => app.screenshot({ path: `${OUT}/${name}.png` }).catch(() => {});
const ui = async () => (await app.locator("header, .navbar").first().innerText().catch(() => "")).replace(/\s+/g, " ").slice(0, 200);
const step = async (name, fn) => { try { const r = await fn(); return r; } catch (e) { note(`FAILED ${name}`, { message: e.message.split("\n")[0].slice(0, 600) }); await shot(`error-${name}`); throw e; } };
try {
  await step("onboard", () => onboardWallet(wallet));
  note("onboarded");
  app = await context.newPage();
  app.on("console", m => m.type() === "error" && errors.push(m.text().slice(0, 300)));
  app.on("pageerror", e => errors.push("pageerror " + e.message.slice(0, 300)));
  await app.setViewportSize({ width: 1280, height: 900 });
  await app.goto(APP, { waitUntil: "networkidle", timeout: 120000 });
  const main = app.getByRole("main");
  await main.getByText("greeting", { exact: true }).waitFor({ timeout: 30000 });
  note("open", { final: app.url(), header: await ui() });
  // burner auto-connects on local targets; disconnect through the app UI
  if (!await app.getByRole("button", { name: /connect wallet/i }).isVisible()) {
    await step("disconnect-burner", async () => {
      await app.locator("details.dropdown > summary, .dropdown [tabindex='0']").filter({ hasText: /0x/ }).first().click();
      await app.getByText("Disconnect", { exact: true }).click();
      await app.getByRole("button", { name: /connect wallet/i }).waitFor({ timeout: 15000 });
    });
    note("burner-disconnected", { header: await ui() });
  }
  // connect MetaMask via RainbowKit
  const connected = await step("connect", async () => {
    await app.getByRole("button", { name: /connect wallet/i }).click();
    await app.getByRole("dialog").getByRole("button", { name: /metamask/i }).click();
    const r = await approve(context, extensionId, { origin: ORIGIN });
    return r;
  });
  await app.bringToFront();
  const account = await step("read-account", async () => { for (let i = 0; i < 50; i++) { const [a] = await app.evaluate(() => window.ethereum.request({ method: "eth_accounts" })); if (a) return a; await app.waitForTimeout(200); } throw new Error("no account from provider"); });
  const chainBefore = await app.evaluate(() => window.ethereum.request({ method: "eth_chainId" }));
  note("connected", { promptRoute: connected.route, account, providerChainId: chainBefore, header: await ui() });
  await shot("01-connected-wrong-network");
  // fund from owned node test account 0 (unlocked on anvil)
  const fundHash = await rpc("eth_sendTransaction", [{ from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", to: account, value: "0x8AC7230489E80000" }]);
  note("funded", { fundHash, balanceWei: BigInt(await rpc("eth_getBalance", [account, "latest"])).toString() });
  // switch network through the app's control
  await step("switch-network", async () => {
    await app.getByText("Wrong network", { exact: false }).first().click();
    await app.getByText(/Switch to/).first().click();
    const r = await approve(context, extensionId, { origin: ORIGIN, expect: ["Foundry"] });
    note("network-prompt", { route: r.route, text: r.text.slice(0, 500) });
    // a second (switch) prompt may follow an add prompt
    for (let i = 0; i < 20; i++) { if (await app.evaluate(() => window.ethereum.request({ method: "eth_chainId" })) === "0x7a69") return; await app.waitForTimeout(500); }
    const r2 = await approve(context, extensionId, { origin: ORIGIN, expect: ["Foundry"], timeout: 10000 });
    note("network-prompt-2", { route: r2.route, text: r2.text.slice(0, 500) });
  });
  await app.bringToFront();
  const chainAfter = await app.evaluate(() => window.ethereum.request({ method: "eth_chainId" }));
  await app.reload({ waitUntil: "networkidle" });
  await main.getByText("greeting", { exact: true }).waitFor({ timeout: 30000 });
  note("switched-and-reloaded", { providerChainId: chainAfter, header: await ui() });
  // rejection path
  const blockBeforeReject = await rpc("eth_blockNumber");
  await main.getByRole("textbox", { name: "string _newGreeting" }).fill("rejected greeting");
  await main.getByRole("button", { name: "Send 💸" }).first().click();
  const rej = await step("reject", () => reject(context, extensionId));
  await app.bringToFront();
  await app.waitForTimeout(2000);
  const rejToast = (await app.locator("[role='status'], .toast, div:has-text('User rejected')").last().innerText().catch(() => "")).replace(/\s+/g, " ").slice(0, 200);
  note("rejected", { route: rej.route, blockBefore: blockBeforeReject, blockAfter: await rpc("eth_blockNumber"), greetingOnchainUnchanged: null, toast: rejToast, sendEnabled: await main.getByRole("button", { name: "Send 💸" }).first().isEnabled() });
  await shot("02-after-reject");
  // approved write with controlled mining to observe pending
  const greeting = `Hello from MetaMask ${Date.now()}`;
  await main.getByRole("textbox", { name: "string _newGreeting" }).fill(greeting);
  await rpc("evm_setAutomine", [false]);
  await main.getByRole("button", { name: "Send 💸" }).first().click();
  const preview = await step("open-tx-prompt", () => openPrompt(context, extensionId, { timeout: 30000 }));
  await preview.page.setViewportSize({ width: 420, height: 800 }).catch(() => {});
  await preview.page.screenshot({ path: `${OUT}/03-confirm-prompt.png` });
  note("tx-prompt", { route: preview.route, text: preview.text.slice(0, 700) });
  const ok = await step("approve-tx", () => approve(context, extensionId, { origin: ORIGIN, expect: ["Foundry", "0x700b6"] }));
  await preview.page.close().catch(() => {});
  await app.bringToFront();
  let pending = [];
  for (let i = 0; i < 50 && !pending.length; i++) { const b = await rpc("eth_getBlockByNumber", ["pending", false]); pending = b?.transactions ?? []; if (!pending.length) await app.waitForTimeout(200); }
  const sendBtn = main.getByRole("button", { name: /Send/ }).first();
  const pendingUi = { sendDisabled: await sendBtn.isDisabled().catch(() => null), sendHtml: (await sendBtn.innerHTML().catch(() => "")).slice(0, 200) };
  await shot("04-pending");
  note("pending", { approvedRoute: ok.route, mempool: pending, ...pendingUi });
  await rpc("evm_mine"); await rpc("evm_setAutomine", [true]);
  await app.getByText(/Transaction completed successfully/i).first().waitFor({ timeout: 60000 });
  await main.getByText(`"${greeting}"`).waitFor({ timeout: 30000 });
  note("mined-ui-updated", { greeting });
  await shot("05-after-tx");
  await app.reload({ waitUntil: "networkidle" });
  await main.getByText(`"${greeting}"`).waitFor({ timeout: 30000 });
  note("after-reload", { greetingShown: true, header: await ui() });
  await shot("06-after-reload");
} catch (e) {
  note("error", { message: e.message.split("\n")[0].slice(0, 600) });
  process.exitCode = 1;
} finally {
  await rpc("evm_setAutomine", [true]).catch(() => {});
  note("console-errors", { count: errors.length, errors: errors.slice(0, 15) });
  await context.close().catch(() => {});
}
