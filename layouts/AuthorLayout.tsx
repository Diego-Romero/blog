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
      <div className="page-header">
        <p className="section-label">about</p>
        <h1 className="section-title" style={{ fontSize: "1.6rem" }}>
          Hello, I&apos;m {name}
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "3rem",
        }}
        className="xl:grid-cols-[280px_1fr]"
      >
        {/* Sidebar — avatar + meta */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            paddingTop: "0.5rem",
          }}
          className="xl:items-start"
        >
          {avatar && (
            <Image
              src={avatar}
              alt={name}
              width={160}
              height={160}
              style={{
                borderRadius: "0",
                border: "2px solid var(--border)",
                width: "160px",
                height: "160px",
                objectFit: "cover",
              }}
            />
          )}

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              padding: "1rem",
              width: "100%",
              maxWidth: "280px",
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              fontSize: "0.72rem",
            }}
          >
            <div style={{ color: "var(--accent)", fontWeight: 700, marginBottom: "0.5rem" }}>
              {"// profile"}
            </div>
            {name && (
              <div style={{ marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--accent2)" }}>name</span>
                <span style={{ color: "var(--muted)" }}>: </span>
                <span style={{ color: "var(--fg)" }}>{name}</span>
              </div>
            )}
            {occupation && (
              <div style={{ marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--accent2)" }}>role</span>
                <span style={{ color: "var(--muted)" }}>: </span>
                <span style={{ color: "var(--fg)" }}>{occupation}</span>
              </div>
            )}
            {company && (
              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--accent2)" }}>co</span>
                <span style={{ color: "var(--muted)" }}> : </span>
                <span style={{ color: "var(--fg)" }}>{company}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <SocialIcon kind="github" href={github} size={5} />
              <SocialIcon kind="linkedin" href={linkedin} size={5} />
              <SocialIcon kind="twitter" href={twitter} size={5} />
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert" style={{ paddingBottom: "3rem" }}>
          {children}
        </div>
      </div>
    </div>
  )
}
