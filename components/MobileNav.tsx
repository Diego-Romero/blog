"use client"

import { usePathname } from "next/navigation"
import Link from "./Link"
import headerNavLinks from "@/data/headerNavLinks"

const MobileNav = () => {
  const pathname = usePathname()
  const navLinks = headerNavLinks.filter((link) => link.href !== "/")

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {navLinks.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className={`bottom-nav-btn ${pathname?.startsWith(link.href) ? "active" : ""}`}
          aria-label={link.title}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  )
}

export default MobileNav
