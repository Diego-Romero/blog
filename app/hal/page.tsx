import type { Metadata } from "next"
import HalDashboard from "./HalDashboard"

export const metadata: Metadata = {
  title: "Hal review log",
  description: "Team access to Hal review progress and audit timelines.",
  robots: { index: false, follow: false },
}

export default function HalPage() {
  return <HalDashboard />
}
