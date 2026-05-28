import { PostForm } from "@/components/admin/PostForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = { title: "Tulis Artikel — Admin Pakarsheet" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted">
          <Link href="/admin/blog" className="hover:text-cobalt">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Baru</span>
        </div>
        <h1 className="text-2xl font-semibold text-ink">Tulis Artikel Baru</h1>
        <p className="mt-1 text-sm text-muted">Isi semua field lalu simpan.</p>
      </div>
      <PostForm />
    </div>
  );
}
