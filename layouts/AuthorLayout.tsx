import { ReactNode } from "react"
import type { Authors } from "contentlayer/generated"
import SocialIcon from "@/components/social-icons"
import Image from "@/components/Image"

interface Props {
  children: ReactNode
  content: Omit<Authors, "_id" | "_raw" | "body">
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, twitter, linkedin, github } = content

  return (
    <div className="content-container">
      {/* ── Hero header ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          paddingBottom: "2.5rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "2.5rem",
        }}
      >
        {avatar && (
          <Image
            src={avatar}
            alt={name}
            width={140}
            height={140}
            style={{
              borderRadius: "50%",
              border: "3px solid var(--accent)",
              width: "140px",
              height: "140px",
              objectFit: "cover",
            }}
          />
        )}

        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            {name}
          </h1>

          {/* Terminal-style metadata */}
          <div
            style={{
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              fontSize: "0.75rem",
              color: "var(--muted)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.25rem 1rem",
            }}
          >
            {occupation && (
              <span>
                <span style={{ color: "var(--accent)" }}>role</span>
                {" → "}
                {occupation}
              </span>
            )}
            {company && (
              <span>
                <span style={{ color: "var(--accent)" }}>@</span>
                {company}
              </span>
            )}
          </div>

          {/* Social links */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <SocialIcon kind="github" href={github} size={5} />
            <SocialIcon kind="linkedin" href={linkedin} size={5} />
            <SocialIcon kind="twitter" href={twitter} size={5} />
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div
        className="prose prose-lg dark:prose-invert"
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          paddingBottom: "3rem",
        }}
      >
        {children}
      </div>
    </div>
  )
}
