"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, uploadProductImage } from "@/app/admin/actions";
import type { Product } from "@/lib/supabase/types";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Dynamic list states
  const [features, setFeatures] = useState<string[]>(
    product?.features ?? [""]
  );
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(
    product?.whats_included ?? [""]
  );
  const [images, setImages] = useState<string[]>(
    product?.preview_images ?? [""]
  );

  // Auto-generate slug from title
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

    // Override dynamic lists with current state
    formData.set("features", features.filter(Boolean).join("\n"));
    formData.set("whats_included", whatsIncluded.filter(Boolean).join("\n"));
    formData.set("preview_images", images.filter(Boolean).join("\n"));
    formData.set("slug", slug);

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);
      if (result?.error) setError(result.error);
    });
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ── Section: Info Dasar ─────────────────────────────── */}
      <FormSection title="Info Dasar">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Title *</label>
            <input
              name="title"
              required
              defaultValue={product?.title}
              onChange={handleTitleChange}
              className={inputCls}
              placeholder="Content Planner Instagram Pro"
            />
          </div>
          <div>
            <label className={labelCls}>Short Title *</label>
            <input
              name="short_title"
              required
              defaultValue={product?.short_title}
              className={inputCls}
              placeholder="Content Planner IG"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Slug *</label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputCls}
            placeholder="content-planner-instagram-pro"
          />
          <p className="mt-1 text-xs text-gray-400">
            URL: /shop/{slug || "..."}
          </p>
        </div>

        <div>
          <label className={labelCls}>Deskripsi Pendek *</label>
          <textarea
            name="description"
            required
            rows={2}
            defaultValue={product?.description}
            className={inputCls}
            placeholder="Satu kalimat deskripsi untuk card di toko."
          />
        </div>

        <div>
          <label className={labelCls}>Deskripsi Panjang *</label>
          <textarea
            name="long_description"
            required
            rows={4}
            defaultValue={product?.long_description}
            className={inputCls}
            placeholder="Deskripsi lengkap yang muncul di halaman detail produk."
          />
        </div>
      </FormSection>

      {/* ── Section: Kategori & Badge ───────────────────────── */}
      <FormSection title="Kategori & Tampilan">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Kategori *</label>
            <select name="category" defaultValue={product?.category ?? "Finance"} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Badge *</label>
            <input
              name="badge"
              required
              defaultValue={product?.badge}
              className={inputCls}
              placeholder="Marketing"
            />
          </div>
          <div>
            <label className={labelCls}>Accent Color</label>
            <select name="accent" defaultValue={product?.accent ?? "bg-sky text-cobalt"} className={inputCls}>
              {ACCENTS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              name="is_new"
              defaultChecked={product?.is_new ?? false}
              className="h-4 w-4 rounded border-gray-300 accent-gray-900"
            />
            <span className="text-sm font-medium text-gray-700">Tandai sebagai Baru</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              name="is_best_seller"
              defaultChecked={product?.is_best_seller ?? false}
              className="h-4 w-4 rounded border-gray-300 accent-gray-900"
            />
            <span className="text-sm font-medium text-gray-700">Tandai sebagai Terlaris</span>
          </label>
        </div>
      </FormSection>

      {/* ── Section: Harga ──────────────────────────────────── */}
      <FormSection title="Harga">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Harga Tampil *</label>
            <input
              name="price"
              required
              defaultValue={product?.price}
              className={inputCls}
              placeholder="Rp99rb"
            />
          </div>
          <div>
            <label className={labelCls}>Harga Raw (angka) *</label>
            <input
              name="price_raw"
              type="number"
              required
              min={0}
              defaultValue={product?.price_raw ?? 0}
              className={inputCls}
              placeholder="99000"
            />
          </div>
          <div>
            <label className={labelCls}>Harga Coret (opsional)</label>
            <input
              name="original_price"
              defaultValue={product?.original_price ?? ""}
              className={inputCls}
              placeholder="Rp149rb"
            />
          </div>
        </div>
      </FormSection>

      {/* ── Section: CTA & Status ───────────────────────────── */}
      <FormSection title="CTA & Status">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>CTA URL *</label>
            <input
              name="cta_url"
              type="url"
              required
              defaultValue={product?.cta_url}
              className={inputCls}
              placeholder="https://lynkd.id/pakarsheet"
            />
          </div>
          <div>
            <label className={labelCls}>Urutan Tampil</label>
            <input
              name="sort_order"
              type="number"
              min={0}
              defaultValue={product?.sort_order ?? 0}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select name="status" defaultValue={product?.status ?? "draft"} className={inputCls}>
            <option value="active">Aktif (tampil di toko)</option>
            <option value="draft">Draft (tersembunyi)</option>
          </select>
        </div>
      </FormSection>

      {/* ── Section: Features ───────────────────────────────── */}
      <FormSection title="Fitur Utama">
        <DynamicList
          items={features}
          onChange={setFeatures}
          placeholder="Kalender konten bulanan"
          addLabel="Tambah fitur"
        />
      </FormSection>

      {/* ── Section: What's Included ────────────────────────── */}
      <FormSection title="Yang Kamu Dapat (What's Included)">
        <DynamicList
          items={whatsIncluded}
          onChange={setWhatsIncluded}
          placeholder="1 file Google Sheets siap pakai"
          addLabel="Tambah item"
        />
      </FormSection>

      {/* ── Section: Gambar ─────────────────────────────────── */}
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
                  className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
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
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition hover:border-gray-400 hover:text-gray-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah URL
            </button>
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-blue-300 px-3 py-2 text-sm text-blue-600 transition hover:border-blue-400 hover:bg-blue-50">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {uploading ? "Mengupload..." : "Upload Gambar"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-xs text-gray-400">
            Gambar diupload ke Supabase Storage. Pastikan slug sudah diisi sebelum upload.
          </p>
        </div>
      </FormSection>

      {/* ── Submit ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Menyimpan..." : product ? "Simpan Perubahan" : "Buat Produk"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
        >
          Batal
        </button>
      </div>
    </form>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-gray-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
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
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder={placeholder}
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition hover:border-gray-400 hover:text-gray-700"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
