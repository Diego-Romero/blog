"use client"

import siteMetadata from "@/data/siteMetadata"
import { useEffect, useState } from "react"

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    window.addEventListener("scroll", handleWindowScroll)
    return () => window.removeEventListener("scroll", handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }
  const handleScrollToComment = () => {
    document.getElementById("comment")?.scrollIntoView()
  }

  return (
    <div
      className={`fixed bottom-8 right-8 hidden flex-col gap-2 ${show ? "md:flex" : "md:hidden"}`}
    >
      {siteMetadata.comments?.provider && (
        <button
          aria-label="Scroll To Comment"
          onClick={handleScrollToComment}
          className="scroll-top-btn"
          style={{ padding: "0.4rem 0.6rem" }}
        >
          ↓ comments
        </button>
      )}
      <button
        aria-label="Scroll To Top"
        onClick={handleScrollTop}
        className="scroll-top-btn"
        style={{ padding: "0.4rem 0.6rem" }}
      >
        ↑ top
      </button>
    </div>
  )
}

export default ScrollTopAndComment
