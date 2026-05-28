import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Edit Artikel — Admin Pakarsheet" };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted">
          <Link href="/admin/blog" className="hover:text-cobalt">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{post.title}</span>
        </div>
        <h1 className="text-2xl font-semibold text-ink">Edit Artikel</h1>
        <p className="mt-1 text-sm text-muted">{post.title}</p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
