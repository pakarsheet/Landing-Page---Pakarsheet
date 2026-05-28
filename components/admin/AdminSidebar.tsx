"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Package, Settings, ExternalLink, BookOpen, Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Produk", href: "/admin/products", icon: Package, exact: false },
  { label: "Blog", href: "/admin/blog", icon: BookOpen, exact: false },
  { label: "Pengaturan", href: "/admin/settings", icon: Settings, exact: false },
];

function NavLinks({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-sheet text-ink"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 transition hover:bg-white/10 hover:text-white/80"
        >
          <ExternalLink className="h-4 w-4" />
          Lihat Website
        </a>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoEl = (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Pakarsheet logo"
        width={32}
        height={32}
        className="h-8 w-8 object-contain [filter:brightness(0)_saturate(100%)_invert(74%)_sepia(72%)_saturate(700%)_hue-rotate(40deg)_brightness(105%)]"
      />
      <span className="font-semibold text-white">Pakarsheet</span>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col bg-ink lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          {logoEl}
        </div>
        <NavLinks pathname={pathname} />
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
        {logoEl}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── Mobile drawer overlay ────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />

          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 flex h-full w-64 flex-col bg-ink shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              {logoEl}
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Tutup menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavLinks pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Mobile top bar spacer — handled by layout ───────── */}
    </>
  );
}
