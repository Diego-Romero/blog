#!/usr/bin/env node
import sharp from "sharp"
import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const outDir = join(root, "public/brand-concepts")
mkdirSync(outDir, { recursive: true })

const AMBER = "#FFB000"
const DARK = "#1A1A2E"
const GREEN = "#00D26A"
const MUTED = "#6A6A7A"
const LIGHT = "#E8E8E0"

// Concept 1: "d_" — initial + cursor
function concept1(size) {
  const fontSize = Math.round(size * 0.52)
  const r = Math.round(size * 0.18)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${DARK}"/>
  <text x="${size * 0.5}" y="${size * 0.58}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fontSize}" font-weight="700" fill="${AMBER}" text-anchor="middle" dominant-baseline="middle">d</text>
  <rect x="${size * 0.65}" y="${size * 0.38}" width="${Math.max(2, size * 0.06)}" height="${size * 0.3}" fill="${AMBER}" opacity="0.9">
    <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite"/>
  </rect>
</svg>`
}

// Concept 2: "dr>" — initials + chevron
function concept2(size) {
  const fontSize = Math.round(size * 0.38)
  const r = Math.round(size * 0.18)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${DARK}"/>
  <text x="${size * 0.32}" y="${size * 0.58}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fontSize}" font-weight="700" fill="${AMBER}" text-anchor="middle" dominant-baseline="middle">dr</text>
  <text x="${size * 0.76}" y="${size * 0.58}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fontSize}" font-weight="700" fill="${GREEN}" text-anchor="middle" dominant-baseline="middle">&gt;</text>
</svg>`
}

// Concept 3: "diego:~$" — full prompt (works best at larger sizes, simplified for small)
function concept3(size) {
  const r = Math.round(size * 0.18)
  if (size <= 32) {
    // Small: just "D$"
    const fontSize = Math.round(size * 0.42)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${DARK}"/>
  <text x="${size * 0.35}" y="${size * 0.58}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fontSize}" font-weight="700" fill="${AMBER}" text-anchor="middle" dominant-baseline="middle">D</text>
  <text x="${size * 0.7}" y="${size * 0.58}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fontSize}" font-weight="700" fill="${GREEN}" text-anchor="middle" dominant-baseline="middle">$</text>
</svg>`
  }
  const fontSize = Math.round(size * 0.18)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${DARK}"/>
  <text x="${size * 0.5}" y="${size * 0.45}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fontSize}" font-weight="700" fill="${AMBER}" text-anchor="middle" dominant-baseline="middle">diego</text>
  <text x="${size * 0.5}" y="${size * 0.7}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${Math.round(fontSize * 0.85)}" font-weight="400" fill="${GREEN}" text-anchor="middle" dominant-baseline="middle">:~$</text>
</svg>`
}

// Social banners for each concept
function socialBanner(concept, label, iconFn) {
  const iconSize = 80
  // Embed a simplified icon inline
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${DARK}"/>
  
  <!-- Grid -->
  ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="630" stroke="#232338" stroke-width="1" opacity="0.5"/>`).join("\n  ")}
  ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="1200" y2="${i * 60}" stroke="#232338" stroke-width="1" opacity="0.5"/>`).join("\n  ")}

  <!-- Name -->
  <text x="600" y="260" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="52" font-weight="700" fill="${LIGHT}" text-anchor="middle">Diego Romero</text>
  
  <!-- Separator -->
  <rect x="440" y="290" width="320" height="3" rx="1.5" fill="${AMBER}" opacity="0.6"/>
  
  <!-- Tagline -->
  <text x="600" y="340" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="20" fill="${MUTED}" text-anchor="middle">software engineer · writer</text>
  
  <!-- Concept label -->
  <text x="600" y="400" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="28" font-weight="700" fill="${AMBER}" text-anchor="middle">${label}</text>
  
  <!-- URL -->
  <text x="600" y="540" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="16" fill="${MUTED}" text-anchor="middle" opacity="0.7">diegoromero.blog</text>
</svg>`
}

const concepts = [
  { name: "concept-1-d-cursor", fn: concept1, label: "d_", bannerLabel: "d▌" },
  { name: "concept-2-dr-chevron", fn: concept2, label: "dr>", bannerLabel: "dr&gt;" },
  { name: "concept-3-diego-prompt", fn: concept3, label: "diego:~$", bannerLabel: "diego:~$" },
]

async function main() {
  console.log("Generating brand concepts...\n")

  for (const c of concepts) {
    // Icon at 96px and 180px
    for (const size of [96, 180, 512]) {
      const svg = c.fn(size)
      const outPath = join(outDir, `${c.name}-${size}.png`)
      await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath)
      console.log(`  ✓ ${c.name}-${size}.png`)
    }

    // Social banner
    const bannerSvg = socialBanner(c.name, c.bannerLabel, c.fn)
    const bannerPath = join(outDir, `${c.name}-banner.png`)
    await sharp(Buffer.from(bannerSvg)).resize(1200, 630).png().toFile(bannerPath)
    console.log(`  ✓ ${c.name}-banner.png`)
    console.log()
  }

  console.log("✅ All concepts generated in public/brand-concepts/")
}

main().catch(console.error)
