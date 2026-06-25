import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000/studio", { waitUntil: "networkidle" });
await page.click('button[aria-label="Toggle studio menu"]');
await page.waitForTimeout(200);
await page.screenshot({ path: "D:/Temp/edith-screens/studio-mobile-menu-open.png" });

const tableScrollable = await page.evaluate(() => {
  const wrapper = document.querySelector(".overflow-x-auto");
  return wrapper ? wrapper.scrollWidth > wrapper.clientWidth : null;
});
console.log("Table horizontally scrollable:", tableScrollable);
console.log("Console errors:", errors.length ? JSON.stringify(errors) : "none");
await browser.close();
