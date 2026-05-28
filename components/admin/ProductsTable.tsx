"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Eye, EyeOff, ExternalLink, Copy, Search, X } from "lucide-react";
import { deleteProduct, toggleProductStatus, duplicateProduct } from "@/app/admin/actions";
import { toast } from "@/components/admin/Toast";
import type { Product } from "@/lib/supabase/types";

interface Props {
  products: Product[];
}

export function ProductsTable({ products }: Props) {
  const router = useRouter();
  const [, startDeleteTransition] = useTransition();
  const [, startToggleTransition] = useTransition();
  const [, startDuplicateTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Search & filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft">("all");

  const filtered = products.filter((p) => {
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus produk "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(id);
    startDeleteTransition(async () => {
      const result = await deleteProduct(id);
      setDeletingId(null);
      if (result?.error) {
        toast.error("Gagal menghapus: " + result.error);
      } else {
        toast.success(`Produk "${title}" berhasil dihapus.`);
        router.refresh();
      }
    });
  }

  function handleToggle(id: string, status: string, title: string) {
    setTogglingId(id);
    startToggleTransition(async () => {
      const result = await toggleProductStatus(id, status);
      setTogglingId(null);
      if (result?.error) {
        toast.error("Gagal mengubah status: " + result.error);
      } else {
        toast.success(status === "active" ? `"${title}" dijadikan draft.` : `"${title}" diaktifkan.`);
        router.refresh();
      }
    });
  }

  function handleDuplicate(id: string, title: string) {
    setDuplicatingId(id);
    startDuplicateTransition(async () => {
      const result = await duplicateProduct(id);
      setDuplicatingId(null);
      if (result?.error) {
        toast.error("Gagal menduplikat: " + result.error);
      } else {
        toast.success(`"${title}" berhasil diduplikat sebagai draft.`);
        router.refresh();
      }
    });
  }

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount = products.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-4">
      {/* Search & filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk, slug, kategori..."
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-9 text-sm text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/15"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(["all", "active", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filterStatus === s
                  ? "bg-ink text-white"
                  : "border border-line bg-white text-muted hover:border-ink/30 hover:text-ink"
              }`}
            >
              {s === "all" ? `Semua (${products.length})` : s === "active" ? `Aktif (${activeCount})` : `Draft (${draftCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <p className="text-muted">
            {search || filterStatus !== "all" ? "Tidak ada produk yang cocok." : "Belum ada produk. Tambah produk pertama kamu."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-blush/40">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">Produk</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">Kategori</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">Harga</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">Status</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted">Urutan</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-muted">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition hover:bg-blush/20">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-ink">{p.title}</p>
                        <p className="text-xs text-muted/70">{p.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-sky px-2.5 py-1 text-xs font-medium text-cobalt">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-ink">{p.price}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.status === "active" ? "bg-leaf text-cobalt" : "bg-blush text-muted"
                      }`}>
                        {p.status === "active" ? "Aktif" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted">{p.sort_order}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {p.status === "active" && (
                          <a
                            href={`/shop/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-muted transition hover:bg-line hover:text-ink"
                            title="Lihat di toko"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleToggle(p.id, p.status, p.title)}
                          disabled={togglingId === p.id || deletingId === p.id}
                          className="rounded-lg p-1.5 text-muted transition hover:bg-line hover:text-ink disabled:opacity-40"
                          title={p.status === "active" ? "Jadikan draft" : "Aktifkan"}
                        >
                          {p.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id, p.title)}
                          disabled={duplicatingId === p.id || deletingId === p.id}
                          className="rounded-lg p-1.5 text-muted transition hover:bg-sky hover:text-cobalt disabled:opacity-40"
                          title="Duplikat"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="rounded-lg p-1.5 text-muted transition hover:bg-sky hover:text-cobalt"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={deletingId === p.id || togglingId === p.id}
                          className="rounded-lg p-1.5 text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
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
          {filtered.length > 0 && (
            <div className="border-t border-line px-6 py-3">
              <p className="text-xs text-muted">
                Menampilkan {filtered.length} dari {products.length} produk
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
