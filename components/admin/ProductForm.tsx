"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, uploadProductImage, deleteProduct } from "@/app/admin/actions";
import type { Product } from "@/lib/supabase/types";
import { Loader2, Plus, Trash2, Upload, X, AlertTriangle } from "lucide-react";
import { toast } from "@/components/admin/Toast";

const CATEGORIES = ["Finance", "Sales", "Operasional", "Bundle", "Marketing", "Project"];
const ACCENTS = [
  { label: "Blue (sky)", value: "bg-sky text-cobalt" },
  { label: "Green (leaf)", value: "bg-leaf text-cobalt" },
  { label: "Purple (lilac)", value: "bg-lilac text-cobalt" },
  { label: "Sheet (green)", value: "bg-sheet text-ink" },
];

interface Props {
  product?: Product;
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [features, setFeatures] = useState<string[]>(product?.features ?? [""]);
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(product?.whats_included ?? [""]);
  const [images, setImages] = useState<string[]>(product?.preview_images ?? [""]);
  const [slug, setSlug] = useState(product?.slug ?? "");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!product) {
      const generated = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  }

  function handleDelete() {
    if (!product) return;
    startDeleteTransition(async () => {
      const result = await deleteProduct(product.id);
      if (result?.error) {
        setError("Gagal menghapus produk: " + result.error);
        setShowDeleteConfirm(false);
      } else {
        toast.success("Produk berhasil dihapus.");
        router.push("/admin/products");
      }
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !slug) {
      alert("Isi slug produk terlebih dahulu sebelum upload gambar.");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", slug);
    const result = await uploadProductImage(fd);
    setUploading(false);
    if (result.error) {
      alert("Upload gagal: " + result.error);
    } else if (result.url) {
      setImages((prev) => {
        const filtered = prev.filter(Boolean);
        return [...filtered, result.url!];
      });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("features", features.filter(Boolean).join("\n"));
    formData.set("whats_included", whatsIncluded.filter(Boolean).join("\n"));
    formData.set("preview_images", images.filter(Boolean).join("\n"));
    formData.set("slug", slug);

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success(product ? "Produk berhasil diperbarui." : "Produk baru berhasil dibuat.");
        router.push("/admin/products");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Info Dasar ─────────────────────────────────────── */}
      <FormSection title="Info Dasar">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title *">
            <input
              name="title"
              required
              defaultValue={product?.title}
              onChange={handleTitleChange}
              className={inputCls}
              placeholder="Content Planner Instagram Pro"
            />
          </Field>
          <Field label="Short Title *">
            <input
              name="short_title"
              required
              defaultValue={product?.short_title}
              className={inputCls}
              placeholder="Content Planner IG"
            />
          </Field>
        </div>

        <Field label="Slug *" hint={`URL: /shop/${slug || "..."}`}>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputCls}
            placeholder="content-planner-instagram-pro"
          />
        </Field>

        <Field label="Deskripsi Pendek *">
          <textarea
            name="description"
            required
            rows={2}
            defaultValue={product?.description}
            className={inputCls}
            placeholder="Satu kalimat deskripsi untuk card di toko."
          />
        </Field>

        <Field label="Deskripsi Panjang *">
          <textarea
            name="long_description"
            required
            rows={4}
            defaultValue={product?.long_description}
            className={inputCls}
            placeholder="Deskripsi lengkap yang muncul di halaman detail produk."
          />
        </Field>
      </FormSection>

      {/* ── Kategori & Tampilan ─────────────────────────────── */}
      <FormSection title="Kategori & Tampilan">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Kategori *">
            <select name="category" defaultValue={product?.category ?? "Finance"} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Badge *">
            <input
              name="badge"
              required
              defaultValue={product?.badge}
              className={inputCls}
              placeholder="Marketing"
            />
          </Field>
          <Field label="Accent Color">
            <select name="accent" defaultValue={product?.accent ?? "bg-sky text-cobalt"} className={inputCls}>
              {ACCENTS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="flex flex-wrap gap-6">
          <CheckboxField name="is_new" defaultChecked={product?.is_new ?? false} label="Tandai sebagai Baru" />
          <CheckboxField name="is_best_seller" defaultChecked={product?.is_best_seller ?? false} label="Tandai sebagai Terlaris" />
        </div>
      </FormSection>

      {/* ── Harga ───────────────────────────────────────────── */}
      <FormSection title="Harga">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Harga Tampil *">
            <input name="price" required defaultValue={product?.price} className={inputCls} placeholder="Rp99rb" />
          </Field>
          <Field label="Harga Raw (angka) *">
            <input name="price_raw" type="number" required min={0} defaultValue={product?.price_raw ?? 0} className={inputCls} placeholder="99000" />
          </Field>
          <Field label="Harga Coret (opsional)">
            <input name="original_price" defaultValue={product?.original_price ?? ""} className={inputCls} placeholder="Rp149rb" />
          </Field>
        </div>
      </FormSection>

      {/* ── CTA & Status ────────────────────────────────────── */}
      <FormSection title="CTA & Status">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CTA URL *">
            <input name="cta_url" type="url" required defaultValue={product?.cta_url} className={inputCls} placeholder="https://lynkd.id/pakarsheet" />
          </Field>
          <Field label="Urutan Tampil">
            <input name="sort_order" type="number" min={0} defaultValue={product?.sort_order ?? 0} className={inputCls} />
          </Field>
        </div>
        <Field label="Status">
          <select name="status" defaultValue={product?.status ?? "draft"} className={inputCls}>
            <option value="active">Aktif (tampil di toko)</option>
            <option value="draft">Draft (tersembunyi)</option>
          </select>
        </Field>
      </FormSection>

      {/* ── Fitur Utama ─────────────────────────────────────── */}
      <FormSection title="Fitur Utama">
        <DynamicList items={features} onChange={setFeatures} placeholder="Kalender konten bulanan" addLabel="Tambah fitur" />
      </FormSection>

      {/* ── What's Included ─────────────────────────────────── */}
      <FormSection title="Yang Kamu Dapat (What's Included)">
        <DynamicList items={whatsIncluded} onChange={setWhatsIncluded} placeholder="1 file Google Sheets siap pakai" addLabel="Tambah item" />
      </FormSection>

      {/* ── Gambar Preview ──────────────────────────────────── */}
      <FormSection title="Gambar Preview">
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={img}
                onChange={(e) => {
                  const next = [...images];
                  next[i] = e.target.value;
                  setImages(next);
                }}
                className={inputCls}
                placeholder="https://... atau /previews/slug/preview-1.jpg"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="shrink-0 rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setImages([...images, ""])}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted transition hover:border-ink/30 hover:text-ink"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah URL
            </button>
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-cobalt/30 px-3 py-2 text-sm text-cobalt transition hover:border-cobalt hover:bg-sky">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploading ? "Mengupload..." : "Upload Gambar"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          <p className="text-xs text-muted/70">
            Gambar diupload ke Supabase Storage. Pastikan slug sudah diisi sebelum upload.
          </p>
        </div>
      </FormSection>

      {/* ── Submit ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t border-line pt-5">
        <button
          type="submit"
          disabled={isPending || isDeleting}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cobalt disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Menyimpan..." : product ? "Simpan Perubahan" : "Buat Produk"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          disabled={isPending || isDeleting}
          className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-ink disabled:opacity-60"
        >
          Batal
        </button>

        {product && (
          <div className="ml-auto">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isPending || isDeleting}
                className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Produk
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                <span className="text-sm font-medium text-red-700">Yakin hapus produk ini?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/15";

// ── Sub-components ────────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted/70">{hint}</p>}
    </div>
  );
}

function CheckboxField({ name, defaultChecked, label }: { name: string; defaultChecked: boolean; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line accent-cobalt"
      />
      <span className="text-sm font-medium text-ink">{label}</span>
    </label>
  );
}

function DynamicList({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className={inputCls}
            placeholder={placeholder}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted transition hover:border-ink/30 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
