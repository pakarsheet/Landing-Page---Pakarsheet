import { createAdminClient } from "@/lib/supabase/admin";
import {
  Package,
  Settings,
  FileText,
  Eye,
  PlusCircle,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  Layers,
  ClipboardList,
  Dot,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: draftProducts },
    { count: totalPosts },
    { count: newOrders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase
      .from("custom_orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "baru"),
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
      sub: `${activeProducts ?? 0} aktif · ${draftProducts ?? 0} draft`,
      icon: Package,
      accent: "bg-cobalt/8 text-cobalt",
      href: "/admin/products",
    },
    {
      label: "Produk Aktif",
      value: activeProducts ?? 0,
      sub: "Tampil di toko",
      icon: TrendingUp,
      accent: "bg-sheet/20 text-ink",
      href: "/admin/products",
    },
    {
      label: "Artikel Blog",
      value: totalPosts ?? 0,
      sub: "Total artikel",
      icon: BookOpen,
      accent: "bg-blush text-cobalt",
      href: "/admin/blog",
    },
    {
      label: "Order Baru",
      value: newOrders ?? 0,
      sub: "Perlu ditindaklanjuti",
      icon: ClipboardList,
      accent: (newOrders ?? 0) > 0 ? "bg-sheet text-ink" : "bg-line text-muted",
      href: "/admin/custom-orders",
      highlight: (newOrders ?? 0) > 0,
    },
  ];

  const quickActions = [
    {
      href: "/admin/products/new",
      icon: PlusCircle,
      iconBg: "bg-ink",
      iconColor: "text-white",
      title: "Tambah Produk",
      desc: "Buat template baru untuk toko",
    },
    {
      href: "/admin/blog/new",
      icon: BookOpen,
      iconBg: "bg-blush",
      iconColor: "text-cobalt",
      title: "Tulis Artikel",
      desc: "Tambah konten blog baru",
    },
    {
      href: "/admin/custom-orders",
      icon: ClipboardList,
      iconBg: "bg-sheet/25",
      iconColor: "text-ink",
      title: "Custom Orders",
      desc: "Lihat inquiry masuk",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      iconBg: "bg-line",
      iconColor: "text-muted",
      title: "Pengaturan",
      desc: "Nomor WA, tagline, brand",
    },
  ];

  return (
    <div className="space-y-7">
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-ink/50">
            Selamat datang kembali di Pakarsheet Admin.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3.5 py-2 text-xs font-semibold text-ink/60 shadow-sm transition hover:border-ink/20 hover:text-ink"
        >
          <Eye className="h-3.5 w-3.5" />
          Lihat Website
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>

      {/* ── Stats grid ───────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              s.highlight ? "border-sheet/60" : "border-ink/8"
            }`}
          >
            {s.highlight && (
              <span className="absolute right-3 top-3 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sheet opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sheet" />
              </span>
            )}
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold text-ink/45">{s.label}</p>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${s.accent}`}
              >
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-ink">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-ink/40">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* ── Quick actions ─────────────────────────────────────── */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-ink/35">
          Aksi Cepat
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-3.5 rounded-2xl border border-ink/8 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-md"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.iconBg}`}
              >
                <a.icon className={`h-4 w-4 ${a.iconColor}`} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{a.title}</p>
                <p className="truncate text-xs text-ink/45">{a.desc}</p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink/20 transition group-hover:text-ink/50" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent products ───────────────────────────────────── */}
      {recentProducts && recentProducts.length > 0 && (
        <div className="rounded-2xl border border-ink/8 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink/6">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-ink/40" />
              <p className="text-sm font-semibold text-ink">Produk Terbaru</p>
            </div>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-xs font-semibold text-cobalt transition hover:underline"
            >
              Lihat semua
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-ink/5">
            {recentProducts.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between px-5 py-3.5 transition hover:bg-ink/2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-2 w-2 shrink-0 rounded-full ${
                      p.status === "active" ? "bg-sheet" : "bg-ink/20"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {p.title}
                    </p>
                    <p className="text-xs text-ink/40">
                      {p.category} · {p.price}
                    </p>
                  </div>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      p.status === "active"
                        ? "bg-sheet/20 text-ink"
                        : "bg-ink/6 text-ink/45"
                    }`}
                  >
                    {p.status === "active" ? "Aktif" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs font-semibold text-ink/40 transition hover:text-cobalt"
                  >
                    Edit →
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
