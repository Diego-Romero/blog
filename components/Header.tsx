"use client"

import { usePathname } from "next/navigation"
import Link from "./Link"
import headerNavLinks from "@/data/headerNavLinks"
import ThemeSwitch from "./ThemeSwitch"
import SearchButton from "./SearchButton"

const Header = () => {
  const pathname = usePathname()

  return (
    <nav className="top-nav">
      {/* Logo */}
      <Link href="/" className="nav-logo" aria-label="diegoromero.blog home">
        <span className="c-user">diego</span>
        <span className="c-at">@</span>
        <span className="c-host">blog</span>
        <span className="c-sep">:</span>
        <span className="c-tilde">~</span>
        <span className="c-dollar">$</span>
      </Link>

      {/* Desktop nav links — hidden on mobile, shown md+ */}
      <div className="nav-links">
        {headerNavLinks
          .filter((link) => link.href !== "/")
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={`nav-link ${pathname?.startsWith(link.href) ? "active" : ""}`}
            >
              {link.title}
            </Link>
          ))}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        <SearchButton />
        <ThemeSwitch />
      </div>
    </nav>
  )
}

export default Header
