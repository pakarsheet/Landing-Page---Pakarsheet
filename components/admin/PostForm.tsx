"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost } from "@/app/admin/actions";
import type { Post } from "@/lib/supabase/types";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { tools, worksheets } from "@/lib/tools";

const CATEGORIES = [
  "Tips Bisnis",
  "Keuangan Bisnis",
  "Jualan Online",
  "Marketing",
  "Google Sheets Tips",
  "Manajemen Bisnis",
];

const ALL_TOOLS = [...tools, ...worksheets];

interface Props {
  post?: Post;
}

export function PostForm({ post }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slug, setSlug] = useState(post?.slug ?? "");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!post) {
      const generated = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  }

  function handleDelete() {
    if (!post) return;
    startDeleteTransition(async () => {
      const result = await deletePost(post.id);
      if (result?.error) {
        setError("Gagal menghapus artikel: " + result.error);
        setShowDeleteConfirm(false);
      } else {
        router.push("/admin/blog");
      }
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("slug", slug);

    startTransition(async () => {
      const result = post
        ? await updatePost(post.id, formData)
        : await createPost(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/blog");
      }
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

      {/* ── Info Dasar ─────────────────────────────────────── */}
      <FormSection title="Info Dasar">
        <div>
          <label className={labelCls}>Judul Artikel *</label>
          <input
            name="title"
            required
            defaultValue={post?.title}
            onChange={handleTitleChange}
            className={inputCls}
            placeholder="Cara Hitung HPP Produk Makanan dari Nol"
          />
        </div>

        <div>
          <label className={labelCls}>Slug *</label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputCls}
            placeholder="cara-hitung-hpp-produk-makanan"
          />
          <p className="mt-1 text-xs text-gray-400">URL: /blog/{slug || "..."}</p>
        </div>

        <div>
          <label className={labelCls}>Excerpt (ringkasan) *</label>
          <textarea
            name="excerpt"
            required
            rows={3}
            defaultValue={post?.excerpt}
            className={inputCls}
            placeholder="Ringkasan singkat artikel yang muncul di card dan meta description."
          />
          <p className="mt-1 text-xs text-gray-400">Ideal 120–160 karakter untuk SEO.</p>
        </div>
      </FormSection>

      {/* ── Konten ─────────────────────────────────────────── */}
      <FormSection title="Konten Artikel">
        <div>
          <label className={labelCls}>Konten (HTML) *</label>
          <textarea
            name="content"
            required
            rows={20}
            defaultValue={post?.content}
            className={`${inputCls} font-mono text-xs`}
            placeholder="<h2>Judul Section</h2><p>Isi artikel...</p>"
          />
          <p className="mt-1 text-xs text-gray-400">
            Tulis dalam HTML. Gunakan tag: h2, h3, p, ul, ol, li, strong, a, blockquote.
          </p>
        </div>
      </FormSection>

      {/* ── Kategori & Meta ────────────────────────────────── */}
      <FormSection title="Kategori & Meta">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Kategori *</label>
            <select name="category" defaultValue={post?.category ?? "Tips Bisnis"} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Estimasi Baca (menit)</label>
            <input
              name="read_time"
              type="number"
              min={1}
              max={60}
              defaultValue={post?.read_time ?? 5}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Tags (pisahkan dengan koma)</label>
          <input
            name="tags"
            defaultValue={post?.tags?.join(", ") ?? ""}
            className={inputCls}
            placeholder="HPP, bisnis kuliner, harga jual, UMKM"
          />
        </div>

        <div>
          <label className={labelCls}>URL Gambar Cover (opsional)</label>
          <input
            name="cover_image"
            type="url"
            defaultValue={post?.cover_image ?? ""}
            className={inputCls}
            placeholder="https://..."
          />
        </div>
      </FormSection>

      {/* ── Penulis ────────────────────────────────────────── */}
      <FormSection title="Penulis">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Nama Penulis</label>
            <input
              name="author_name"
              defaultValue={post?.author_name ?? "Tim Pakarsheet"}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>URL Avatar Penulis (opsional)</label>
            <input
              name="author_avatar"
              type="url"
              defaultValue={post?.author_avatar ?? ""}
              className={inputCls}
              placeholder="https://..."
            />
          </div>
        </div>
      </FormSection>

      {/* ── Internal Links ─────────────────────────────────── */}
      <FormSection title="Internal Links (SEO)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Link ke Tool (opsional)</label>
            <select
              name="related_tool_slug"
              defaultValue={post?.related_tool_slug ?? ""}
              className={inputCls}
            >
              <option value="">— Tidak ada —</option>
              {ALL_TOOLS.map((t) => (
                <option key={t.slug} value={t.slug}>{t.shortTitle}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">Akan tampil sebagai CTA di akhir artikel.</p>
          </div>
          <div>
            <label className={labelCls}>Link ke Produk Shop (opsional)</label>
            <input
              name="related_shop_slug"
              defaultValue={post?.related_shop_slug ?? ""}
              className={inputCls}
              placeholder="content-planner-instagram-pro"
            />
            <p className="mt-1 text-xs text-gray-400">Slug produk dari halaman /shop.</p>
          </div>
        </div>
      </FormSection>

      {/* ── Publikasi ──────────────────────────────────────── */}
      <FormSection title="Publikasi">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Status</label>
            <select name="status" defaultValue={post?.status ?? "draft"} className={inputCls}>
              <option value="published">Tayang (publik)</option>
              <option value="draft">Draft (tersembunyi)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Tanggal Publikasi</label>
            <input
              name="published_at"
              type="datetime-local"
              defaultValue={
                post?.published_at
                  ? new Date(post.published_at).toISOString().slice(0, 16)
                  : new Date().toISOString().slice(0, 16)
              }
              className={inputCls}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={post?.featured ?? false}
            className="h-4 w-4 rounded border-gray-300 accent-gray-900"
          />
          <span className="text-sm font-medium text-gray-700">
            Tandai sebagai Pilihan Editor (tampil lebih besar di blog)
          </span>
        </label>
      </FormSection>

      {/* ── Submit ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={isPending || isDeleting}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cobalt disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Menyimpan..." : post ? "Simpan Perubahan" : "Buat Artikel"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          disabled={isPending || isDeleting}
          className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-ink disabled:opacity-60"
        >
          Batal
        </button>

        {post && (
          <div className="ml-auto">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isPending || isDeleting}
                className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Artikel
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                <span className="text-sm font-medium text-red-700">Yakin hapus artikel ini?</span>
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

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-gray-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
