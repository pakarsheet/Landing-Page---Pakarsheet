"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  ClipboardList,
  Settings,
  ExternalLink,
  Zap,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { label: "Dashboard", href: "/admin",               icon: LayoutDashboard, exact: true  },
  { label: "Produk",    href: "/admin/products",       icon: Package,         exact: false },
  { label: "Blog",      href: "/admin/blog",           icon: BookOpen,        exact: false },
  { label: "Orders",    href: "/admin/custom-orders",  icon: ClipboardList,   exact: false },
  { label: "Pengaturan",href: "/admin/settings",       icon: Settings,        exact: false },
];

interface Props {
  user: User;
  newOrdersCount?: number;
}

export function AdminTopNav({ user, newOrdersCount = 0 }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const emailDisplay =
    user.email && user.email.length > 22
      ? user.email.slice(0, 20) + "…"
      : user.email;

  const avatarLetter = user.email?.[0]?.toUpperCase() ?? "A";

  return (
    <>
      {/* ── Desktop Top Nav ─────────────────────────────────── */}
      <nav className="sticky top-0 z-40 hidden h-12 items-center border-b border-white/8 bg-ink px-5 lg:flex">

        {/* Logo */}
        <Link href="/admin" className="flex shrink-0 items-center gap-2 mr-6">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sheet">
            <Zap className="h-3 w-3 text-ink" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Pakarsheet</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/40">
            Admin
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex flex-1 items-center gap-0.5">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/45 hover:bg-white/6 hover:text-white/75"
                }`}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
                {/* Active underline */}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-sheet" />
                )}
                {/* Orders badge */}
                {item.href === "/admin/custom-orders" && newOrdersCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-sheet px-1 text-[10px] font-bold text-ink">
                    {newOrdersCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side — all same visual weight */}
        <div className="flex shrink-0 items-center gap-1">
          {/* View site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-white/40 transition hover:bg-white/6 hover:text-white/70"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Website</span>
          </a>

          {/* Divider */}
          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* Avatar + email */}
          <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sheet text-[11px] font-bold text-ink">
              {avatarLetter}
            </div>
            <span className="hidden text-[13px] font-medium text-white/45 xl:block">
              {emailDisplay}
            </span>
          </div>

          {/* Logout — same size as other items */}
          <a
            href="/admin-logout"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-white/40 transition hover:bg-red-500/15 hover:text-red-400"
            title="Keluar"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Keluar</span>
          </a>
        </div>
      </nav>

      {/* ── Mobile Top Bar ──────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-12 items-center justify-between border-b border-white/8 bg-ink px-4 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sheet">
            <Zap className="h-3 w-3 text-ink" />
          </div>
          <span className="text-sm font-bold text-white">Pakarsheet</span>
        </Link>
        <div className="flex items-center gap-2">
          {newOrdersCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sheet px-1 text-[10px] font-bold text-ink">
              {newOrdersCount}
            </span>
          )}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition hover:bg-white/8 hover:text-white"
            aria-label="Buka menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
          <aside
            className="absolute right-0 top-0 flex h-full w-64 flex-col bg-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex h-12 items-center justify-between border-b border-white/8 px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sheet text-[11px] font-bold text-ink">
                  {avatarLetter}
                </div>
                <span className="text-xs font-medium text-white/50">{emailDisplay}</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/8 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
              {navItems.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:bg-white/6 hover:text-white/80"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sheet" />
                    )}
                    {item.href === "/admin/custom-orders" && newOrdersCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sheet px-1 text-[10px] font-bold text-ink">
                        {newOrdersCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="border-t border-white/8 px-2 py-2 space-y-0.5">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition hover:bg-white/6 hover:text-white/70"
              >
                <ExternalLink className="h-4 w-4" />
                Lihat Website
              </a>
              <a
                href="/admin-logout"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition hover:bg-red-500/15 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
