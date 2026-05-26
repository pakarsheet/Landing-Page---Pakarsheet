import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

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
        <h1 className="text-2xl font-semibold text-gray-900">Edit Produk</h1>
        <p className="mt-1 text-sm text-gray-500">{product.title}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
