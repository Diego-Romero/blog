import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Protocols",
  description: "The routines and systems I use to stay sharp, healthy, and productive.",
}

const protocols = [
  {
    title: "Morning Protocol",
    description: "Wake, move, focus. The first 90 minutes that set the tone for the day.",
    icon: "☀️",
    status: "coming soon",
  },
  {
    title: "Evening Protocol",
    description: "Wind down, reflect, prepare for tomorrow.",
    icon: "🌙",
    status: "coming soon",
  },
  {
    title: "Workout Protocol",
    description: "Daily hypertrophy training, morning cardio, and recovery strategies.",
    icon: "🏋️",
    status: "coming soon",
  },
  {
    title: "Deep Work Protocol",
    description: "How I structure focused, distraction-free work blocks.",
    icon: "🧠",
    status: "coming soon",
  },
  {
    title: "Weekly Review",
    description: "Sunday reset — review the week, plan the next, recalibrate.",
    icon: "📋",
    status: "coming soon",
  },
  {
    title: "Sleep Protocol",
    description:
      "Optimizing for 7.5 hours of quality sleep. Eight Sleep, blackout curtains, the works.",
    icon: "😴",
    status: "coming soon",
  },
  {
    title: "Supplement Stack",
    description: "What I take, why I take it, and what the research says.",
    icon: "💊",
    status: "coming soon",
  },
  {
    title: "Cleaning Protocol",
    description: "Keeping the space clean without thinking about it. Systems over motivation.",
    icon: "🧹",
    status: "coming soon",
  },
]

export default function ProtocolsPage() {
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
        {protocols.map((p) => (
          <div key={p.title} className="protocol-card">
            <span className="protocol-icon">{p.icon}</span>
            <div>
              <h3 className="protocol-title">{p.title}</h3>
              <p className="protocol-desc">{p.description}</p>
              {p.status && (
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
                  {p.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
