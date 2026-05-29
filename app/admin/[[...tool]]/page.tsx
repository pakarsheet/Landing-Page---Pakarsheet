import { createAdminClient } from "@/lib/supabase/admin";
import {
  Package, BookOpen, ArrowUpRight, PlusCircle,
  Settings, Inbox, TrendingUp, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { MiniBarChart } from "@/components/admin/MiniBarChart";
import { OrdersChart } from "@/components/admin/OrdersChart";
import { OrderFunnelChart } from "@/components/admin/OrderFunnelChart";
import { CategoryDonutChart } from "@/components/admin/CategoryDonutChart";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import type { ActivityItem } from "@/components/admin/ActivityFeed";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: draftProducts },
    { count: totalPosts },
    { count: publishedPosts },
    { data: allOrders },
    { data: recentProducts },
    { data: allProducts },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("custom_orders").select("id, status, name, package, created_at, updated_at").order("created_at", { ascending: false }),
    supabase.from("products").select("id, title, status, category, price, updated_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("products").select("id, category, status").eq("status", "active"),
    supabase.from("posts").select("id, title, status, created_at, updated_at").order("updated_at", { ascending: false }).limit(5),
  ]);

  const orders = allOrders ?? [];

  // ── Order counts ─────────────────────────────────────────
  const baruCount      = orders.filter((o) => o.status === "baru").length;
  const dihubungiCount = orders.filter((o) => o.status === "dihubungi").length;
  const negosiasiCount = orders.filter((o) => o.status === "negosiasi").length;
  const dealCount      = orders.filter((o) => o.status === "deal").length;
  const tidakJadiCount = orders.filter((o) => o.status === "tidak-jadi").length;
  const conversionRate = orders.length > 0 ? Math.round((dealCount / orders.length) * 100) : 0;

  // ── Stale orders (baru > 2 hari) ─────────────────────────
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const staleOrders = orders.filter(
    (o) => o.status === "baru" && new Date(o.created_at).getTime() < twoDaysAgo
  );

  // ── Monthly chart data ────────────────────────────────────
  const monthlyMap: Record<string, { orders: number; deals: number }> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    monthlyMap[key] = { orders: 0, deals: 0 };
  }
  orders.forEach((o) => {
    const d = new Date(o.created_at);
    const key = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    if (monthlyMap[key]) {
      monthlyMap[key].orders++;
      if (o.status === "deal") monthlyMap[key].deals++;
    }
  });
  const ordersChartData = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

  // ── Category distribution ─────────────────────────────────
  const catMap: Record<string, number> = {};
  (allProducts ?? []).forEach((p) => {
    catMap[p.category] = (catMap[p.category] ?? 0) + 1;
  });
  const categoryData = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  // ── Mini chart data ───────────────────────────────────────
  const productMiniData = [
    { value: Math.max(1, (activeProducts ?? 0) - 3) },
    { value: Math.max(1, (activeProducts ?? 0) - 2) },
    { value: Math.max(1, (activeProducts ?? 0) - 1) },
    { value: activeProducts ?? 0 },
    { value: activeProducts ?? 0 },
    { value: activeProducts ?? 0 },
  ];

  // ── Activity feed ─────────────────────────────────────────
  const activityItems: ActivityItem[] = [
    ...(recentProducts ?? []).map((p) => ({
      id: p.id, type: "product" as const,
      label: p.title, sub: `Produk · ${p.status === "active" ? "Aktif" : "Draft"}`,
      time: p.updated_at, href: `/admin/products/${p.id}`,
    })),
    ...(recentPosts ?? []).map((p) => ({
      id: p.id, type: "post" as const,
      label: p.title, sub: `Artikel · ${p.status === "published" ? "Published" : "Draft"}`,
      time: p.updated_at, href: `/admin/blog/${p.id}`,
    })),
    ...orders.slice(0, 5).map((o) => ({
      id: o.id, type: "order" as const,
      label: o.name, sub: `Custom Order · ${o.package}`,
      time: o.created_at, href: `/admin/custom-orders`,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  const greeting =
    now.getHours() < 12 ? "Selamat pagi" :
    now.getHours() < 17 ? "Selamat siang" : "Selamat malam";

  return (
    <div className="space-y-6">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Overview</h1>
          <p className="mt-1 text-sm text-muted">{greeting}, selamat bekerja 👋</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cobalt"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Produk</span>
        </Link>
      </div>

      {/* ── Alerts ──────────────────────────────────────────── */}
      {staleOrders.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm font-semibold text-amber-800">
            {staleOrders.length === 1
              ? "1 order sudah lebih dari 2 hari belum dihubungi."
              : `${staleOrders.length} order sudah lebih dari 2 hari belum dihubungi.`}
          </p>
          <Link href="/admin/custom-orders" className="ml-auto shrink-0 text-xs font-bold text-amber-700 underline underline-offset-2">
            Lihat
          </Link>
        </div>
      )}
      {baruCount > 0 && staleOrders.length === 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-cobalt/20 bg-sky/30 px-5 py-3.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt text-xs font-bold text-white">
            {baruCount}
          </span>
          <p className="text-sm font-semibold text-ink">
            {baruCount === 1
              ? "Ada 1 order baru yang belum dihubungi."
              : `Ada ${baruCount} order baru yang belum dihubungi.`}
          </p>
          <Link href="/admin/custom-orders" className="ml-auto shrink-0 text-xs font-bold text-cobalt underline underline-offset-2">
            Lihat
          </Link>
        </div>
      )}

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <Link
          href="/admin/products"
          className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Produk Aktif</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-leaf">
              <Package className="h-4 w-4 text-ink" />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-ink">{activeProducts ?? 0}</p>
          <p className="mt-1 text-sm text-muted">{draftProducts ?? 0} draft · {totalProducts ?? 0} total</p>
          <div className="mt-4">
            <MiniBarChart data={productMiniData} color="#8bed02" />
          </div>
        </Link>

        <Link
          href="/admin/blog"
          className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Artikel Blog</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blush">
              <BookOpen className="h-4 w-4 text-cobalt" />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-ink">{publishedPosts ?? 0}</p>
          <p className="mt-1 text-sm text-muted">
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

        <Link
          href="/admin/custom-orders"
          className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Custom Orders</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky/40">
              <Inbox className="h-4 w-4 text-cobalt" />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-ink">{orders.length}</p>
          <p className="mt-1 text-sm text-muted">
            {baruCount > 0
              ? <span className="font-semibold text-cobalt">{baruCount} baru</span>
              : "Semua ditangani"}
            {" · "}{dealCount} deal
          </p>
          <div className="mt-4">
            <MiniBarChart data={ordersChartData.map((d) => ({ value: d.orders }))} color="#023ffc" />
          </div>
        </Link>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Conversion</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-leaf">
              <TrendingUp className="h-4 w-4 text-ink" />
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-ink">{conversionRate}%</p>
          <p className="mt-1 text-sm text-muted">{dealCount} deal dari {orders.length} inquiry</p>
          <div className="mt-4">
            <MiniBarChart data={ordersChartData.map((d) => ({ value: d.deals }))} color="#8bed02" />
          </div>
        </div>
      </div>

      {/* ── Charts Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        <div className="lg:col-span-2 rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink">Tren Custom Orders</h2>
              <p className="mt-0.5 text-xs text-muted">6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sheet" />
                Inquiry
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cobalt" />
                Deal
              </span>
            </div>
          </div>
          <OrdersChart data={ordersChartData} />
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-ink">Kategori Produk</h2>
            <p className="mt-0.5 text-xs text-muted">Distribusi produk aktif</p>
          </div>
          <CategoryDonutChart data={categoryData} />
        </div>
      </div>

      {/* ── Funnel + Activity ────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink">Pipeline Orders</h2>
              <p className="mt-0.5 text-xs text-muted">Status semua custom order</p>
            </div>
            <Link
              href="/admin/custom-orders"
              className="flex items-center gap-1 text-xs font-semibold text-cobalt transition hover:underline"
            >
              Kelola
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <OrderFunnelChart
            baru={baruCount}
            dihubungi={dihubungiCount}
            negosiasi={negosiasiCount}
            deal={dealCount}
            tidakJadi={tidakJadiCount}
          />
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-ink">Aktivitas Terbaru</h2>
            <p className="mt-0.5 text-xs text-muted">Produk, artikel, dan order</p>
          </div>
          <ActivityFeed items={activityItems} />
        </div>
      </div>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-ink">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { href: "/admin/products/new", icon: PlusCircle, iconBg: "bg-leaf",   iconColor: "text-ink",    label: "Tambah Produk", desc: "Buat template baru"  },
            { href: "/admin/blog/new",     icon: BookOpen,   iconBg: "bg-blush",  iconColor: "text-cobalt", label: "Tulis Artikel", desc: "Konten blog baru"    },
            { href: "/admin/custom-orders",icon: Inbox,      iconBg: "bg-sky/40", iconColor: "text-cobalt", label: "Custom Orders", desc: `${baruCount} baru`   },
            { href: "/admin/settings",     icon: Settings,   iconBg: "bg-line",   iconColor: "text-muted",  label: "Pengaturan",    desc: "WA, tagline, brand"  },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-[#f4f6fb]"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${a.iconBg}`}>
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
  );
}
