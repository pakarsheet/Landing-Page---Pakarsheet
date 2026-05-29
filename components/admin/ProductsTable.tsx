"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit2, Trash2, Eye, EyeOff, ExternalLink,
  Copy, Search, X, Package, Tag, ArrowUpDown, AlertTriangle,
} from "lucide-react";
import {
  deleteProduct,
  toggleProductStatus,
  duplicateProduct,
} from "@/app/admin/actions";
import { toast } from "@/components/admin/Toast";
import type { Product } from "@/lib/supabase/types";

// ── Delete Confirmation Modal ─────────────────────────────────────────────────

interface DeleteModalProps {
  product: { id: string; title: string } | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteModal({ product, onConfirm, onCancel, isDeleting }: DeleteModalProps) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border border-ink/10 bg-white p-7 shadow-2xl">
        {/* Icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>

        {/* Content */}
        <h2 className="font-primary text-xl font-bold text-ink">Hapus Produk?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Kamu akan menghapus{" "}
          <span className="font-semibold text-ink">"{product.title}"</span>.
          Tindakan ini tidak bisa dibatalkan dan produk akan hilang permanen.
        </p>

        {/* Actions */}
        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-ink/12 bg-white px-5 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-ink/5 hover:text-ink disabled:opacity-40"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Menghapus…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Ya, Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_COLOR: Record<string, string> = {
  Finance:      "bg-sky text-cobalt",
  Sales:        "bg-leaf text-cobalt",
  Operasional:  "bg-sheet text-ink",
  Bundle:       "bg-ink text-white",
  Marketing:    "bg-blush text-cobalt",
  Project:      "bg-lilac text-ink",
};

interface Props {
  products: Product[];
}

export function ProductsTable({ products }: Props) {
  const router = useRouter();
  const [, startDeleteTransition]    = useTransition();
  const [, startToggleTransition]    = useTransition();
  const [, startDuplicateTransition] = useTransition();
  const [deletingId,    setDeletingId]    = useState<string | null>(null);
  const [togglingId,    setTogglingId]    = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState<"all" | "active" | "draft">("all");
  const [deleteTarget,  setDeleteTarget]  = useState<{ id: string; title: string } | null>(null);

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
    setDeleteTarget({ id, title });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const { id, title } = deleteTarget;
    setDeletingId(id);
    startDeleteTransition(async () => {
      const result = await deleteProduct(id);
      setDeletingId(null);
      setDeleteTarget(null);
      if (result?.error) toast.error("Gagal menghapus: " + result.error);
      else { toast.success(`"${title}" berhasil dihapus.`); router.refresh(); }
    });
  }

  function cancelDelete() {
    setDeleteTarget(null);
  }

  function handleToggle(id: string, status: string, title: string) {
    setTogglingId(id);
    startToggleTransition(async () => {
      const result = await toggleProductStatus(id, status);
      setTogglingId(null);
      if (result?.error) toast.error("Gagal mengubah status: " + result.error);
      else {
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
      if (result?.error) toast.error("Gagal menduplikat: " + result.error);
      else { toast.success(`"${title}" berhasil diduplikat sebagai draft.`); router.refresh(); }
    });
  }

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount  = products.filter((p) => p.status === "draft").length;

  const filterTabs = [
    { key: "all"    as const, label: "Semua", count: products.length },
    { key: "active" as const, label: "Aktif", count: activeCount     },
    { key: "draft"  as const, label: "Draft", count: draftCount      },
  ];

  return (
    <div className="space-y-4">
      {/* ── Delete Confirmation Modal ── */}
      <DeleteModal
        product={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={!!deletingId}
      />
      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk, slug, kategori…"
            className="w-full rounded-2xl border border-ink/12 bg-white py-3 pl-11 pr-10 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt/50 focus:ring-2 focus:ring-cobalt/12"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink/35 transition hover:bg-ink/6 hover:text-ink">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-ink/10 bg-white p-1.5 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`shrink-0 flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                filterStatus === tab.key ? "bg-ink text-white shadow-sm" : "text-ink/50 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none ${
                filterStatus === tab.key ? "bg-white/20 text-white" : "bg-ink/8 text-ink/45"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-white py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5">
            <Package className="h-6 w-6 text-ink/30" />
          </div>
          <p className="text-sm font-medium text-ink/60">
            {search || filterStatus !== "all" ? "Tidak ada produk yang cocok." : "Belum ada produk. Tambah produk pertama kamu."}
          </p>
        </div>
      ) : (
        /* ── Card list ── */
        <div className="space-y-3">
          {filtered.map((p) => {
            const catColor = CATEGORY_COLOR[p.category] ?? "bg-blush text-cobalt";
            const isActive = p.status === "active";
            const isBusy   = deletingId === p.id || togglingId === p.id || duplicatingId === p.id;

            return (
              <div
                key={p.id}
                className={`group rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:shadow-card ${
                  isActive ? "border-ink/8" : "border-dashed border-ink/12"
                }`}
              >
                {/* ── Top row ── */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Left: status dot + title + slug */}
                  <div className="flex items-start gap-3">
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${isActive ? "bg-sheet" : "bg-ink/20"}`} />
                    <div>
                      <p className="font-primary text-base font-semibold text-ink">{p.title}</p>
                      <p className="mt-0.5 font-secondary text-xs text-muted">{p.slug}</p>
                    </div>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-1.5">
                    {isActive && (
                      <a
                        href={`/shop/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/40 shadow-sm transition hover:border-ink/20 hover:text-ink"
                        title="Lihat di toko"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleToggle(p.id, p.status, p.title)}
                      disabled={isBusy}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/40 shadow-sm transition hover:border-ink/20 hover:text-ink disabled:opacity-30"
                      title={isActive ? "Jadikan draft" : "Aktifkan"}
                    >
                      {isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDuplicate(p.id, p.title)}
                      disabled={isBusy}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/40 shadow-sm transition hover:border-cobalt/20 hover:text-cobalt disabled:opacity-30"
                      title="Duplikat"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex h-8 items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3 font-secondary text-xs font-semibold text-ink/50 shadow-sm transition hover:border-cobalt/30 hover:bg-blush hover:text-cobalt"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={isBusy}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/40 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                      title="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── Meta chips ── */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {/* Kategori */}
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-secondary text-xs font-semibold ${catColor}`}>
                    <Tag className="h-3 w-3" />
                    {p.category}
                  </span>

                  {/* Harga */}
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2.5 py-1 font-secondary text-xs font-semibold text-ink">
                    {p.price}
                    {p.original_price && (
                      <span className="font-normal text-ink/35 line-through">{p.original_price}</span>
                    )}
                  </span>

                  {/* Status */}
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-secondary text-xs font-semibold ${
                    isActive ? "bg-sheet/30 text-ink" : "bg-ink/6 text-ink/40"
                  }`}>
                    {isActive ? "Aktif" : "Draft"}
                  </span>

                  {/* Urutan */}
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2.5 py-1 font-secondary text-xs font-semibold text-ink/50">
                    <ArrowUpDown className="h-3 w-3" />
                    Urutan #{p.sort_order}
                  </span>

                  {/* Badges */}
                  {p.is_new && (
                    <span className="rounded-lg bg-cobalt/10 px-2.5 py-1 font-secondary text-xs font-semibold text-cobalt">
                      New
                    </span>
                  )}
                  {p.is_best_seller && (
                    <span className="rounded-lg bg-sheet px-2.5 py-1 font-secondary text-xs font-semibold text-ink">
                      Best Seller
                    </span>
                  )}
                </div>

                {/* ── Description ── */}
                {p.description && (
                  <p className="mt-3 font-secondary text-sm leading-relaxed text-muted line-clamp-2">
                    {p.description}
                  </p>
                )}
              </div>
            );
          })}

          <p className="px-1 text-xs text-ink/35">
            Menampilkan {filtered.length} dari {products.length} produk
          </p>
        </div>
      )}
    </div>
  );
}
