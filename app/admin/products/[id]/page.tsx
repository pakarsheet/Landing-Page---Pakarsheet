import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft, Edit2 } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Edit Produk — Admin Pakarsheet" };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Produk
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blush">
            <Edit2 className="h-4 w-4 text-cobalt" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Edit Produk</h1>
            <p className="text-sm text-ink/50 truncate max-w-md">{product.title}</p>
          </div>
        </div>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
