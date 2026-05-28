import { createAdminClient } from "@/lib/supabase/admin";
import {
  Package,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  PlusCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { MiniBarChart } from "@/components/admin/MiniBarChart";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: draftProducts },
    { count: totalPosts },
    { count: publishedPosts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
  ]);

  const productMiniData = [
    { value: Math.max(1, (activeProducts ?? 0) - 3) },
    { value: Math.max(1, (activeProducts ?? 0) - 2) },
    { value: Math.max(1, (activeProducts ?? 0) - 1) },
    { value: activeProducts ?? 0 },
    { value: activeProducts ?? 0 },
    { value: activeProducts ?? 0 },
  ];

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Selamat pagi" : now.getHours() < 17 ? "Selamat siang" : "Selamat malam";

  return (
    <div className="space-y-7">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Overview</h1>
          <p className="mt-1.5 text-base text-muted">{greeting}, selamat bekerja 👋</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ink/85"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Produk</span>
        </Link>
      </div>

      {/* ── Stats Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">

        {/* Produk Aktif */}
        <Link
          href="/admin/products"
          className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Produk Aktif</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf">
              <Package className="h-4 w-4 text-ink" />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-ink">{activeProducts ?? 0}</p>
          <p className="mt-1.5 text-sm text-muted">{draftProducts ?? 0} draft · {totalProducts ?? 0} total</p>
          <div className="mt-4">
            <MiniBarChart data={productMiniData} color="#8bed02" />
          </div>
        </Link>

        {/* Artikel Blog */}
        <Link
          href="/admin/blog"
          className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Artikel Blog</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blush">
              <BookOpen className="h-4 w-4 text-cobalt" />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-ink">{publishedPosts ?? 0}</p>
          <p className="mt-1.5 text-sm text-muted">
            {(totalPosts ?? 0) - (publishedPosts ?? 0)} draft · {totalPosts ?? 0} total
          </p>
          <div className="mt-4">
            <MiniBarChart
              data={[
                { value: Math.max(0, (publishedPosts ?? 0) - 4) },
                { value: Math.max(0, (publishedPosts ?? 0) - 3) },
                { value: Math.max(0, (publishedPosts ?? 0) - 2) },
                { value: Math.max(0, (publishedPosts ?? 0) - 1) },
                { value: publishedPosts ?? 0 },
                { value: publishedPosts ?? 0 },
              ]}
              color="#023ffc"
            />
          </div>
        </Link>

        {/* Aksi Cepat */}
        <div className="col-span-2 lg:col-span-1 rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-ink">Aksi Cepat</h2>
          <div className="space-y-1">
            {[
              { href: "/admin/products/new", icon: PlusCircle, iconBg: "bg-leaf",  iconColor: "text-ink",    label: "Tambah Produk",  desc: "Buat template baru"    },
              { href: "/admin/blog/new",     icon: BookOpen,   iconBg: "bg-blush", iconColor: "text-cobalt", label: "Tulis Artikel",  desc: "Konten blog baru"      },
              { href: "/admin/settings",     icon: Settings,   iconBg: "bg-line",  iconColor: "text-muted",  label: "Pengaturan",     desc: "WA, tagline, brand"    },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-[#f4f6fb]"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.iconBg}`}>
                  <a.icon className={`h-4 w-4 ${a.iconColor}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{a.label}</p>
                  <p className="truncate text-xs text-muted">{a.desc}</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-line transition group-hover:text-muted" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Products ──────────────────────────────────── */}
      <RecentProductsSection />
    </div>
  );
}

async function RecentProductsSection() {
  const supabase = createAdminClient();
  const { data: recentProducts } = await supabase
    .from("products")
    .select("id, title, status, category, price, updated_at")
    .order("updated_at", { ascending: false })
    .limit(6);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-bold text-ink">Produk Terbaru</h2>
        </div>
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-xs font-semibold text-cobalt transition hover:underline"
        >
          Lihat semua
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      {!recentProducts?.length ? (
        <div className="py-12 text-center text-sm text-muted">Belum ada produk</div>
      ) : (
        <ul className="divide-y divide-line/60">
          {recentProducts.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-5 py-3.5 transition hover:bg-[#f4f6fb]">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`h-2 w-2 shrink-0 rounded-full ${p.status === "active" ? "bg-sheet" : "bg-line"}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{p.title}</p>
                  <p className="text-xs text-muted">{p.category} · {p.price}</p>
                </div>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${p.status === "active" ? "bg-sheet/20 text-ink" : "bg-line text-muted"}`}>
                  {p.status === "active" ? "Aktif" : "Draft"}
                </span>
                <Link href={`/admin/products/${p.id}`} className="text-xs font-semibold text-muted transition hover:text-cobalt">
                  →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
