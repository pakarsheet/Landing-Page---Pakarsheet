import { createAdminClient } from "@/lib/supabase/admin";
import {
  Package,
  Settings,
  FileText,
  Eye,
  PlusCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: draftProducts },
    { count: totalPosts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentProducts } = await supabase
    .from("products")
    .select("id, title, status, category, price, updated_at")
    .order("updated_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Total Produk",
      value: totalProducts ?? 0,
      icon: Package,
      bg: "bg-sky",
      text: "text-cobalt",
    },
    {
      label: "Produk Aktif",
      value: activeProducts ?? 0,
      icon: Eye,
      bg: "bg-leaf",
      text: "text-cobalt",
    },
    {
      label: "Draft",
      value: draftProducts ?? 0,
      icon: FileText,
      bg: "bg-blush",
      text: "text-muted",
    },
    {
      label: "Total Artikel",
      value: totalPosts ?? 0,
      icon: BookOpen,
      bg: "bg-lilac",
      text: "text-cobalt",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Selamat datang di Pakarsheet Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">{s.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.text}`} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products/new"
          className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-ink hover:shadow-soft"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
            <PlusCircle className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-ink">Tambah Produk Baru</p>
            <p className="text-sm text-muted">Buat template baru untuk toko</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
        </Link>

        <Link
          href="/admin/blog/new"
          className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-ink hover:shadow-soft"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky">
            <BookOpen className="h-5 w-5 text-cobalt" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-ink">Tulis Artikel Baru</p>
            <p className="text-sm text-muted">Tambah konten blog baru</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
        </Link>

        <Link
          href="/admin/settings"
          className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-ink hover:shadow-soft"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush">
            <Settings className="h-5 w-5 text-muted" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-ink">Pengaturan Situs</p>
            <p className="text-sm text-muted">Nomor WA, pesan, tagline</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-ink hover:shadow-soft"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf">
            <Eye className="h-5 w-5 text-cobalt" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-ink">Lihat Website</p>
            <p className="text-sm text-muted">Buka landing page di tab baru</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
        </a>
      </div>

      {/* Recent products */}
      {recentProducts && recentProducts.length > 0 && (
        <div className="rounded-2xl border border-line bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-semibold text-ink">Produk Terbaru</h2>
            <Link href="/admin/products" className="text-sm font-medium text-cobalt hover:underline">
              Lihat semua
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {recentProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-6 py-4 transition hover:bg-blush/20">
                <div>
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className="text-sm text-muted">{p.category} · {p.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    p.status === "active"
                      ? "bg-leaf text-cobalt"
                      : "bg-blush text-muted"
                  }`}>
                    {p.status === "active" ? "Aktif" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-sm font-medium text-muted transition hover:text-cobalt"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
