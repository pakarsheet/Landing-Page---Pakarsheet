"use client";

import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight, Bell } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Produk",
  "/admin/products/new": "Tambah Produk",
  "/admin/blog": "Blog",
  "/admin/blog/new": "Tulis Artikel",
  "/admin/custom-orders": "Custom Orders",
  "/admin/settings": "Pengaturan",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/admin/products/")) return "Edit Produk";
  if (pathname.startsWith("/admin/blog/")) return "Edit Artikel";
  if (pathname.startsWith("/admin/custom-orders/")) return "Detail Order";
  return "Admin";
}

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  if (pathname === "/admin") return [{ label: "Dashboard" }];
  if (pathname === "/admin/products") return [{ label: "Produk" }];
  if (pathname === "/admin/products/new")
    return [{ label: "Produk", href: "/admin/products" }, { label: "Tambah Baru" }];
  if (pathname.startsWith("/admin/products/"))
    return [{ label: "Produk", href: "/admin/products" }, { label: "Edit" }];
  if (pathname === "/admin/blog") return [{ label: "Blog" }];
  if (pathname === "/admin/blog/new")
    return [{ label: "Blog", href: "/admin/blog" }, { label: "Tulis Baru" }];
  if (pathname.startsWith("/admin/blog/"))
    return [{ label: "Blog", href: "/admin/blog" }, { label: "Edit" }];
  if (pathname === "/admin/custom-orders") return [{ label: "Custom Orders" }];
  if (pathname.startsWith("/admin/custom-orders/"))
    return [
      { label: "Custom Orders", href: "/admin/custom-orders" },
      { label: "Detail" },
    ];
  if (pathname === "/admin/settings") return [{ label: "Pengaturan" }];
  return [{ label: "Admin" }];
}

interface Props {
  user: User;
}

export function AdminHeader({ user }: Props) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const title = getPageTitle(pathname);

  // Shorten email for display
  const emailDisplay =
    user.email && user.email.length > 24
      ? user.email.slice(0, 22) + "…"
      : user.email;

  return (
    <header className="flex h-14 items-center justify-between border-b border-ink/8 bg-white px-6">
      {/* Left: breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ink/25" />}
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-sm text-ink/45 transition hover:text-ink"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="text-sm font-semibold text-ink">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Right: user + logout */}
      <div className="flex items-center gap-2">
        {/* Avatar + email */}
        <div className="flex items-center gap-2 rounded-xl border border-ink/10 bg-ink/3 px-3 py-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sheet text-[10px] font-bold text-ink">
            {user.email?.[0]?.toUpperCase() ?? "A"}
          </span>
          <span className="hidden text-xs font-medium text-ink/70 sm:block">
            {emailDisplay}
          </span>
        </div>

        {/* Logout */}
        <form action="/admin-logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl border border-ink/10 bg-ink/3 px-3 py-1.5 text-xs font-medium text-ink/55 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </form>
      </div>
    </header>
  );
}
