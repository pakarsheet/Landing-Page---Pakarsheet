import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import Link from "next/link";
import { ArrowLeft, Edit2 } from "lucide-react";

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
        <Link
          href="/admin/blog"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Blog
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blush">
            <Edit2 className="h-4 w-4 text-cobalt" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Edit Artikel</h1>
            <p className="text-sm text-ink/50 truncate max-w-md">{post.title}</p>
          </div>
        </div>
      </div>
      <PostForm post={post} />
    </div>
  );
}
