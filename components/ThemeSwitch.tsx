"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <button className="theme-toggle-btn">◐ THEME</button>
  }

  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <button
      aria-label="Toggle Dark Mode"
      className="theme-toggle-btn"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "◑ LIGHT" : "◐ DARK"}
    </button>
  )
}

export default ThemeSwitch
