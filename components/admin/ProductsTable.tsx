"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Copy,
  Search,
  X,
  Package,
} from "lucide-react";
import {
  deleteProduct,
  toggleProductStatus,
  duplicateProduct,
} from "@/app/admin/actions";
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
        toast.success(
          status === "active"
            ? `"${title}" dijadikan draft.`
            : `"${title}" diaktifkan.`
        );
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

  const filterTabs = [
    { key: "all" as const, label: "Semua", count: products.length },
    { key: "active" as const, label: "Aktif", count: activeCount },
    { key: "draft" as const, label: "Draft", count: draftCount },
  ];

  return (
    <div className="space-y-4">
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk, slug, kategori…"
            className="w-full rounded-xl border border-ink/12 bg-white py-2.5 pl-10 pr-9 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink/35 transition hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white p-1 shadow-sm">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterStatus === tab.key
                  ? "bg-ink text-white shadow-sm"
                  : "text-ink/50 hover:text-ink"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  filterStatus === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-ink/8 text-ink/50"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table / Empty ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-white py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5">
            <Package className="h-6 w-6 text-ink/30" />
          </div>
          <p className="text-sm font-medium text-ink/60">
            {search || filterStatus !== "all"
              ? "Tidak ada produk yang cocok."
              : "Belum ada produk. Tambah produk pertama kamu."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/6 bg-ink/2">
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Produk
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Urutan
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((p) => (
                  <tr key={p.id} className="group transition hover:bg-ink/2">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            p.status === "active" ? "bg-sheet" : "bg-ink/20"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-ink">{p.title}</p>
                          <p className="text-xs text-ink/35">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-lg bg-blush px-2.5 py-1 text-xs font-semibold text-cobalt">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-ink">
                      {p.price}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          p.status === "active"
                            ? "bg-sheet/25 text-ink"
                            : "bg-ink/6 text-ink/45"
                        }`}
                      >
                        {p.status === "active" ? "Aktif" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-ink/40">
                      #{p.sort_order}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-0.5 opacity-60 transition group-hover:opacity-100">
                        {p.status === "active" && (
                          <a
                            href={`/shop/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-ink/50 transition hover:bg-ink/8 hover:text-ink"
                            title="Lihat di toko"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleToggle(p.id, p.status, p.title)}
                          disabled={togglingId === p.id || deletingId === p.id}
                          className="rounded-lg p-1.5 text-ink/50 transition hover:bg-ink/8 hover:text-ink disabled:opacity-30"
                          title={p.status === "active" ? "Jadikan draft" : "Aktifkan"}
                        >
                          {p.status === "active" ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id, p.title)}
                          disabled={duplicatingId === p.id || deletingId === p.id}
                          className="rounded-lg p-1.5 text-ink/50 transition hover:bg-blush hover:text-cobalt disabled:opacity-30"
                          title="Duplikat"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="rounded-lg p-1.5 text-ink/50 transition hover:bg-blush hover:text-cobalt"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={deletingId === p.id || togglingId === p.id}
                          className="rounded-lg p-1.5 text-ink/50 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-ink/6 bg-ink/1 px-5 py-3">
            <p className="text-xs text-ink/40">
              Menampilkan {filtered.length} dari {products.length} produk
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
