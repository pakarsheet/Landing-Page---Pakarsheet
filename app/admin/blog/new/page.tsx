import { PostForm } from "@/components/admin/PostForm";
import Link from "next/link";
import { ArrowLeft, PenLine } from "lucide-react";

export const metadata = { title: "Tulis Artikel — Admin Pakarsheet" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Link
          href="/admin/blog"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Blog
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink">
            <PenLine className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Tulis Artikel Baru</h1>
            <p className="text-sm text-muted">Isi semua field yang diperlukan lalu simpan.</p>
          </div>
        </div>
      </div>
      <PostForm />
    </div>
  );
}
