import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2] ?? "http://localhost:3000/";
const outDir = process.argv[3] ?? "D:/Temp/edith-screens";
const scrollY = Number(process.argv[4] ?? 0);
const name = process.argv[5] ?? "region";

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await page.waitForTimeout(300);
await page.screenshot({ path: `${outDir}/${name}.png` });
await browser.close();
console.log("saved", `${outDir}/${name}.png`);
