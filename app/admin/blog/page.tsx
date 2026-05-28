import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { PlusCircle, BookOpen } from "lucide-react";
import { PostsTable } from "@/components/admin/PostsTable";

export const metadata = { title: "Blog — Admin Pakarsheet" };

export default async function AdminBlogPage() {
  const supabase = createAdminClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        Gagal memuat artikel: {error.message}
      </div>
    );
  }

  const publishedCount = (posts ?? []).filter((p) => p.status === "published").length;
  const draftCount = (posts ?? []).filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-7">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Blog</h1>
          <div className="mt-1.5 flex items-center gap-2 text-base text-muted">
            <span>{posts?.length ?? 0} total</span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span className="font-semibold text-ink">{publishedCount} tayang</span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span>{draftCount} draft</span>
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ink/85"
        >
          <PlusCircle className="h-4 w-4" />
          Tulis Artikel
        </Link>
      </div>

      {/* Stats pills */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-5 py-3 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-cobalt" />
          <span className="text-base font-semibold text-ink">{publishedCount}</span>
          <span className="text-sm text-muted">Tayang</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-5 py-3 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="text-base font-semibold text-ink">{draftCount}</span>
          <span className="text-sm text-muted">Draft</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-5 py-3 shadow-sm">
          <BookOpen className="h-4 w-4 text-muted" />
          <span className="text-base font-semibold text-ink">{posts?.length ?? 0}</span>
          <span className="text-sm text-muted">Total</span>
        </div>
      </div>

      <PostsTable posts={posts ?? []} />
    </div>
  );
}
