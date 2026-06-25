import { chromium } from "playwright";

const ROUTES = [
  "/",
  "/article/molecular-evolution-of-skin-regeneration",
  "/studio",
  "/studio/drafts",
  "/studio/scheduled",
  "/studio/media",
  "/studio/settings",
  "/studio/new",
  "/studio/edit/f08a18d6-6f8c-442f-8d2d-56800b5406de",
];

const browser = await chromium.launch({ channel: "chrome" });

for (const width of [375, 1280]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const route of ROUTES) {
    const errors = [];
    const onConsole = (m) => m.type() === "error" && errors.push(m.text());
    const onError = (e) => errors.push(String(e));
    page.on("console", onConsole);
    page.on("pageerror", onError);
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    console.log(`[${width}px] ${route} -> ${errors.length === 0 ? "OK" : "ERRORS: " + JSON.stringify(errors)}`);
    page.off("console", onConsole);
    page.off("pageerror", onError);
  }
  await page.close();
}

await browser.close();
