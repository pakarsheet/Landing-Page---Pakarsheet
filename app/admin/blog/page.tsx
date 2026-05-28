import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-muted">
            {posts?.length ?? 0} artikel terdaftar
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cobalt"
        >
          <PlusCircle className="h-4 w-4" />
          Tulis Artikel
        </Link>
      </div>

      <PostsTable posts={posts ?? []} />
    </div>
  );
}
