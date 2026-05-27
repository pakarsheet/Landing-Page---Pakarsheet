import { PostForm } from "@/components/admin/PostForm";

export const metadata = { title: "Tulis Artikel — Admin Pakarsheet" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tulis Artikel Baru</h1>
        <p className="mt-1 text-sm text-gray-500">Isi semua field lalu simpan.</p>
      </div>
      <PostForm />
    </div>
  );
}
