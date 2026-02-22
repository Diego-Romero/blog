#!/usr/bin/env node
/**
 * Generate Terminal Warm brand assets
 * Uses sharp to create PNGs from SVG templates
 */
import sharp from "sharp"
import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const favDir = join(root, "public/static/favicons")
const imgDir = join(root, "public/static/images")

// Terminal Warm palette
const AMBER = "#FFB000"
const DARK = "#1A1A2E"
const SURFACE = "#232338"
const LIGHT = "#FAFAF5"
const MUTED = "#6A6A7A"
const GREEN = "#00D26A"

// Icon SVG: terminal prompt ">_" style mark
function iconSvg(size, bg = DARK, fg = AMBER) {
  const pad = Math.round(size * 0.18)
  const stroke = Math.max(2, Math.round(size * 0.08))
  const mid = size / 2
  // ">" chevron
  const chevX1 = pad
  const chevY1 = pad + size * 0.1
  const chevX2 = mid - pad * 0.3
  const chevY2 = mid
  const chevY3 = size - pad - size * 0.1
  // "_" underscore
  const ulX1 = mid + pad * 0.1
  const ulX2 = size - pad
  const ulY = size - pad - size * 0.1

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="${bg}"/>
  <polyline points="${chevX1},${chevY1} ${chevX2},${chevY2} ${chevX1},${chevY3}" 
    fill="none" stroke="${fg}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="${ulX1}" y1="${ulY}" x2="${ulX2}" y2="${ulY}" 
    stroke="${fg}" stroke-width="${stroke}" stroke-linecap="round"/>
</svg>`
}

// Safari pinned tab (monochrome, no bg)
function safariSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <polyline points="2,3 7,8 2,13" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="8.5" y1="13" x2="14" y2="13" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
</svg>`
}

// Social banner (1200x630)
function socialBannerSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${DARK}"/>
  
  <!-- Subtle grid lines -->
  ${Array.from(
    { length: 20 },
    (_, i) =>
      `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="630" stroke="${SURFACE}" stroke-width="1" opacity="0.5"/>`
  ).join("\n  ")}
  ${Array.from(
    { length: 11 },
    (_, i) =>
      `<line x1="0" y1="${i * 60}" x2="1200" y2="${i * 60}" stroke="${SURFACE}" stroke-width="1" opacity="0.5"/>`
  ).join("\n  ")}
  
  <!-- Terminal prompt icon -->
  <polyline points="440,240 490,275 440,310" fill="none" stroke="${AMBER}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="500" y1="310" x2="560" y2="310" stroke="${AMBER}" stroke-width="6" stroke-linecap="round"/>
  
  <!-- Name -->
  <text x="600" y="290" font-family="'Space Mono', 'SF Mono', 'Courier New', monospace" font-size="48" font-weight="700" fill="${LIGHT}" text-anchor="start" letter-spacing="-1">Diego Romero</text>
  
  <!-- Tagline -->
  <text x="600" y="340" font-family="'Space Mono', 'SF Mono', 'Courier New', monospace" font-size="20" fill="${MUTED}" text-anchor="start">software engineer · writer</text>
  
  <!-- Accent line -->
  <rect x="440" y="380" width="320" height="3" rx="1.5" fill="${AMBER}" opacity="0.6"/>
  
  <!-- URL -->
  <text x="600" y="430" font-family="'Space Mono', 'SF Mono', 'Courier New', monospace" font-size="16" fill="${MUTED}" text-anchor="start" opacity="0.7">diegoromero.blog</text>
</svg>`
}

// Logo (larger, for general use)
function logoSvg() {
  return iconSvg(512, DARK, AMBER)
}

async function generatePng(svg, outputPath, width, height) {
  const buf = Buffer.from(svg)
  await sharp(buf)
    .resize(width, height || width)
    .png()
    .toFile(outputPath)
  console.log(`  ✓ ${outputPath}`)
}

async function generateIco(svg16, svg32, outputPath) {
  // Generate both PNGs, then create a minimal ICO
  const png16 = await sharp(Buffer.from(svg16)).resize(16, 16).png().toBuffer()
  const png32 = await sharp(Buffer.from(svg32)).resize(32, 32).png().toBuffer()

  // ICO format: header + entries + image data
  const images = [
    { data: png16, width: 16, height: 16 },
    { data: png32, width: 32, height: 32 },
  ]

  const headerSize = 6
  const entrySize = 16
  let offset = headerSize + images.length * entrySize

  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // ICO type
  header.writeUInt16LE(images.length, 4)

  const entries = []
  const datas = []

  for (const img of images) {
    const entry = Buffer.alloc(entrySize)
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0)
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1)
    entry.writeUInt8(0, 2) // colors
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // planes
    entry.writeUInt16LE(32, 6) // bpp
    entry.writeUInt32LE(img.data.length, 8) // size
    entry.writeUInt32LE(offset, 12) // offset
    entries.push(entry)
    datas.push(img.data)
    offset += img.data.length
  }

  const ico = Buffer.concat([header, ...entries, ...datas])
  writeFileSync(outputPath, ico)
  console.log(`  ✓ ${outputPath}`)
}

async function main() {
  console.log("Generating Terminal Warm brand assets...\n")

  mkdirSync(favDir, { recursive: true })
  mkdirSync(imgDir, { recursive: true })

  // Favicons
  const icon16 = iconSvg(16)
  const icon32 = iconSvg(32)

  await generatePng(iconSvg(16), join(favDir, "favicon-16x16.png"), 16)
  await generatePng(iconSvg(32), join(favDir, "favicon-32x32.png"), 32)
  await generatePng(iconSvg(180), join(favDir, "apple-touch-icon.png"), 180)
  await generatePng(iconSvg(96), join(favDir, "android-chrome-96x96.png"), 96)
  await generatePng(iconSvg(150), join(favDir, "mstile-150x150.png"), 150)
  await generateIco(icon16, icon32, join(favDir, "favicon.ico"))

  // Safari pinned tab
  writeFileSync(join(favDir, "safari-pinned-tab.svg"), safariSvg())
  console.log(`  ✓ ${join(favDir, "safari-pinned-tab.svg")}`)

  // Logo
  await generatePng(logoSvg(), join(imgDir, "logo.png"), 512)

  // Social banner
  await generatePng(socialBannerSvg(), join(imgDir, "social-banner.png"), 1200, 630)

  console.log("\n✅ All assets generated!")
}

main().catch(console.error)
