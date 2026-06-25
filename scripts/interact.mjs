import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.click('button[aria-label="Toggle menu"]');
await page.waitForTimeout(200);
await page.screenshot({ path: "D:/Temp/edith-screens/mobile-menu-open.png" });

await page.click('div.lg\\:hidden a:has-text("Skincare")');
await page.waitForTimeout(800);
await page.screenshot({ path: "D:/Temp/edith-screens/category-filter.png", fullPage: false });

console.log("URL after filter click:", page.url());
console.log("Console errors:", errors.length ? JSON.stringify(errors) : "none");

await browser.close();
