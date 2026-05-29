"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { label: "Dashboard",      href: "/admin",                 icon: LayoutDashboard, exact: true  },
  { label: "Produk",         href: "/admin/products",        icon: Package,         exact: false },
  { label: "Blog",           href: "/admin/blog",            icon: BookOpen,        exact: false },
  { label: "Custom Orders",  href: "/admin/custom-orders",   icon: ClipboardList,   exact: false },
  { label: "Pengaturan",     href: "/admin/settings",        icon: Settings,        exact: false },
];

interface Props {
  user: User;
}

function SidebarContent({
  pathname,
  user,
  onClose,
}: {
  pathname: string;
  user: User;
  onClose?: () => void;
}) {
  const emailDisplay =
    user.email && user.email.length > 22
      ? user.email.slice(0, 20) + "…"
      : user.email;
  const avatarLetter = user.email?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="flex h-full flex-col">

      {/* ── Logo ─────────────────────────────────────────────── */}
      <div className="flex h-20 shrink-0 items-center px-5 border-b border-ink/8">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-2.5">
          <Image
            src="/logo-full.png"
            alt="Pakarsheet"
            width={160}
            height={48}
            className="h-8 w-auto object-contain brightness-0"
            priority
          />
          <span className="text-2xl font-bold tracking-tight text-ink leading-none">
            Pakarsheet
          </span>
        </Link>
      </div>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted/60">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-medium transition-all duration-150 ${
                    active
                      ? "bg-ink text-white shadow-sm"
                      : "text-muted hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    active ? "bg-white/15" : "group-hover:bg-ink/8"
                  }`}>
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 leading-none">{item.label}</span>
                  {/* Active dot */}
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-sheet" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom ───────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-ink/8 px-3 py-3 space-y-1">
        {/* View site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-medium text-muted transition hover:bg-ink/5 hover:text-ink"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <ExternalLink className="h-5 w-5" />
          </span>
          <span className="flex-1 leading-none">Lihat Website</span>
        </a>

        {/* User + logout row */}
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sheet text-sm font-bold text-ink">
            {avatarLetter}
          </div>
          <span className="flex-1 truncate text-[13px] font-medium text-muted">
            {emailDisplay}
          </span>
          <a
            href="/admin-logout"
            title="Keluar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </a>
        </div>
      </div>

    </div>
  );
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink/8 bg-white lg:flex">
        <SidebarContent pathname={pathname} user={user} />
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-12 items-center justify-between border-b border-ink/8 bg-white px-4 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo-full.png"
            alt="Pakarsheet"
            width={120}
            height={36}
            className="h-7 w-auto object-contain brightness-0"
          />
          <span className="text-sm font-bold tracking-tight text-ink leading-none">
            Pakarsheet
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-ink/5 hover:text-ink"
            aria-label="Buka menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button overlay */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-ink/5 hover:text-ink"
              aria-label="Tutup menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              pathname={pathname}
              user={user}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
