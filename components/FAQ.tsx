"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";
import gsap from "gsap";
import { faqs } from "@/lib/data";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SectionHeader } from "./ui/SectionHeader";

export function FAQ() {
  const ref = useGsapReveal<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(0);
  const answerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    answerRefs.current.forEach((answer, index) => {
      if (!answer) return;

      const isOpen = activeIndex === index;
      const targetHeight = isOpen ? answer.scrollHeight : 0;

      gsap.to(answer, {
        height: targetHeight,
        autoAlpha: isOpen ? 1 : 0,
        duration: 0.36,
        ease: "power2.out"
      });
    });
  }, [activeIndex, prefersReducedMotion]);

  return (
    <section id="faq" ref={ref} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto grid max-w-[1068px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeader
          eyebrow="FAQ"
          icon={CircleHelp}
          title="Hal yang biasanya ditanya sebelum mulai."
          description="Kalau masih pakai spreadsheet, itu tidak masalah. Yang penting sheet-nya mulai bantu kerja, bukan nambah ribet."
        />
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const open = activeIndex === index;
            return (
              <div key={faq.question} className="reveal-item rounded-[28px] border border-line bg-white shadow-card">
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
                  className="h-0 overflow-hidden"
                  style={open ? { height: "auto", opacity: 1 } : undefined}
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
