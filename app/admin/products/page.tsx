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
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        Gagal memuat produk: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Produk</h1>
          <p className="mt-1 text-sm text-muted">
            {products?.length ?? 0} produk terdaftar
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cobalt"
        >
          <PlusCircle className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      <ProductsTable products={products ?? []} />
    </div>
  );
}
