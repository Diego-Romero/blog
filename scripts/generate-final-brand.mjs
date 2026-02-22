#!/usr/bin/env node
import sharp from "sharp"
import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const favDir = join(root, "public/static/favicons")
const imgDir = join(root, "public/static/images")

const AMBER = "#FFB000"
const DARK = "#1A1A2E"
const GREEN = "#00D26A"
const LIGHT = "#E8E8E0"
const MUTED = "#6A6A7A"

function icon(size) {
  const r = Math.round(size * 0.18)
  const fs = Math.round(size * 0.48)
  // Center the "d>" as a single unit
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${DARK}"/>
  <text x="${size * 0.5}" y="${size * 0.52}" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="${fs}" font-weight="700" text-anchor="middle" dominant-baseline="middle"><tspan fill="${AMBER}">d</tspan><tspan fill="${GREEN}">&gt;</tspan></text>
</svg>`
}

function safariSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <text x="8" y="9" font-family="'Courier New',monospace" font-size="10" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="#000000">d&gt;</text>
</svg>`
}

function socialBanner() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${DARK}"/>
  ${Array.from({ length: 20 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="630" stroke="#232338" stroke-width="1" opacity="0.5"/>`).join("\n  ")}
  ${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="1200" y2="${i * 60}" stroke="#232338" stroke-width="1" opacity="0.5"/>`).join("\n  ")}
  <text x="600" y="250" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="52" font-weight="700" fill="${LIGHT}" text-anchor="middle">Diego Romero</text>
  <rect x="440" y="280" width="320" height="3" rx="1.5" fill="${AMBER}" opacity="0.6"/>
  <text x="600" y="330" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="20" fill="${MUTED}" text-anchor="middle">software engineer · writer</text>
  <text x="600" y="400" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="36" font-weight="700" text-anchor="middle"><tspan fill="${AMBER}">d</tspan><tspan fill="${GREEN}">&gt;</tspan></text>
  <text x="600" y="540" font-family="'SF Mono','Fira Code','Courier New',monospace" font-size="16" fill="${MUTED}" text-anchor="middle" opacity="0.7">diegoromero.blog</text>
</svg>`
}

async function gen(svg, path, w, h) {
  await sharp(Buffer.from(svg)).resize(w, h || w).png().toFile(path)
  console.log(`  ✓ ${path}`)
}

async function generateIco(path) {
  const png16 = await sharp(Buffer.from(icon(16))).resize(16).png().toBuffer()
  const png32 = await sharp(Buffer.from(icon(32))).resize(32).png().toBuffer()
  const images = [{ data: png16, w: 16 }, { data: png32, w: 32 }]
  const hdr = Buffer.alloc(6)
  hdr.writeUInt16LE(0, 0); hdr.writeUInt16LE(1, 2); hdr.writeUInt16LE(2, 4)
  let off = 6 + 2 * 16
  const entries = [], datas = []
  for (const img of images) {
    const e = Buffer.alloc(16)
    e.writeUInt8(img.w, 0); e.writeUInt8(img.w, 1)
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6)
    e.writeUInt32LE(img.data.length, 8); e.writeUInt32LE(off, 12)
    entries.push(e); datas.push(img.data); off += img.data.length
  }
  writeFileSync(path, Buffer.concat([hdr, ...entries, ...datas]))
  console.log(`  ✓ ${path}`)
}

async function main() {
  console.log("Generating final d> brand assets (centered)...\n")
  await gen(icon(16), join(favDir, "favicon-16x16.png"), 16)
  await gen(icon(32), join(favDir, "favicon-32x32.png"), 32)
  await gen(icon(180), join(favDir, "apple-touch-icon.png"), 180)
  await gen(icon(96), join(favDir, "android-chrome-96x96.png"), 96)
  await gen(icon(150), join(favDir, "mstile-150x150.png"), 150)
  await generateIco(join(favDir, "favicon.ico"))
  writeFileSync(join(favDir, "safari-pinned-tab.svg"), safariSvg())
  console.log(`  ✓ safari-pinned-tab.svg`)
  await gen(icon(512), join(imgDir, "logo.png"), 512)
  await gen(socialBanner(), join(imgDir, "social-banner.png"), 1200, 630)
  console.log("\n✅ All done!")
}

main().catch(console.error)
