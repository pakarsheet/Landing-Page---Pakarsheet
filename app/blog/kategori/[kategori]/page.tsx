import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";
import { site } from "@/lib/site";
import { getPostsByCategory, getAllPostCategories } from "@/lib/supabase/queries";
import type { Post } from "@/lib/supabase/types";

export const revalidate = 60;

type Props = { params: Promise<{ kategori: string }> };

// Decode URL slug back to category name
function slugToCategory(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

export async function generateStaticParams() {
  const categories = await getAllPostCategories();
  return categories.map((cat) => ({
    kategori: cat.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params;
  const category = slugToCategory(kategori);
  return {
    title: `${category} — Blog | ${site.name}`,
    description: `Artikel seputar ${category} untuk UMKM dan bisnis Indonesia.`,
    alternates: { canonical: `/blog/kategori/${kategori}` },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "tips bisnis":        "bg-sheet text-ink",
  "keuangan bisnis":    "bg-sky text-cobalt",
  "jualan online":      "bg-lilac text-ink",
  "marketing":          "bg-leaf text-cobalt",
  "google sheets tips": "bg-sky text-cobalt",
  "manajemen bisnis":   "bg-lilac text-ink",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat.toLowerCase()] ?? "bg-sky text-cobalt";
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      {post.cover_image && (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className={`self-start rounded-full px-3 py-1 font-secondary text-xs font-bold ${categoryColor(post.category)}`}>
          {post.category}
        </span>
        <h2 className="mt-3 flex-1 text-balance font-primary text-[17px] font-semibold leading-[1.25] tracking-[-0.3px] text-ink transition group-hover:text-cobalt">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 font-secondary text-sm leading-[1.56] text-muted">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between font-secondary text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.read_time} menit · {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1 font-semibold text-cobalt transition group-hover:gap-2">
            Baca <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function KategoriPage({ params }: Props) {
  const { kategori } = await params;
  const category = slugToCategory(kategori);

  // Capitalize properly for DB query
  const categoryFormatted = category
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const posts = await getPostsByCategory(categoryFormatted);

  if (posts.length === 0) notFound();

  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content" className="bg-white">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="mx-auto max-w-[1068px] px-5 pb-0 pt-8 lg:px-10 lg:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-secondary text-sm text-muted">
            <Link href="/" className="transition hover:text-cobalt">Beranda</Link>
            <span>/</span>
            <Link href="/blog" className="transition hover:text-cobalt">Blog</Link>
            <span>/</span>
            <span className="text-ink">{categoryFormatted}</span>
          </nav>
        </div>

        <div className="mx-auto max-w-[1068px] px-5 py-8 lg:px-10">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 font-secondary text-sm font-semibold text-muted transition hover:text-cobalt"
          >
            <ArrowLeft className="h-4 w-4" />
            Semua artikel
          </Link>
          <h1 className="font-primary text-[32px] font-semibold leading-[1.15] tracking-[-0.8px] text-ink sm:text-[40px] sm:tracking-[-1.5px]">
            {categoryFormatted}
          </h1>
          <p className="mt-2 font-secondary text-base text-muted">
            {posts.length} artikel
          </p>
        </div>

        {/* ── Posts grid ───────────────────────────────────────── */}
        <section className="bg-white px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-[1068px]">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
