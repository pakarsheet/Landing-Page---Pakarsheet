"use client";

import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import { gsap, ScrollTrigger, Draggable } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SectionHeader } from "./ui/SectionHeader";

gsap.registerPlugin(ScrollTrigger, Draggable);

// How many cards visible at once per breakpoint (controlled via CSS, JS uses 1 for logic)
const CARD_GAP = 20; // px, matches gap-5

export function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [active, setActive] = useState(0);
  const total = testimonials.length;

  // Compute x offset for a given index
  const getOffset = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = cardRefs.current[0];
    if (!card) return 0;
    const cardW = card.offsetWidth + CARD_GAP;
    return -index * cardW;
  }, []);

  const goTo = useCallback(
    (index: number, animate = true) => {
      const clamped = ((index % total) + total) % total;
      setActive(clamped);
      const x = getOffset(clamped);
      if (animate && !prefersReducedMotion) {
        gsap.to(trackRef.current, { x, duration: 0.55, ease: "power3.out" });
      } else {
        gsap.set(trackRef.current, { x });
      }
    },
    [total, getOffset, prefersReducedMotion]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay
  const startAutoplay = useCallback(() => {
    if (prefersReducedMotion) return;
    autoplayRef.current = setInterval(() => {
      setActive((a) => {
        const next = (a + 1) % total;
        const x = -(next * ((cardRefs.current[0]?.offsetWidth ?? 0) + CARD_GAP));
        gsap.to(trackRef.current, { x, duration: 0.55, ease: "power3.out" });
        return next;
      });
    }, 3800);
  }, [prefersReducedMotion, total]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Section entrance
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        }
      );
      gsap.fromTo(
        ".testimonial-carousel",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.15,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        }
      );
    }, section);

    // Initial position
    gsap.set(track, { x: 0 });

    // Draggable — swipe to navigate
    const [drag] = Draggable.create(track, {
      type: "x",
      inertia: true,
      edgeResistance: 0.92,
      dragResistance: 0.1,
      cursor: "grab",
      activeCursor: "grabbing",
      onDragEnd() {
        // Snap to nearest card based on drag delta
        const cardW = (cardRefs.current[0]?.offsetWidth ?? 300) + CARD_GAP;
        const currentX = gsap.getProperty(track, "x") as number;
        const snapped = Math.round(-currentX / cardW);
        const clamped = Math.max(0, Math.min(snapped, total - 1));
        setActive(clamped);
        gsap.to(track, { x: -clamped * cardW, duration: 0.45, ease: "power3.out" });
        startAutoplay();
      },
      onDragStart() {
        stopAutoplay();
      },
    });
    draggableRef.current = drag;

    // Start autoplay when section enters viewport
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: startAutoplay,
      onLeave: stopAutoplay,
      onEnterBack: startAutoplay,
      onLeaveBack: stopAutoplay,
    });

    return () => {
      ctx.revert();
      drag.kill();
      stopAutoplay();
    };
  }, [prefersReducedMotion, startAutoplay, stopAutoplay, total]);

  // Re-snap on resize
  useLayoutEffect(() => {
    const handleResize = () => goTo(active, false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active, goTo]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-white px-5 py-20 lg:px-10"
    >
      <div className="mx-auto max-w-[1068px]">
        {/* Header + controls row */}
        <div className="testimonial-header flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Cerita pengguna"
            icon={MessageCircle}
            title="Kerja harian lebih rapi, laporan lebih gampang dibaca."
            description="Pakarsheet dibuat untuk owner dan admin yang ingin spreadsheet tetap familiar, tapi tidak bikin kerja makin berat."
            align="left"
          />
          {/* Prev / Next */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => { stopAutoplay(); prev(); startAutoplay(); }}
              aria-label="Testimoni sebelumnya"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink shadow-card transition duration-200 hover:border-ink hover:bg-ink hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => { stopAutoplay(); next(); startAutoplay(); }}
              aria-label="Testimoni berikutnya"
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink shadow-card transition duration-200 hover:border-ink hover:bg-ink hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="testimonial-carousel relative mt-10 overflow-hidden">
          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-5"
            style={{ willChange: "transform" }}
          >
            {testimonials.map((item, i) => (
              <article
                key={item.name}
                ref={(el) => { if (el) cardRefs.current[i] = el; }}
                className={`
                  relative w-[min(340px,80vw)] shrink-0 rounded-[28px] border border-line p-7 shadow-card
                  transition-all duration-500
                  ${i === active ? "bg-ink text-white scale-[1.02] shadow-soft" : "bg-white text-ink opacity-70"}
                `}
              >
                {/* Quote icon */}
                <Quote
                  className={`mb-5 h-8 w-8 ${i === active ? "text-sheet" : "text-line"}`}
                  aria-hidden="true"
                />
                <p className={`font-secondary text-[17px] font-semibold leading-[1.6] ${i === active ? "text-white" : "text-ink"}`}>
                  "{item.quote}"
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-primary text-lg font-semibold
                      ${i === active ? "bg-sheet text-ink" : `${item.accent} text-ink`}
                    `}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`font-primary font-semibold ${i === active ? "text-white" : "text-ink"}`}>
                      {item.name}
                    </p>
                    <p className={`text-sm font-semibold ${i === active ? "text-white/60" : "text-muted"}`}>
                      {item.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Left fade edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent"
          />
          {/* Right fade edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent"
          />
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Pilih testimoni">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Testimoni ${i + 1}`}
              onClick={() => { stopAutoplay(); goTo(i); startAutoplay(); }}
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? "h-2.5 w-7 bg-ink"
                  : "h-2.5 w-2.5 bg-line hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
