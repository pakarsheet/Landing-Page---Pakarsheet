import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const metadata = { title: "Produk — Admin Pakarsheet" };

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        Gagal memuat produk: {error.message}
      </div>
    );
  }

  const activeCount = (products ?? []).filter((p) => p.status === "active").length;
  const draftCount  = (products ?? []).filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Produk</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted">
            <span>{products?.length ?? 0} total</span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span className="font-semibold text-ink">{activeCount} aktif</span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span>{draftCount} draft</span>
          </div>
        </div>
        <Link
          href="/admin/products/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cobalt"
        >
          <PlusCircle className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-sheet" />
          <span className="text-sm font-semibold text-ink">{activeCount}</span>
          <span className="text-sm text-muted">Aktif</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="text-sm font-semibold text-ink">{draftCount}</span>
          <span className="text-sm text-muted">Draft</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 shadow-sm">
          <span className="text-sm font-semibold text-ink">{products?.length ?? 0}</span>
          <span className="text-sm text-muted">Total</span>
        </div>
      </div>

      <ProductsTable products={products ?? []} />
    </div>
  );
}
