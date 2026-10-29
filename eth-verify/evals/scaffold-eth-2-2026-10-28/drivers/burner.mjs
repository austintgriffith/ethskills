import { chromium } from "/tmp/mm-rt/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const OUT = "/tmp/se2-verify-report/burner", APP = "http://localhost:3000/debug";
const log = []; const note = (step, data) => { const r = { t: new Date().toISOString(), step, ...data }; log.push(r); console.log(JSON.stringify(r)); writeFileSync(`${OUT}/journey.json`, JSON.stringify(log, null, 2)); };
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
const p = await ctx.newPage();
const errors = [];
p.on("console", m => m.type() === "error" && errors.push(m.text().slice(0, 300)));
p.on("pageerror", e => errors.push("pageerror " + e.message.slice(0, 300)));
try {
  await p.goto(APP, { waitUntil: "networkidle", timeout: 120000 });
  note("open", { requested: APP, final: p.url(), title: await p.title() });
  const main = p.getByRole("main");
  await main.getByText('"Building Unstoppable Apps!!!"').waitFor({ timeout: 30000 });
  const addrImg = p.locator("header img[alt$='avatar'], img[alt$='avatar']").first();
  const account = (await addrImg.getAttribute("alt")).replace(" avatar", "");
  const network = await p.getByText("Foundry", { exact: true }).first().isVisible();
  note("connected", { account, networkLabelFoundry: network, connectButtonVisible: await p.getByRole("button", { name: /connect wallet/i }).isVisible() });
  await p.screenshot({ path: `${OUT}/01-before.png` });
  // fund via the app's header faucet button
  const faucet = p.locator("[data-tip='Grab funds from faucet'] button, .tooltip:has-text('') button").first();
  const tipBtn = p.locator("[data-tip*='faucet' i] button").first();
  await (await tipBtn.count() ? tipBtn : faucet).click();
  await p.getByRole("button", { name: /^(?!0\.0000)\d+\.\d+ ETH$/ }).first().waitFor({ timeout: 30000 });
  note("funded", { headerBalance: await p.getByRole("button", { name: / ETH$/ }).first().innerText() });
  const greeting = `Hello from burner ${Date.now()}`;
  await main.getByRole("textbox", { name: "string _newGreeting" }).fill(greeting);
  const send = main.getByRole("button", { name: "Send 💸" }).first();
  await send.click();
  note("clicked-setGreeting", { greeting, disabledAfterClick: await send.isDisabled().catch(() => null) });
  const toast = p.getByText(/Transaction completed successfully/i).first();
  await toast.waitFor({ timeout: 60000 });
  const toastText = (await toast.locator("xpath=ancestor::div[1]").innerText()).replace(/\s+/g, " ");
  const link = await p.locator("a[href*='/blockexplorer/transaction/']").first().getAttribute("href").catch(() => null);
  note("toast", { toastText, txLink: link });
  await main.getByText(`"${greeting}"`).waitFor({ timeout: 30000 });
  note("ui-updated-without-reload", { greetingShown: true });
  await p.screenshot({ path: `${OUT}/02-after-tx.png` });
  await p.reload({ waitUntil: "networkidle" });
  await main.getByText(`"${greeting}"`).waitFor({ timeout: 30000 });
  const total = await main.locator("h3:has-text('totalCounter') ~ div, h3:has-text('totalCounter') + *").first().innerText().catch(() => null);
  note("after-reload", { greetingShown: true, totalCounterNear: total });
  await p.screenshot({ path: `${OUT}/03-after-reload.png` });
} catch (e) {
  note("error", { message: e.message.split("\n")[0] });
  await p.screenshot({ path: `${OUT}/error.png` }).catch(() => {});
  process.exitCode = 1;
} finally {
  note("console-errors", { count: errors.length, errors: errors.slice(0, 10) });
  await b.close();
}
