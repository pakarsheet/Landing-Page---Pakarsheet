"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { navItems, shopTemplates } from "@/lib/data";
import { site } from "@/lib/site";

const productLinks = shopTemplates.map((template) => ({
  label: template.title,
  href: `/shop/${template.slug}`,
}));

const visibleNavItems = navItems.filter((item) => item.label !== "Template");

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [produkOpen, setProdukOpen] = useState(false);

  return (
    <header className="absolute left-0 top-0 z-50 w-full px-5 pt-10 sm:px-8 sm:pt-12 lg:px-10 lg:pt-[62px]">
      <nav className="mx-auto flex max-w-[1068px] items-center justify-between gap-3 rounded-[18px] border border-white/80 bg-white px-3 py-2 shadow-[0_16px_48px_rgba(1,17,43,0.12)]">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Pakarsheet home" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-ink font-primary text-base font-semibold text-white">P</span>
          <span className="truncate font-primary text-base font-semibold leading-none text-ink">{site.name}</span>
        </Link>

        <div className="hidden min-w-0 items-center gap-6 lg:flex">
          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={produkOpen}
              onMouseEnter={() => setProdukOpen(true)}
              onMouseLeave={() => setProdukOpen(false)}
              onFocus={() => setProdukOpen(true)}
              onBlur={() => setProdukOpen(false)}
              style={{ fontSize: "15px", fontWeight: 500, fontFamily: "inherit" }}
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-ink transition hover:text-cobalt"
            >
              Produk
              <ChevronDown className="h-3.5 w-3.5 transition duration-300 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-[48px] w-[560px] -translate-x-1/2 translate-y-2 rounded-2xl border border-line/70 bg-white p-5 opacity-0 shadow-[0_16px_48px_rgba(1,17,43,0.12)] transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                {productLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-sky hover:text-cobalt"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/shop" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-sky hover:text-cobalt">
                  Lihat Semua Template
                </Link>
                <a href="#faq" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-sky hover:text-cobalt">
                  Bantuan Template
                </a>
              </div>
            </div>
          </div>
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
            className="inline-flex h-9 items-center rounded-[10px] bg-[linear-gradient(180deg,#0c061b,#210d53)] px-4 text-sm font-medium text-white shadow-[0_11px_12px_rgba(15,0,47,0.12),0_3px_3px_rgba(20,0,64,0.12)] transition hover:opacity-85"
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
        className={`mx-auto mt-3 max-w-[1068px] overflow-hidden rounded-[18px] border border-line/70 bg-white shadow-[0_16px_48px_rgba(1,17,43,0.12)] transition-[max-height,opacity,transform] duration-300 lg:hidden ${
          open ? "max-h-[640px] translate-y-0 opacity-100" : "max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <div className="space-y-2 px-4 py-4 sm:px-5">
          <div className="rounded-2xl bg-sky/70 p-2">
            <p className="px-2 pb-1 text-xs font-bold uppercase text-muted">Produk</p>
            {productLinks.slice(0, 4).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-ink hover:bg-white hover:text-cobalt"
              >
                {item.label}
              </Link>
            ))}
          </div>
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
