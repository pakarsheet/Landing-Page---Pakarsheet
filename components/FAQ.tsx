"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { faqs } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SectionHeader } from "./ui/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

export function FAQ() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const answerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scroll reveal — header + accordion items
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 78%", once: true },
          }
        );
      }

      if (listRef.current) {
        const items = gsap.utils.toArray<HTMLElement>(".faq-item", listRef.current);
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: listRef.current, start: "top 80%", once: true },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Accordion open/close animation
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    answerRefs.current.forEach((answer, index) => {
      if (!answer) return;

      const isOpen = activeIndex === index;
      const targetHeight = isOpen ? answer.scrollHeight : 0;

      gsap.to(answer, {
        height: targetHeight,
        opacity: isOpen ? 1 : 0,
        duration: 0.36,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [activeIndex, prefersReducedMotion]);

  return (
    <section id="faq" ref={sectionRef} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto grid max-w-[1068px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div ref={headerRef}>
          <SectionHeader
            eyebrow="FAQ"
            icon={CircleHelp}
            title="Hal yang biasanya ditanya sebelum mulai."
            description="Kalau masih pakai spreadsheet, itu tidak masalah. Yang penting sheet-nya mulai bantu kerja, bukan nambah ribet."
          />
        </div>
        <div ref={listRef} className="space-y-4">
          {faqs.map((faq, index) => {
            const open = activeIndex === index;
            return (
              <div key={faq.question} className="faq-item rounded-[28px] border border-line bg-white shadow-card">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setActiveIndex(open ? -1 : index)}
                >
                  <span className="font-primary text-xl font-semibold leading-[1.25] tracking-[-0.4px] text-ink">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-cobalt transition duration-300 ${open ? "rotate-180" : ""}`} />
                </button>
                <div
                  ref={(node) => {
                    answerRefs.current[index] = node;
                  }}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  <p className="px-5 pb-5 font-secondary text-base leading-[1.56] text-muted">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
