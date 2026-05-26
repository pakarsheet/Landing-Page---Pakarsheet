"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit2, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { deleteProduct, toggleProductStatus } from "@/app/admin/actions";
import type { Product } from "@/lib/supabase/types";

interface Props {
  products: Product[];
}

export function ProductsTable({ products }: Props) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus produk "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteProduct(id);
      setDeletingId(null);
    });
  }

  function handleToggle(id: string, status: string) {
    startTransition(async () => {
      await toggleProductStatus(id, status);
    });
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="text-gray-500">Belum ada produk. Tambah produk pertama kamu.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-6 py-3.5 text-left font-semibold text-gray-600">Produk</th>
            <th className="px-4 py-3.5 text-left font-semibold text-gray-600">Kategori</th>
            <th className="px-4 py-3.5 text-left font-semibold text-gray-600">Harga</th>
            <th className="px-4 py-3.5 text-left font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3.5 text-left font-semibold text-gray-600">Urutan</th>
            <th className="px-6 py-3.5 text-right font-semibold text-gray-600">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="transition hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.slug}</p>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {p.category}
                </span>
              </td>
              <td className="px-4 py-4 font-medium text-gray-900">{p.price}</td>
              <td className="px-4 py-4">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  p.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {p.status === "active" ? "Aktif" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-500">{p.sort_order}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  {/* View live */}
                  {p.status === "active" && (
                    <a
                      href={`/shop/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      title="Lihat di toko"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {/* Toggle status */}
                  <button
                    onClick={() => handleToggle(p.id, p.status)}
                    disabled={isPending}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    title={p.status === "active" ? "Jadikan draft" : "Aktifkan"}
                  >
                    {p.status === "active" ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {/* Edit */}
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    disabled={deletingId === p.id || isPending}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
