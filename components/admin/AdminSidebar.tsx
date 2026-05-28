"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Settings,
  ExternalLink,
  BookOpen,
  Menu,
  X,
  ClipboardList,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Produk", href: "/admin/products", icon: Package, exact: false },
  { label: "Blog", href: "/admin/blog", icon: BookOpen, exact: false },
  { label: "Custom Orders", href: "/admin/custom-orders", icon: ClipboardList, exact: false },
  { label: "Pengaturan", href: "/admin/settings", icon: Settings, exact: false },
];

function NavLinks({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/30">
          Navigasi
        </p>
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-ink text-white shadow-sm"
                  : "text-ink/55 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sheet" />
              )}
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  active ? "bg-white/15" : "group-hover:bg-ink/8"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink/8 px-3 py-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/40 transition hover:bg-ink/5 hover:text-ink/70"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
          Lihat Website
        </a>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoEl = (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sheet">
        <Zap className="h-4 w-4 text-ink" />
      </div>
      <div>
        <span className="block text-sm font-bold leading-none tracking-tight text-ink">
          Pakarsheet
        </span>
        <span className="block text-[10px] leading-none text-ink/35 mt-0.5">Admin Panel</span>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-ink/8 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-ink/8 px-5">
          {logoEl}
        </div>
        <NavLinks pathname={pathname} />
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-ink/8 bg-white px-4 lg:hidden">
        {logoEl}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-ink/50 transition hover:bg-ink/5 hover:text-ink"
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
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 flex h-full w-[220px] flex-col border-r border-ink/8 bg-white shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-14 items-center justify-between border-b border-ink/8 px-4">
              {logoEl}
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 transition hover:bg-ink/5 hover:text-ink"
                aria-label="Tutup menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavLinks pathname={pathname} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
