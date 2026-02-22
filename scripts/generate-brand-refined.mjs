#!/usr/bin/env node
import sharp from "sharp"
import { mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const outDir = join(root, "public/brand-concepts")
mkdirSync(outDir, { recursive: true })

const AMBER = "#FFB000"
const DARK = "#1A1A2E"
const GREEN = "#00D26A"

// letter + cursor variant
function letterCursor(size, letter) {
  const r = Math.round(size * 0.18)
  const fs = Math.round(size * 0.55)
  // Position letter slightly left of center, cursor to the right
  const letterX = size * 0.42
  const cursorX = size * 0.68
  const cursorW = Math.max(2, Math.round(size * 0.07))
  const cursorH = size * 0.35
  const cursorY = size * 0.32
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${DARK}"/>
  <text x="${letterX}" y="${size * 0.6}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fs}" font-weight="700" fill="${AMBER}" text-anchor="middle" dominant-baseline="middle">${letter}</text>
  <rect x="${cursorX}" y="${cursorY}" width="${cursorW}" height="${cursorH}" fill="${AMBER}" opacity="0.85"/>
</svg>`
}

// letter + chevron variant
function letterChevron(size, letter) {
  const r = Math.round(size * 0.18)
  const fs = Math.round(size * 0.5)
  const letterX = size * 0.35
  const chevronX = size * 0.72
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${DARK}"/>
  <text x="${letterX}" y="${size * 0.58}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fs}" font-weight="700" fill="${AMBER}" text-anchor="middle" dominant-baseline="middle">${letter}</text>
  <text x="${chevronX}" y="${size * 0.58}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fs}" font-weight="700" fill="${GREEN}" text-anchor="middle" dominant-baseline="middle">&gt;</text>
</svg>`
}

const variants = [
  { name: "v1-d-cursor", label: "d▌", fn: (s) => letterCursor(s, "d") },
  { name: "v2-D-cursor", label: "D▌", fn: (s) => letterCursor(s, "D") },
  { name: "v3-D-chevron", label: "D>", fn: (s) => letterChevron(s, "D") },
  { name: "v4-d-chevron", label: "d>", fn: (s) => letterChevron(s, "d") },
]

async function main() {
  console.log("Generating refined brand variants...\n")
  for (const v of variants) {
    for (const size of [16, 32, 96, 512]) {
      const svg = v.fn(size)
      const outPath = join(outDir, `${v.name}-${size}.png`)
      await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath)
      console.log(`  ✓ ${v.name}-${size}.png`)
    }
    console.log()
  }
  console.log("✅ Done")
}

main().catch(console.error)
