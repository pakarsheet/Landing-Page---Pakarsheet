import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { PlusCircle, Package } from "lucide-react";
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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        Gagal memuat produk: {error.message}
      </div>
    );
  }

  const activeCount = (products ?? []).filter((p) => p.status === "active").length;
  const draftCount = (products ?? []).filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cobalt/8">
              <Package className="h-4.5 w-4.5 text-cobalt" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Produk</h1>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-ink/50">
              {products?.length ?? 0} total
            </span>
            <span className="h-1 w-1 rounded-full bg-ink/20" />
            <span className="text-sm text-ink/50">{activeCount} aktif</span>
            <span className="h-1 w-1 rounded-full bg-ink/20" />
            <span className="text-sm text-ink/50">{draftCount} draft</span>
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

      <ProductsTable products={products ?? []} />
    </div>
  );
}
