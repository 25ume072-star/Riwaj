"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Sends page_view to GA4 on client-side route changes (SPA navigation).
 * Initial page load is handled by GoogleAnalyticsScripts in the layout.
 */
export function GoogleAnalyticsRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirst = useRef(true)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    const pagePath = pathname + (searchParams?.toString() ? `?${searchParams}` : "")

    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.origin + pagePath
    })
  }, [pathname, searchParams])

  return null
}

