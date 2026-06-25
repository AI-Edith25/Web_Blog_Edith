import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000/studio", { waitUntil: "networkidle" });
console.log("1) Visiting /studio while locked -> URL:", page.url());

await page.fill('input[type="password"]', "wrong-passcode");
await page.click('button[type="submit"]');
await page.waitForTimeout(500);
console.log("2) Wrong passcode -> URL:", page.url(), "| error visible:", await page.locator("text=Incorrect passcode").isVisible());

await page.fill('input[type="password"]', "letmein123");
await page.click('button[type="submit"]');
await page.waitForTimeout(800);
console.log("3) Correct passcode -> URL:", page.url());
console.log("   Sees 'All Articles' heading:", await page.locator("h1", { hasText: "All Articles" }).isVisible());

await page.reload({ waitUntil: "networkidle" });
console.log("4) Reload /studio after unlock -> URL:", page.url());

console.log("Console errors:", errors.length ? JSON.stringify(errors) : "none");
await browser.close();
