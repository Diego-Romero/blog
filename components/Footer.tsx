import siteMetadata from "@/data/siteMetadata"
import SocialIcon from "@/components/social-icons"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-prompt">
          <span className="fp-dollar">$ </span>
          <span className="fp-domain">diegoromero.blog</span>
          <span> — built with Next.js &amp; caffeine</span>
        </p>
        <div className="flex items-center gap-4">
          <div className="footer-social">
            <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
            <SocialIcon kind="twitter" href={siteMetadata.twitter} size={5} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
              fontSize: "0.65rem",
              color: "var(--muted)",
            }}
          >
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  )
}
