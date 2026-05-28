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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blush">
              <BookOpen className="h-4.5 w-4.5 text-cobalt" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Blog</h1>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-ink/50">
              {posts?.length ?? 0} total
            </span>
            <span className="h-1 w-1 rounded-full bg-ink/20" />
            <span className="text-sm text-ink/50">{publishedCount} tayang</span>
            <span className="h-1 w-1 rounded-full bg-ink/20" />
            <span className="text-sm text-ink/50">{draftCount} draft</span>
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cobalt"
        >
          <PlusCircle className="h-4 w-4" />
          Tulis Artikel
        </Link>
      </div>

      <PostsTable posts={posts ?? []} />
    </div>
  );
}
