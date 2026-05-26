"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navItems } from "@/lib/data";
import { site } from "@/lib/site";

const visibleNavItems = navItems.filter((item) => item.label !== "Template");

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute left-0 top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-8 lg:px-10 lg:pt-[62px]">
      <nav className="mx-auto flex max-w-[1068px] items-center justify-between gap-2 rounded-[18px] border border-white/80 bg-white px-3 py-2 shadow-[0_16px_48px_rgba(1,17,43,0.12)] sm:gap-3 lg:max-w-[860px] lg:px-5 lg:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Pakarsheet home" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Pakarsheet logo" width={36} height={36} className="h-9 w-9 object-contain lg:h-10 lg:w-10" />
          <span className="truncate font-primary text-xl font-semibold leading-none text-ink">{site.name}</span>
        </Link>

        <div className="hidden min-w-0 items-center gap-6 lg:flex">
          {visibleNavItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.href} href={item.href} className="whitespace-nowrap text-[15px] font-medium text-ink transition hover:text-cobalt">
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className="whitespace-nowrap text-[15px] font-medium text-ink transition hover:text-cobalt">
                {item.label}
              </a>
            )
          )}
        </div>

        <div className="hidden items-center lg:flex">
          <Link
            href="/shop"
            className="inline-flex h-9 items-center rounded-[10px] bg-[linear-gradient(180deg,#0c061b,#210d53)] px-4 text-sm font-medium text-white shadow-[0_11px_12px_rgba(15,0,47,0.12),0_3px_3px_rgba(20,0,64,0.12)] transition hover:opacity-85 lg:h-10 lg:px-5"
          >
            {site.primaryCta}
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-[12px] bg-ink text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={`mx-auto mt-2 max-w-[1068px] overflow-hidden rounded-[18px] border border-line/70 bg-white shadow-[0_16px_48px_rgba(1,17,43,0.12)] transition-[max-height,opacity,transform] duration-300 lg:hidden ${
          open ? "max-h-[640px] translate-y-0 opacity-100" : "max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <div className="space-y-2 px-4 py-4 sm:px-5">
          {visibleNavItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-bold text-ink hover:bg-sky hover:text-cobalt"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-bold text-ink hover:bg-sky hover:text-cobalt"
              >
                {item.label}
              </a>
            )
          )}
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="mt-3 flex h-12 w-full items-center justify-center rounded-[12px] bg-[linear-gradient(180deg,#0c061b,#210d53)] px-5 text-sm font-semibold text-white transition hover:opacity-85"
          >
            {site.primaryCta}
          </Link>
        </div>
      </div>
    </header>
  );
}
