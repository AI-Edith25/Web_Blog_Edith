import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "edith.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    authorName TEXT NOT NULL,
    authorRole TEXT NOT NULL,
    authorAvatarUrl TEXT NOT NULL,
    coverImageUrl TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    bodyHtml TEXT NOT NULL,
    readTimeMinutes INTEGER NOT NULL,
    seoMetaDescription TEXT NOT NULL DEFAULT '',
    keywords TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'drafting',
    publishedAt TEXT,
    scheduledFor TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

const existing = db.prepare("SELECT COUNT(*) AS c FROM articles").get();
if (existing.c > 0 && !process.argv.includes("--force")) {
  console.log(`Database already has ${existing.c} article(s). Skipping seed (use --force to wipe & reseed).`);
  process.exit(0);
}

if (process.argv.includes("--force")) {
  db.exec("DELETE FROM articles");
}

const DOCTORS = {
  elena: { name: "Dr. Elena Marchetti", role: "Lead Dermatologist", avatarUrl: "/images/avatar-1.svg" },
  adrian: { name: "Dr. Adrian Voss", role: "Director of Aesthetic Medicine", avatarUrl: "/images/avatar-2.svg" },
  naomi: { name: "Dr. Naomi Reyes", role: "Head of Clinical Research", avatarUrl: "/images/avatar-3.svg" },
};

function pullquote(doctor, quote) {
  return `<blockquote class="expert-insight" data-name="${doctor.name}" data-role="${doctor.role}, Edith Clinic" data-avatar="${doctor.avatarUrl}"><p>${quote}</p></blockquote>`;
}

function readTime(html) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean);
  return Math.max(1, Math.round(words.length / 200));
}

const articles = [
  {
    slug: "molecular-evolution-of-skin-regeneration",
    title: "The Molecular Evolution of Skin Regeneration",
    category: "Clinical Research",
    author: DOCTORS.naomi,
    coverImageUrl: "/images/cover-1.svg",
    excerpt:
      "Inside the signaling cascades that govern how skin rebuilds itself, and what twenty years of regenerative research now make possible.",
    seoMetaDescription:
      "How dermal regeneration actually works at the molecular level, and what it means for modern clinical skincare protocols.",
    keywords: ["Dermatology", "Cell Biology", "Regeneration"],
    bodyHtml: `
<p>Skin regeneration was once described in purely mechanical terms: wound, clot, scar. Today, dermatological research treats it as a precisely timed molecular conversation between keratinocytes, fibroblasts, and the immune system, one that clinicians can now read, and increasingly, direct.</p>
<h2>From Wound Healing to Signal Engineering</h2>
<p>The classical four-phase model of healing, hemostasis, inflammation, proliferation, and remodeling, still holds, but the resolution has changed entirely. We can now trace the specific growth factor gradients, namely TGF-beta, PDGF, and FGF-2, that direct fibroblasts to migrate, proliferate, and lay down a provisional collagen matrix within hours of micro-injury.</p>
<p>This precision is what makes modern in-clinic regenerative protocols, from controlled micro-needling to fractional energy devices, fundamentally different from earlier generations of resurfacing treatments. Rather than simply removing tissue, we are now selecting which signaling pathway to provoke.</p>
${pullquote(DOCTORS.elena, "We used to treat the skin barrier as a wall to repair. It is closer to a switchboard, and our protocols are finally precise enough to dial the right number.")}
<h2>The Stem Cell Niche Revisited</h2>
<p>Recent work on the bulge region of the hair follicle and the basal layer of the epidermis has clarified how epidermal stem cells are kept in reserve, and what triggers their activation. Understanding this niche has direct clinical relevance: protocols that inadvertently exhaust this reserve produce short-term glow at the cost of long-term resilience.</p>
<ul>
<li>Basal stem cells respond to mechanical and chemical cues differently across age groups</li>
<li>Chronic low-grade inflammation measurably slows niche activation</li>
<li>Regenerative outcomes correlate more with signaling timing than with treatment intensity</li>
</ul>
<h2>What This Means in Practice</h2>
<p>For patients, the takeaway is reassuring: effective regeneration rarely requires aggressive intervention. It requires the right sequence, the right interval between sessions, and a clinical read of where the skin's own repair systems are already working hardest.</p>
<p>At Edith Clinic, every regenerative protocol begins with this question rather than with a fixed device setting, a distinction that increasingly defines the difference between cosmetic improvement and genuine dermal recovery.</p>
`,
    publishedAt: "2026-06-18T09:00:00.000Z",
  },
  {
    slug: "future-of-non-invasive-skin-tightening",
    title: "The Future of Non-Invasive Skin Tightening",
    category: "Treatments",
    author: DOCTORS.adrian,
    coverImageUrl: "/images/cover-2.svg",
    excerpt:
      "Energy-based tightening has moved past the era of broad heat. Here is how multi-depth targeting is redefining what 'non-invasive' can mean.",
    seoMetaDescription:
      "A clinical look at how modern non-invasive skin tightening devices target depth and tissue type with new levels of precision.",
    keywords: ["Skin Tightening", "Energy Devices", "Aesthetic Medicine"],
    bodyHtml: `
<p>For more than a decade, "non-invasive tightening" meant one thing: deliver heat, trigger contraction, hope for collagen remodeling beneath. The newest generation of devices has quietly rewritten that promise into something far more deliberate.</p>
<h2>Depth Is the New Dial</h2>
<p>Where earlier radiofrequency and ultrasound platforms worked in a single, broad energy band, current systems can resolve treatment depth in increments as fine as half a millimeter, distinguishing dermis from superficial fat from SMAS-level fascia. This matters because each layer responds to thermal stimulation differently, and at different temperature thresholds.</p>
<p>The clinical consequence is a shift from "more energy, more lift" toward layered protocols: a lower, broader pass to prime the dermis, followed by focused passes at the depth where laxity actually originates for that individual patient.</p>
${pullquote(DOCTORS.naomi, "The data is unambiguous on one point: tissue selectivity outperforms raw energy output in every outcome metric we track, comfort, downtime, and durability of result.")}
<h2>Why Combination Protocols Are Winning</h2>
<p>No single modality addresses every contributor to skin laxity, fat distribution, collagen density, and elastic fiber quality all play independent roles. The most consistent results we see now combine microfocused ultrasound for the fascia, radiofrequency for dermal collagen, and targeted bio-stimulatory injectables for matrix support.</p>
<ul>
<li>Microfocused ultrasound for deep structural lift</li>
<li>Radiofrequency for dermal thickening and tone</li>
<li>Bio-stimulatory injectables to sustain collagen turnover between sessions</li>
</ul>
<h2>Setting Realistic Expectations</h2>
<p>Non-invasive will likely never fully replace surgical correction for advanced laxity, and overpromising on that point erodes trust. What has changed is the ceiling of what non-invasive can achieve for early-to-moderate laxity, now firmly within the range previously reserved for more invasive options.</p>
`,
    publishedAt: "2026-06-15T09:00:00.000Z",
  },
  {
    slug: "retinol-vs-bakuchiol-clinical-face-off",
    title: "Retinol vs. Bakuchiol: A Clinical Face-Off",
    category: "Skincare",
    author: DOCTORS.elena,
    coverImageUrl: "/images/cover-3.svg",
    excerpt:
      "One is the gold standard with decades of evidence. The other is the gentler challenger. We compare them ingredient by ingredient, study by study.",
    seoMetaDescription:
      "Retinol versus bakuchiol compared on efficacy, tolerability, and clinical evidence for anti-aging and acne-prone skin.",
    keywords: ["Retinol", "Bakuchiol", "Skincare", "Anti-Aging"],
    bodyHtml: `
<p>Few ingredient rivalries generate as much patient curiosity as this one: retinol, the most studied molecule in anti-aging dermatology, against bakuchiol, its plant-derived challenger marketed as the gentle alternative.</p>
<h2>The Case for Retinol</h2>
<p>Retinol's mechanism is well mapped. As a vitamin A derivative, it binds retinoic acid receptors in keratinocytes, accelerating cell turnover, stimulating collagen synthesis, and normalizing pigment production. Forty years of peer-reviewed data make it the benchmark against which every new anti-aging ingredient is measured.</p>
<p>Its drawback is equally well known: irritation, dryness, and photosensitivity during the adjustment period, a barrier that causes a meaningful share of patients to abandon treatment before benefits appear.</p>
${pullquote(DOCTORS.adrian, "Efficacy that a patient cannot tolerate long enough to experience is not efficacy. Tolerability is a clinical outcome, not a marketing footnote.")}
<h2>What Bakuchiol Actually Delivers</h2>
<p>Bakuchiol activates an overlapping set of retinoid-responsive genes without binding the same receptors directly, which appears to be why several split-face studies report comparable improvements in fine lines and pigmentation with substantially less irritation.</p>
<p>It is not a perfect substitute. Bakuchiol's evidence base, while growing, remains smaller than retinol's, and its performance on deeper, established wrinkles tends to trail behind higher-strength retinoid regimens.</p>
<ul>
<li>Retinol: stronger evidence base, faster results, higher irritation risk</li>
<li>Bakuchiol: comparable tolerability profile, slower onset, better fit for sensitive or reactive skin</li>
<li>Combination tapering protocols often outperform committing to either ingredient alone</li>
</ul>
<h2>Our Clinical Recommendation</h2>
<p>Rather than choosing sides, we typically prescribe a tapering protocol: bakuchiol to build tolerance and barrier resilience, followed by a gradual retinol introduction once the skin demonstrates it can handle the transition. Sequencing, not allegiance, produces the best long-term result.</p>
`,
    publishedAt: "2026-06-10T09:00:00.000Z",
  },
  {
    slug: "peptides-and-the-collagen-cycle",
    title: "Peptides and the Collagen Cycle",
    category: "Anti-Aging",
    author: DOCTORS.naomi,
    coverImageUrl: "/images/cover-4.svg",
    excerpt:
      "Peptides do not rebuild collagen overnight. Here is what they actually do to the signaling cycle that keeps skin structurally sound.",
    seoMetaDescription:
      "How signal peptides interact with the dermal collagen cycle, and why patience matters more than concentration.",
    keywords: ["Peptides", "Collagen", "Anti-Aging", "Dermatology"],
    bodyHtml: `
<p>Peptide skincare is often sold on a simple promise: more collagen, fewer wrinkles. The biology underneath that promise is more interesting, and more useful to understand, than the marketing copy suggests.</p>
<h2>Collagen Is a Cycle, Not a Reservoir</h2>
<p>Dermal collagen is in constant turnover, continuously synthesized by fibroblasts and continuously broken down by matrix metalloproteinases. Aging shifts this balance toward degradation, not because synthesis stops, but because the signals that previously suppressed breakdown weaken over time.</p>
<p>Signal peptides, short chains of amino acids, work by mimicking the fragments that naturally trigger fibroblast activity, effectively nudging that balance back toward synthesis without forcing an artificial spike in collagen production.</p>
${pullquote(DOCTORS.elena, "Peptides do not rebuild collagen instantaneously. They recalibrate the signaling environment to favor synthesis over degradation, and recalibration takes weeks, not days.")}
<h2>Why Timelines Are Longer Than Expected</h2>
<p>Because peptides work upstream of collagen production rather than supplying collagen directly, visible improvement typically requires eight to twelve weeks of consistent use, a timeline that disappoints patients expecting retinol-speed results.</p>
<ul>
<li>Copper peptides support enzymatic processes involved in tissue repair</li>
<li>Signal peptides (like palmitoyl pentapeptides) stimulate fibroblast collagen synthesis</li>
<li>Carrier peptides assist delivery of trace elements relevant to wound healing</li>
</ul>
<h2>Pairing Peptides Correctly</h2>
<p>Peptides are not inherently incompatible with retinoids or vitamin C, but layering order and pH matter. We generally recommend peptide serums in the evening, separated from low-pH acids, to avoid denaturing the peptide structure before it can act.</p>
`,
    publishedAt: "2026-06-05T09:00:00.000Z",
  },
  {
    slug: "circadian-rhythms-and-dermal-repair",
    title: "Circadian Rhythms and Dermal Repair",
    category: "Wellness",
    author: DOCTORS.elena,
    coverImageUrl: "/images/cover-5.svg",
    excerpt:
      "Skin does not repair itself uniformly across the day. Understanding its internal clock changes when treatments and products work best.",
    seoMetaDescription:
      "How the skin's circadian rhythm affects barrier repair, and how to time skincare and treatments around it.",
    keywords: ["Circadian Rhythm", "Skin Barrier", "Wellness"],
    bodyHtml: `
<p>The skin runs on its own clock, one that is measurably out of sync with how most skincare routines are designed. Recognizing that clock changes not just what we apply, but when.</p>
<h2>Night Is for Repair, Day Is for Defense</h2>
<p>Transepidermal water loss, cell division, and microcirculation all peak overnight, while the skin's antioxidant defenses and barrier lipid production are highest during the day. This is not a coincidence; it reflects an evolved division of labor between protection from environmental stress and internal repair.</p>
<p>This is why dermatologists consistently recommend antioxidants and barrier-supporting actives in the morning, and reparative or proliferative ingredients, like retinoids and peptides, at night: the routine works with the skin's clock rather than against it.</p>
${pullquote(DOCTORS.adrian, "Circadian misalignment from poor sleep shows up on the face before it shows up anywhere else, in barrier function, in microcirculation, well before it appears in mood or energy.")}
<h2>Sleep Disruption Has a Measurable Dermal Cost</h2>
<p>Studies tracking shift workers and chronically sleep-deprived patients show slower barrier recovery after standardized irritation testing, and reduced collagen density over time. The mechanism appears to run through cortisol dysregulation, which directly suppresses fibroblast activity.</p>
<ul>
<li>Apply antioxidant serums (vitamin C, niacinamide) in the morning</li>
<li>Reserve retinoids, peptides, and heavier repair actives for the evening</li>
<li>Treat consistent sleep timing as a clinical variable, not a lifestyle footnote</li>
</ul>
<h2>Designing Around the Clock</h2>
<p>At Edith Clinic, in-room treatments are increasingly scheduled with this rhythm in mind, energy-based procedures earlier in the day, and regenerative or injectable protocols timed to align with the evening repair window whenever a patient's schedule allows it.</p>
`,
    publishedAt: "2026-05-30T09:00:00.000Z",
  },
  {
    slug: "mapping-the-skin-microbiome",
    title: "Mapping the Skin Microbiome: A New Frontier",
    category: "Clinical Research",
    author: DOCTORS.adrian,
    coverImageUrl: "/images/cover-6.svg",
    excerpt:
      "The skin's bacterial ecosystem is no longer a footnote in dermatology. Sequencing data is reshaping how we think about barrier health.",
    seoMetaDescription:
      "An emerging look at how skin microbiome sequencing is changing dermatological approaches to barrier health and inflammation.",
    keywords: ["Microbiome", "Skin Barrier", "Clinical Research"],
    bodyHtml: `
<p>Draft notes: structure this around the three major microbiome sequencing studies from the last eighteen months, then connect to clinical implications for barrier-focused protocols.</p>
<h2>Section pending</h2>
<p>Outline the dominant bacterial genera (Cutibacterium, Staphylococcus, Corynebacterium) and their relative shifts across age and skin type before drafting the full clinical narrative.</p>
`,
    status: "drafting",
  },
  {
    slug: "personalized-skincare-algorithms",
    title: "The Rise of Personalized Skincare Algorithms",
    category: "Wellness",
    author: DOCTORS.naomi,
    coverImageUrl: "/images/cover-7.svg",
    excerpt:
      "Skincare recommendation engines are starting to use real diagnostic data instead of quiz answers. Here is what that shift actually means.",
    seoMetaDescription:
      "How diagnostic-grade imaging and data are replacing quiz-based skincare personalization, and what it means for patients.",
    keywords: ["Personalization", "Skin Diagnostics", "Wellness"],
    bodyHtml: `
<p>Personalized skincare has existed as a marketing category for years, mostly built on quiz answers. The next generation is built on diagnostic imaging data instead, and that distinction matters more than it sounds.</p>
<h2>From Quizzes to Diagnostics</h2>
<p>Multispectral imaging can now quantify sebum distribution, sub-surface pigmentation, and early collagen degradation at a resolution no questionnaire can approximate, turning "personalization" from a guess into a measurement.</p>
<h2>What This Changes Clinically</h2>
<p>Protocols built on this data adjust faster, because they are tracking the same measurable markers visit over visit, rather than relying on subjective patient-reported improvement alone.</p>
`,
    status: "scheduled",
    scheduledFor: "2026-07-01T09:00:00.000Z",
  },
];

const insert = db.prepare(`
  INSERT INTO articles
  (id, slug, title, category, authorName, authorRole, authorAvatarUrl,
   coverImageUrl, excerpt, bodyHtml, readTimeMinutes, seoMetaDescription,
   keywords, status, publishedAt, scheduledFor, createdAt, updatedAt)
  VALUES (@id, @slug, @title, @category, @authorName, @authorRole, @authorAvatarUrl,
   @coverImageUrl, @excerpt, @bodyHtml, @readTimeMinutes, @seoMetaDescription,
   @keywords, @status, @publishedAt, @scheduledFor, @createdAt, @updatedAt)
`);

const now = new Date().toISOString();

for (const a of articles) {
  const status = a.status ?? "published";
  insert.run({
    id: randomUUID(),
    slug: a.slug,
    title: a.title,
    category: a.category,
    authorName: a.author.name,
    authorRole: a.author.role,
    authorAvatarUrl: a.author.avatarUrl,
    coverImageUrl: a.coverImageUrl,
    excerpt: a.excerpt,
    bodyHtml: a.bodyHtml.trim(),
    readTimeMinutes: readTime(a.bodyHtml),
    seoMetaDescription: a.seoMetaDescription,
    keywords: JSON.stringify(a.keywords),
    status,
    publishedAt: a.publishedAt ?? null,
    scheduledFor: a.scheduledFor ?? null,
    createdAt: a.publishedAt ?? now,
    updatedAt: a.publishedAt ?? now,
  });
}

console.log(`Seeded ${articles.length} articles.`);
