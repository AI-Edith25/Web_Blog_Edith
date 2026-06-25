import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2] ?? "http://localhost:3000/";
const outDir = process.argv[3] ?? "D:/Temp/edith-screens";
const width = Number(process.argv[4] ?? 1280);
const height = Number(process.argv[5] ?? 900);
const name = process.argv[6] ?? "screenshot";

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });

await browser.close();

console.log("Screenshot saved:", `${outDir}/${name}.png`);
console.log("Console errors:", errors.length ? JSON.stringify(errors, null, 2) : "none");
