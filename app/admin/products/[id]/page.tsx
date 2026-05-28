import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted">
          <Link href="/admin/products" className="hover:text-cobalt">Produk</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{product.title}</span>
        </div>
        <h1 className="text-2xl font-semibold text-ink">Edit Produk</h1>
        <p className="mt-1 text-sm text-muted">{product.title}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
