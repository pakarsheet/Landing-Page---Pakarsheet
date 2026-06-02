"use client";

import { useState, useEffect, useRef } from "react";
import { X, Megaphone } from "lucide-react";
import { gsap } from "@/lib/gsap";

export function AnnouncementBar({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Initialize visibility and check sessionStorage
  useEffect(() => {
    const isClosed = sessionStorage.getItem("announcement_closed");
    if (!isClosed) {
      setIsVisible(true);
    }
  }, []);

  // GSAP Entrance Animation
  useEffect(() => {
    if (isVisible && barRef.current) {
      gsap.fromTo(
        barRef.current,
        { y: -50, autoAlpha: 0, scale: 0.95 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.8, ease: "bounce.out" }
      );
    }
  }, [isVisible]);

  if (!isVisible) return null;

  function close() {
    gsap.to(barRef.current, {
      y: -20,
      autoAlpha: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setIsVisible(false);
        sessionStorage.setItem("announcement_closed", "true");
      }
    });
  }

  return (
    <div className="absolute left-0 right-0 z-[40] w-full px-4 sm:px-6 lg:px-10 top-[80px] sm:top-[100px] lg:top-[146px]">
      <div 
        ref={barRef}
        className="relative mx-auto flex max-w-[1068px] lg:max-w-[860px] flex-col sm:flex-row items-center justify-between gap-y-3 gap-x-4 rounded-[16px] lg:rounded-[100px] border border-sheet/20 bg-sheet px-5 py-3 shadow-[0_8px_32px_rgba(139,237,2,0.15)] sm:py-2.5 sm:px-6 invisible"
      >
        
        {/* Left: Icon & Text */}
        <div className="flex flex-1 w-full sm:w-auto items-start sm:items-center justify-start gap-3 pr-8 sm:pr-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sheet mt-0.5 sm:mt-0">
            <Megaphone className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold leading-snug text-ink text-left">
            {text}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={close}
          className="absolute right-2 top-2 p-2 sm:static sm:-mr-2 sm:ml-1 sm:p-2 transition hover:scale-110 focus-visible:outline-offset-[-4px]"
          aria-label="Tutup"
        >
          <X className="h-4 w-4 text-ink/70 hover:text-ink" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
