"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  className?: string;
  strength?: number;
};

const variantClass = {
  primary: "bg-ink text-white shadow-soft hover:bg-cobalt",
  secondary: "border border-line bg-white text-ink hover:border-ink",
};

const sizeClass = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export function MagneticButton({
  href,
  children,
  variant = "primary",
  size = "md",
  icon: Icon = ArrowRight,
  className = "",
  strength = 0.38,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    },
    [prefersReducedMotion, strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (prefersReducedMotion) return;
    gsap.to(wrapRef.current, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.5)" });
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Padding creates a larger magnetic detection zone around the button
      className="inline-block p-3 -m-3"
    >
      <Link
        href={href}
        className={`group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-300 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      >
        <span className="relative block overflow-hidden">
          <span className="block transition duration-300 group-hover:-translate-y-full">{children}</span>
          <span className="absolute left-0 top-full block transition duration-300 group-hover:-translate-y-full">
            {children}
          </span>
        </span>
        <Icon className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
