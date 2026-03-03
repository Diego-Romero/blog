import { Metadata } from "next"
import Link from "@/components/Link"
import { allProtocols } from "contentlayer/generated"

export const metadata: Metadata = {
  title: "Protocols",
  description: "The routines and systems I use to stay sharp, healthy, and productive.",
}

const staticProtocols: { title: string; description: string; icon: string }[] = []

export default function ProtocolsPage() {
  // Build a map of published protocols by matching on title keywords
  const publishedProtocols = allProtocols
    .filter((p) => !p.draft)
    .reduce(
      (acc, p) => {
        acc[p.slug] = p
        return acc
      },
      {} as Record<string, (typeof allProtocols)[number]>
    )

  return (
    <div className="content-container">
      <div className="page-header">
        <p className="section-label">systems</p>
        <h1 className="section-title" style={{ fontSize: "1.6rem" }}>
          Protocols
        </h1>
      </div>

      <p
        style={{
          fontFamily: "var(--font-lora), Lora, Georgia, serif",
          color: "var(--muted)",
          marginBottom: "2rem",
          fontSize: "1rem",
          lineHeight: "1.7",
          maxWidth: "640px",
        }}
      >
        I treat my life like a codebase — everything worth doing gets a protocol. These are the
        routines and systems I actually use, updated as I learn what works. Each one is a living
        document.
      </p>

      <div className="protocol-grid">
        {/* Contentlayer-backed protocols — linked cards */}
        {allProtocols
          .filter((p) => !p.draft)
          .map((p) => (
            <Link
              key={p.slug}
              href={`/protocols/${p.slug}`}
              className="protocol-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className="protocol-icon">{p.icon || "📄"}</span>
              <div>
                <h3 className="protocol-title">{p.title}</h3>
                <p className="protocol-desc">{p.summary}</p>
              </div>
            </Link>
          ))}

        {/* Static "coming soon" protocols */}
        {staticProtocols.map((p) => (
          <div key={p.title} className="protocol-card">
            <span className="protocol-icon">{p.icon}</span>
            <div>
              <h3 className="protocol-title">{p.title}</h3>
              <p className="protocol-desc">{p.description}</p>
              <span
                style={{
                  fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                  fontSize: "0.6rem",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginTop: "0.5rem",
                  display: "inline-block",
                }}
              >
                coming soon
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
