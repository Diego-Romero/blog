import projectsData from "@/data/projectsData"
import Link from "@/components/Link"
import { genPageMetadata } from "app/seo"

export const metadata = genPageMetadata({ title: "Projects" })

export default function Projects() {
  return (
    <div className="content-container">
      <div className="page-header">
        <p className="section-label">work</p>
        <h1 className="section-title" style={{ fontSize: "1.6rem" }}>
          Projects
        </h1>
        <p
          style={{
            fontFamily: "var(--font-lora), Lora, serif",
            fontSize: "0.95rem",
            color: "var(--muted)",
            marginTop: "0.5rem",
          }}
        >
          A selection of things I have built.
        </p>
      </div>

      <div className="projects-grid">
        {projectsData.map((project) => (
          <div key={project.title} className="project-card">
            <div className="terminal-titlebar" style={{ marginBottom: "1rem" }}>
              <span className="t-dot t-dot-r" />
              <span className="t-dot t-dot-y" />
              <span className="t-dot t-dot-g" />
              <span className="terminal-titlebar-label">{project.href}</span>
            </div>
            <h2 className="project-card-title">{project.title}</h2>
            <p className="project-card-desc">
              {project.description.trim().slice(0, 200)}
              {project.description.trim().length > 200 ? "…" : ""}
            </p>
            {project.href && (
              <Link href={project.href} className="project-card-link" aria-label={project.title}>
                visit project
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
