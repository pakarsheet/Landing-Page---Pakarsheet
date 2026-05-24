"use client";

import { useEffect, useState } from "react";

interface Props {
  href: string;
}

export function FloatingWAButtonClient({ href }: Props) {
  const [visible, setVisible] = useState(false);

  // Muncul setelah 1.5 detik agar tidak bentrok dengan hero entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className={[
        "fixed bottom-6 right-6 z-50",
        "flex h-14 w-14 items-center justify-center rounded-full",
        "bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)]",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(37,211,102,0.55)]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
    >
      {/* Pulse ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"
      />
      {/* WhatsApp SVG logo */}
      <svg
        aria-hidden="true"
        className="relative h-7 w-7"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.47 1.64 6.36L3 29l6.82-1.6A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Z"
          fill="white"
        />
        <path
          d="M16 5.2A10.8 10.8 0 0 0 5.2 16c0 2.02.56 3.9 1.52 5.52l.24.4-1.02 3.72 3.84-.98.38.22A10.8 10.8 0 1 0 16 5.2Zm6.34 15.06c-.26.72-1.52 1.38-2.1 1.46-.54.08-1.22.12-1.96-.12-.46-.14-1.04-.34-1.78-.66-3.14-1.36-5.18-4.52-5.34-4.74-.16-.22-1.3-1.72-1.3-3.28s.82-2.32 1.12-2.64c.26-.28.58-.34.78-.34l.56.01c.18 0 .42-.07.66.5l.84 2.06c.08.18.04.38-.06.54l-.3.44-.44.48c-.14.14-.3.3-.12.58.16.28.74 1.22 1.6 1.98 1.1.98 2.02 1.28 2.3 1.42.28.14.44.12.6-.06l.72-.84c.18-.22.36-.16.6-.06l1.9.9c.22.1.38.16.44.26.06.1.06.56-.2 1.1Z"
          fill="#25D366"
        />
      </svg>
    </a>
  );
}
