"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __landingStarted?: boolean;
  }
}

/**
 * Runs the landing page's GSAP / Lenis choreography once the server-rendered
 * markup has hydrated. The script mutates the DOM directly (SplitText, pinning,
 * rendered lists), so it must start exactly once — including under React
 * Strict Mode, which mounts effects twice in development.
 */
export default function LandingScript() {
  useEffect(() => {
    if (window.__landingStarted) return;
    window.__landingStarted = true;
    // React sets `muted` as a property only; autoplay policies need it before play().
    document.querySelectorAll("video").forEach((v) => {
      v.muted = true;
    });
    import("./landing.js").then((m) => m.start());
  }, []);

  return null;
}
