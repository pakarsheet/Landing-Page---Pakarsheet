import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Tambah Produk — Admin Pakarsheet" };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tambah Produk Baru</h1>
        <p className="mt-1 text-sm text-gray-500">Isi semua field lalu simpan.</p>
      </div>
      <ProductForm />
    </div>
  );
}
