"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost } from "@/app/admin/actions";
import type { Post } from "@/lib/supabase/types";
import {
  Loader2,
  Trash2,
  AlertTriangle,
  Save,
  ArrowLeft,
  Info,
  FileText,
  Tag,
  User,
  Link2,
  Globe,
} from "lucide-react";
import { tools, worksheets } from "@/lib/tools";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { toast } from "@/components/admin/Toast";
import { CustomSelect } from "@/components/admin/CustomSelect";

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
        toast.success("Artikel berhasil dihapus.");
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
        toast.success(
          post ? "Artikel berhasil diperbarui." : "Artikel baru berhasil dibuat."
        );
        router.push("/admin/blog");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Info Dasar ─────────────────────────────────────── */}
      <FormSection
        icon={<Info className="h-4 w-4 text-cobalt" />}
        iconBg="bg-blush"
        title="Info Dasar"
        desc="Judul, slug, dan ringkasan artikel."
      >
        <Field label="Judul Artikel *">
          <input
            name="title"
            required
            defaultValue={post?.title}
            onChange={handleTitleChange}
            className={inputCls}
            placeholder="Cara Hitung HPP Produk Makanan dari Nol"
          />
        </Field>

        <Field label="Slug *" hint={`URL: /blog/${slug || "…"}`}>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputCls}
            placeholder="cara-hitung-hpp-produk-makanan"
          />
        </Field>

        <Field
          label="Excerpt (ringkasan) *"
          hint="Ideal 120–160 karakter untuk SEO."
        >
          <textarea
            name="excerpt"
            required
            rows={3}
            defaultValue={post?.excerpt}
            className={textareaCls}
            placeholder="Ringkasan singkat artikel yang muncul di card dan meta description."
          />
        </Field>
      </FormSection>

      {/* ── Konten ─────────────────────────────────────────── */}
      <FormSection
        icon={<FileText className="h-4 w-4 text-cobalt" />}
        iconBg="bg-blush"
        title="Konten Artikel"
        desc="Gunakan toolbar atau ketik HTML langsung."
      >
        <Field
          label="Konten (HTML) *"
          hint="Klik Preview untuk melihat hasil render."
        >
          <RichTextEditor name="content" defaultValue={post?.content} required />
        </Field>
      </FormSection>

      {/* ── Kategori & Meta ────────────────────────────────── */}
      <FormSection
        icon={<Tag className="h-4 w-4 text-cobalt" />}
        iconBg="bg-blush"
        title="Kategori & Meta"
        desc="Kategori, tags, estimasi baca, dan gambar cover."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kategori *">
            <CustomSelect
              name="category"
              defaultValue={post?.category ?? "Tips Bisnis"}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </Field>
          <Field label="Estimasi Baca (menit)">
            <input
              name="read_time"
              type="number"
              min={1}
              max={60}
              defaultValue={post?.read_time ?? 5}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Tags (pisahkan dengan koma)">
          <input
            name="tags"
            defaultValue={post?.tags?.join(", ") ?? ""}
            className={inputCls}
            placeholder="HPP, bisnis kuliner, harga jual, UMKM"
          />
        </Field>

        <Field label="URL Gambar Cover (opsional)">
          <input
            name="cover_image"
            type="url"
            defaultValue={post?.cover_image ?? ""}
            className={inputCls}
            placeholder="https://..."
          />
        </Field>
      </FormSection>

      {/* ── Penulis ────────────────────────────────────────── */}
      <FormSection
        icon={<User className="h-4 w-4 text-cobalt" />}
        iconBg="bg-blush"
        title="Penulis"
        desc="Nama dan avatar penulis artikel."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Penulis">
            <input
              name="author_name"
              defaultValue={post?.author_name ?? "Tim Pakarsheet"}
              className={inputCls}
            />
          </Field>
          <Field label="URL Avatar Penulis (opsional)">
            <input
              name="author_avatar"
              type="url"
              defaultValue={post?.author_avatar ?? ""}
              className={inputCls}
              placeholder="https://..."
            />
          </Field>
        </div>
      </FormSection>

      {/* ── Internal Links ─────────────────────────────────── */}
      <FormSection
        icon={<Link2 className="h-4 w-4 text-cobalt" />}
        iconBg="bg-blush"
        title="Internal Links (SEO)"
        desc="Link ke tool atau produk yang relevan dengan artikel ini."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Link ke Tool (opsional)"
            hint="Akan tampil sebagai CTA di akhir artikel."
          >
            <CustomSelect
              name="related_tool_slug"
              defaultValue={post?.related_tool_slug ?? ""}
              options={[
                { value: "", label: "— Tidak ada —" },
                ...ALL_TOOLS.map((t) => ({ value: t.slug, label: t.shortTitle })),
              ]}
            />
          </Field>
          <Field
            label="Link ke Produk Shop (opsional)"
            hint="Slug produk dari halaman /shop."
          >
            <input
              name="related_shop_slug"
              defaultValue={post?.related_shop_slug ?? ""}
              className={inputCls}
              placeholder="content-planner-instagram-pro"
            />
          </Field>
        </div>
      </FormSection>

      {/* ── Publikasi ──────────────────────────────────────── */}
      <FormSection
        icon={<Globe className="h-4 w-4 text-cobalt" />}
        iconBg="bg-blush"
        title="Publikasi"
        desc="Status, tanggal tayang, dan pilihan editor."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <CustomSelect
              name="status"
              defaultValue={post?.status ?? "draft"}
              options={[
                { value: "published", label: "Tayang (publik)",    color: "bg-cobalt"  },
                { value: "draft",     label: "Draft (tersembunyi)", color: "bg-ink/20" },
              ]}
            />
          </Field>
          <Field label="Tanggal Publikasi">
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
          </Field>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={post?.featured ?? false}
            className="h-4 w-4 rounded border-ink/20 accent-cobalt"
          />
          <span className="text-sm font-medium text-ink">
            Tandai sebagai Pilihan Editor (tampil lebih besar di blog)
          </span>
        </label>
      </FormSection>

      {/* ── Submit ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
        <button
          type="submit"
          disabled={isPending || isDeleting}
          className="flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cobalt disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Menyimpan…" : post ? "Simpan Perubahan" : "Buat Artikel"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          disabled={isPending || isDeleting}
          className="flex items-center gap-2 rounded-xl border border-ink/12 px-5 py-2.5 text-sm font-semibold text-ink/60 transition hover:border-ink/25 hover:text-ink disabled:opacity-60"
        >
          <ArrowLeft className="h-4 w-4" />
          Batal
        </button>

        {post && (
          <div className="ml-auto">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isPending || isDeleting}
                className="flex items-center gap-2 rounded-xl border border-ink/12 px-4 py-2.5 text-sm font-semibold text-ink/45 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Artikel
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                <span className="text-sm font-medium text-red-700">
                  Yakin hapus artikel ini?
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isDeleting ? "Menghapus…" : "Ya, Hapus"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
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
  "h-11 w-full rounded-xl border border-ink/12 bg-white px-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12";

const textareaCls =
  "w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12";

// ── Sub-components ────────────────────────────────────────────────────────────

function FormSection({
  icon,
  iconBg,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-ink/6 bg-ink/1 px-5 py-4">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="text-xs text-ink/45">{desc}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink/40">{hint}</p>}
    </div>
  );
}
