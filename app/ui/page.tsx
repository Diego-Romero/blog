/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next"
import Tag from "@/components/Tag"

export const metadata: Metadata = {
  title: "Design System — Terminal Warm",
  robots: { index: false, follow: false },
}

/* ── color palette ────────────────────────────────────── */
const primaryColors = [
  { name: "50", hex: "#fff8e1" },
  { name: "100", hex: "#ffecb3" },
  { name: "200", hex: "#ffe082" },
  { name: "300", hex: "#ffd54f" },
  { name: "400", hex: "#ffca28" },
  { name: "500", hex: "#FFB000" },
  { name: "600", hex: "#FFB000" },
  { name: "700", hex: "#e69f00" },
  { name: "800", hex: "#cc8e00" },
  { name: "900", hex: "#996b00" },
  { name: "950", hex: "#664700" },
]

const grayColors = [
  { name: "50", hex: "#FAFAF5" },
  { name: "100", hex: "#F0F0E8" },
  { name: "200", hex: "#D8D8C8" },
  { name: "300", hex: "#B8B8B8" },
  { name: "400", hex: "#8A8A9A" },
  { name: "500", hex: "#6A6A7A" },
  { name: "600", hex: "#4A4A5A" },
  { name: "700", hex: "#3A3A4A" },
  { name: "800", hex: "#2E2E4A" },
  { name: "900", hex: "#232338" },
  { name: "950", hex: "#1A1A2E" },
]

const semanticColors = [
  { name: "--bg", light: "#FAFAF5", dark: "#1A1A2E" },
  { name: "--fg", light: "#1A1A2E", dark: "#E8E8E0" },
  { name: "--accent", light: "#C88000", dark: "#FFB000" },
  { name: "--accent2", light: "#008844", dark: "#00D26A" },
  { name: "--surface", light: "#F0F0E8", dark: "#232338" },
  { name: "--muted", light: "#6A6A7A", dark: "#9090A0" },
  { name: "--border", light: "#D8D8C8", dark: "#2E2E4A" },
]

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="h-14 w-14 rounded-lg border border-[var(--border)] shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <span className="font-mono text-[11px] text-[var(--muted)]">{label}</span>
      <span className="font-mono text-[10px] text-[var(--muted)] opacity-60">{hex}</span>
    </div>
  )
}

function SemanticRow({ name, light, dark }: { name: string; light: string; dark: string }) {
  return (
    <div className="flex items-center gap-4">
      <code className="w-28 font-mono text-sm text-[var(--muted)]">{name}</code>
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded border border-[var(--border)]"
          style={{ backgroundColor: light }}
        />
        <span className="font-mono text-[10px] text-[var(--muted)]">{light}</span>
      </div>
      <span className="text-[var(--muted)]">→</span>
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded border border-[var(--border)]"
          style={{ backgroundColor: dark }}
        />
        <span className="font-mono text-[10px] text-[var(--muted)]">{dark}</span>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="font-mono text-2xl font-bold text-[var(--accent)]">{title}</h2>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>
      {children}
    </section>
  )
}

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 px-4 py-12 sm:px-6">
      {/* Header */}
      <header className="space-y-4">
        <p className="font-mono text-sm text-[var(--accent)]">&gt;_ design-system</p>
        <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl">Terminal Warm</h1>
        <p className="max-w-2xl font-serif text-lg text-[var(--muted)]">
          A developer-centric visual language blending monospace precision with warm, readable
          typography. Amber and green accents on deep charcoal — or warm white in light mode.
        </p>
      </header>

      {/* ─── Colors ───────────────────────────────────── */}
      <Section title="Colors">
        <div className="space-y-8">
          <div>
            <h3 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Primary (Amber)
            </h3>
            <div className="flex flex-wrap gap-3">
              {primaryColors.map((c) => (
                <Swatch key={c.name} hex={c.hex} label={c.name} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Gray (Charcoal)
            </h3>
            <div className="flex flex-wrap gap-3">
              {grayColors.map((c) => (
                <Swatch key={c.name} hex={c.hex} label={c.name} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Semantic Tokens (Light → Dark)
            </h3>
            <div className="space-y-3">
              {semanticColors.map((c) => (
                <SemanticRow key={c.name} {...c} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Typography ───────────────────────────────── */}
      <Section title="Typography">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Space Mono — Headings &amp; UI
            </h3>
            <div className="space-y-2">
              <p className="font-mono text-4xl font-bold">The quick brown fox</p>
              <p className="font-mono text-2xl font-bold">jumps over the lazy dog</p>
              <p className="font-mono text-xl">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p className="font-mono text-base">abcdefghijklmnopqrstuvwxyz 0123456789</p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Lora — Body Text
            </h3>
            <div className="space-y-2">
              <p className="font-serif text-2xl">The quick brown fox jumps over the lazy dog</p>
              <p className="font-serif text-lg leading-relaxed">
                Good prose is like a windowpane. The best writing is invisible — it lets meaning
                pass through without calling attention to itself. This is Lora at body size,
                optimized for comfortable long-form reading.
              </p>
              <p className="font-serif text-base italic text-[var(--muted)]">
                Lora italic — for emphasis, quotes, and annotations
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Fira Code — Code Blocks
            </h3>
            <div className="overflow-x-auto rounded-lg bg-[var(--code-bg)] p-4">
              <pre className="font-code text-sm leading-relaxed text-[#e8e8e0]">
                <code>{`const theme = {
  name: "Terminal Warm",
  accent: "#FFB000",   // amber
  accent2: "#00D26A",  // green
  bg: "#1A1A2E",       // charcoal
  fg: "#E8E8E0",       // warm white
};

// Ligatures: => !== === >= <=
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`}</code>
              </pre>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Type Scale
            </h3>
            <div className="space-y-2">
              {[
                { size: "text-xs", label: "12px — Caption" },
                { size: "text-sm", label: "14px — Small / UI" },
                { size: "text-base", label: "16px — Body" },
                { size: "text-lg", label: "18px — Lead" },
                { size: "text-xl", label: "20px — H4" },
                { size: "text-2xl", label: "24px — H3" },
                { size: "text-3xl", label: "30px — H2" },
                { size: "text-4xl", label: "36px — H1" },
              ].map(({ size, label }) => (
                <p key={size} className={`${size} font-mono`}>
                  {label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Components ───────────────────────────────── */}
      <Section title="Components">
        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              <Tag text="next-js" />
              <Tag text="react" />
              <Tag text="typescript" />
              <Tag text="tailwind-css" />
              <Tag text="productivity" />
              <Tag text="design" />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Buttons &amp; Links
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-md bg-[var(--accent)] px-4 py-2 font-mono text-sm font-semibold text-[var(--bg)] transition hover:opacity-80">
                Primary Button
              </span>
              <span className="rounded-md border-2 border-[var(--accent)] px-4 py-2 font-mono text-sm font-semibold text-[var(--accent)]">
                Outline Button
              </span>
              <span className="font-mono text-sm text-[var(--accent)]">Text Link →</span>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Card
            </h3>
            <div className="max-w-md overflow-hidden rounded-md border-2 border-[var(--border)]">
              <div className="p-6">
                <h4 className="mb-2 font-mono text-xl font-bold">Example Project</h4>
                <p className="mb-3 font-serif text-[var(--muted)]">
                  A brief description of the project, what it does, and why it matters. Built with
                  TypeScript and deployed on Vercel.
                </p>
                <span className="font-mono text-sm text-[var(--accent)]">Learn more →</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Terminal Prompt (Header Style)
            </h3>
            <div className="rounded-lg bg-[var(--surface)] px-4 py-3">
              <span className="font-mono text-base">
                <span className="text-[var(--accent)]">diego</span>
                <span className="text-[var(--muted)]">@</span>
                <span className="text-[#00d26a]">blog</span>
                <span className="text-[var(--muted)]">:~$ </span>
                <span className="animate-pulse text-[var(--fg)]">▌</span>
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Inline Code
            </h3>
            <p className="font-serif text-base">
              {"Use "}
              <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-code text-sm text-[var(--accent)]">
                const x = 42
              </code>
              {" for inline code, and "}
              <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-code text-sm text-[var(--accent)]">
                npm run dev
              </code>
              {" for commands."}
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Spacing ──────────────────────────────────── */}
      <Section title="Spacing &amp; Layout">
        <div className="space-y-6">
          <p className="font-serif text-[var(--muted)]">
            {"Layout uses a "}
            <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-code text-sm text-[var(--accent)]">
              max-w-4xl
            </code>
            {
              " container (896px) with responsive padding. The 4px base grid produces consistent visual rhythm."
            }
          </p>
          <div className="space-y-2">
            {[4, 8, 12, 16, 24, 32, 48, 64].map((px) => (
              <div key={px} className="flex items-center gap-4">
                <span className="w-12 text-right font-mono text-xs text-[var(--muted)]">
                  {px}px
                </span>
                <div
                  className="h-4 rounded bg-[var(--accent)]"
                  style={{ width: `${px * 2}px`, opacity: 0.7 }}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Brand Assets ─────────────────────────────── */}
      <Section title="Brand Assets">
        <div className="space-y-4">
          <p className="font-serif text-[var(--muted)]">
            {"The favicon and logo use a terminal prompt "}
            <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-code text-sm text-[var(--accent)]">
              &gt;_
            </code>
            {" mark — amber on charcoal, matching the site\u2019s identity."}
          </p>
          <div className="flex flex-wrap items-end gap-6">
            {[16, 32, 96, 180].map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <img
                  src={
                    size === 180
                      ? "/static/favicons/apple-touch-icon.png"
                      : size === 96
                        ? "/static/favicons/android-chrome-96x96.png"
                        : `/static/favicons/favicon-${size}x${size}.png`
                  }
                  alt={`Favicon ${size}x${size}`}
                  width={size}
                  height={size}
                  className="rounded-lg border border-[var(--border)]"
                />
                <span className="font-mono text-[10px] text-[var(--muted)]">
                  {size}×{size}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="mb-2 font-mono text-sm text-[var(--muted)]">Social Banner (1200×630)</p>
            <img
              src="/static/images/social-banner.png"
              alt="Social sharing banner"
              className="w-full max-w-xl rounded-lg border border-[var(--border)]"
            />
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] pt-8 text-center">
        <p className="font-mono text-sm text-[var(--muted)]">
          Terminal Warm Design System · diegoromero.blog
        </p>
      </footer>
    </div>
  )
}
