/**
 * Central GSAP registry — import from here, not directly from "gsap/*"
 * Ensures all plugins registered once, no duplicate registration warnings.
 */
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Guard against SSR — GSAP plugins that touch the DOM crash during
// Next.js static prerendering where `window` is undefined.
if (typeof window !== "undefined") {
  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);
}

export { gsap, DrawSVGPlugin, ScrollTrigger };
