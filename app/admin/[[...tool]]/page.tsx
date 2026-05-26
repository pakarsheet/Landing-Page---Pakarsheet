import { createAdminClient } from "@/lib/supabase/admin";
import {
  Package,
  Settings,
  TrendingUp,
  Eye,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [{ count: totalProducts }, { count: activeProducts }, { count: draftProducts }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "draft"),
    ]);

  const { data: recentProducts } = await supabase
    .from("products")
    .select("id, title, status, category, price, updated_at")
    .order("updated_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Produk", value: totalProducts ?? 0, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Produk Aktif", value: activeProducts ?? 0, icon: Eye, color: "bg-green-50 text-green-600" },
    { label: "Draft", value: draftProducts ?? 0, icon: TrendingUp, color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Selamat datang di Pakarsheet Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products/new"
          className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-900 hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
            <PlusCircle className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Tambah Produk Baru</p>
            <p className="text-sm text-gray-500">Buat template baru untuk toko</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900" />
        </Link>

        <Link
          href="/admin/settings"
          className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-900 hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <Settings className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Pengaturan Situs</p>
            <p className="text-sm text-gray-500">Nomor WA, pesan, tagline</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900" />
        </Link>
      </div>

      {/* Recent products */}
      {recentProducts && recentProducts.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Produk Terbaru</h2>
            <Link href="/admin/products" className="text-sm font-medium text-blue-600 hover:underline">
              Lihat semua
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{p.title}</p>
                  <p className="text-sm text-gray-500">{p.category} · {p.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    p.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.status === "active" ? "Aktif" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
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
