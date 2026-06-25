import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

const TITLE = "Verification Loop Test Article";

await page.goto("http://localhost:3000/studio/new", { waitUntil: "networkidle" });
await page.fill('input[placeholder="Enter Article Title..."]', TITLE);

const body = page.locator('div[contenteditable="true"]');
await body.click();
await page.keyboard.type("This is a verification paragraph confirming the rich text editor works end to end.");

await page.click('button:has-text("+ Add Tag")');
await page.fill('input[placeholder="Type and press Enter"]', "QA");
await page.keyboard.press("Enter");

await page.fill(
  'textarea[placeholder="Summarize this article for search engines..."]',
  "Verification loop test article seo description."
);

console.log("Slug field value before publish:", await page.inputValue('input[placeholder="article-slug"]'));

await page.click('button:has-text("Publish Article")');
await page.waitForURL(/\/studio\/edit\//, { timeout: 10000 });
const editUrl = page.url();
const articleId = editUrl.split("/").pop();
console.log("Published. Edit URL:", editUrl, "| id:", articleId);

const apiRes = await page.request.get(`http://localhost:3000/api/articles/${articleId}`);
const apiData = await apiRes.json();
console.log(
  "Article status:", apiData.article.status,
  "| slug:", apiData.article.slug,
  "| readTime:", apiData.article.readTimeMinutes,
  "| keywords:", apiData.article.keywords,
  "| excerpt:", apiData.article.excerpt
);
const slug = apiData.article.slug;

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
console.log("Homepage shows new title:", await page.locator(`text=${TITLE}`).first().isVisible());

await page.goto(`http://localhost:3000/article/${slug}`, { waitUntil: "networkidle" });
console.log("Article page title visible:", await page.locator("h1", { hasText: TITLE }).first().isVisible());

await page.goto(editUrl, { waitUntil: "networkidle" });
await page.click('button:has-text("Save Draft")');
await page.waitForTimeout(800);
console.log("After Save Draft, status badge shows DRAFTING:", await page.locator("text=DRAFTING").first().isVisible());

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
console.log("Homepage still shows draft title (should be false):", await page.locator(`text=${TITLE}`).first().isVisible());

await page.goto("http://localhost:3000/studio", { waitUntil: "networkidle" });
page.once("dialog", (d) => d.accept());
await page.click(`tr:has-text("${TITLE}") >> text=Delete`);
await page.waitForTimeout(800);
console.log("Article row gone after delete:", !(await page.locator(`text=${TITLE}`).first().isVisible()));

console.log("Console errors:", errors.length ? JSON.stringify(errors) : "none");
await browser.close();
