import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";

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
        <h1 className="text-2xl font-semibold text-gray-900">Edit Artikel</h1>
        <p className="mt-1 text-sm text-gray-500">{post.title}</p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
