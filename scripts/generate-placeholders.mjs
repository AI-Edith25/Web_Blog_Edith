import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "images");
fs.mkdirSync(outDir, { recursive: true });

const NAVY = "#181e34";
const NAVY_LIGHT = "#2d334a";
const COPPER = "#835240";
const COPPER_LIGHT = "#febda6";

function coverSvg({ seed, accent }) {
  const rings = Array.from({ length: 5 }, (_, i) => {
    const r = 60 + i * 70;
    return `<circle cx="${seed % 2 === 0 ? 900 : 300}" cy="400" r="${r}" fill="none" stroke="${accent}" stroke-opacity="${0.5 - i * 0.08}" stroke-width="1.5" />`;
  }).join("\n      ");

  return `<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}" />
      <stop offset="100%" stop-color="${NAVY_LIGHT}" />
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg${seed})" />
  ${rings}
  <circle cx="${seed % 2 === 0 ? 900 : 300}" cy="400" r="36" fill="${accent}" fill-opacity="0.9" />
</svg>`;
}

function avatarSvg({ seed }) {
  const hueShift = seed * 18;
  return `<svg width="480" height="480" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="av${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}" />
      <stop offset="100%" stop-color="${COPPER}" />
    </linearGradient>
  </defs>
  <rect width="480" height="480" fill="url(#av${seed})" />
  <g transform="rotate(${hueShift} 240 240)">
    <circle cx="240" cy="180" r="70" fill="${COPPER_LIGHT}" fill-opacity="0.85" />
    <rect x="120" y="270" width="240" height="160" rx="80" fill="${COPPER_LIGHT}" fill-opacity="0.85" />
  </g>
</svg>`;
}

for (let i = 1; i <= 8; i += 1) {
  fs.writeFileSync(
    path.join(outDir, `cover-${i}.svg`),
    coverSvg({ seed: i, accent: i % 3 === 0 ? COPPER_LIGHT : COPPER })
  );
}

for (let i = 1; i <= 4; i += 1) {
  fs.writeFileSync(path.join(outDir, `avatar-${i}.svg`), avatarSvg({ seed: i }));
}

console.log("Placeholder images generated in public/images");
