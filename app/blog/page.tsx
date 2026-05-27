import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";
import { SheetGrid } from "@/components/SheetGrid";
import { site } from "@/lib/site";
import { getPublishedPosts, getFeaturedPost } from "@/lib/supabase/queries";
import type { Post } from "@/lib/supabase/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Blog — Tips Bisnis & Google Sheets | ${site.name}`,
  description:
    "Artikel praktis seputar keuangan bisnis, jualan online, marketing digital, dan tips Google Sheets untuk UMKM Indonesia.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog — Tips Bisnis & Google Sheets | ${site.name}`,
    description:
      "Artikel praktis seputar keuangan bisnis, jualan online, marketing digital, dan tips Google Sheets untuk UMKM Indonesia.",
    type: "website",
  },
};

const HERO_CELLS = [
  { col: 1, row: 1, delay: "0s" },
  { col: 5, row: 2, delay: "0.8s" },
  { col: 8, row: 1, delay: "1.6s" },
  { col: 2, row: 4, delay: "2.0s" },
  { col: 7, row: 5, delay: "1.1s" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Tips Bisnis":       "bg-sheet text-ink",
  "Keuangan Bisnis":   "bg-sky text-cobalt",
  "Jualan Online":     "bg-lilac text-ink",
  "Marketing":         "bg-leaf text-cobalt",
  "Google Sheets Tips":"bg-sky text-cobalt",
  "Manajemen Bisnis":  "bg-lilac text-ink",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "bg-sky text-cobalt";
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft lg:col-span-2"
    >
      {post.cover_image && (
        <div className="relative h-56 w-full overflow-hidden sm:h-72 lg:h-80">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        </div>
      )}
      <div className={`p-6 lg:p-8 ${!post.cover_image ? "pt-8" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 font-secondary text-xs font-bold ${categoryColor(post.category)}`}>
            {post.category}
          </span>
          <span className="rounded-full bg-sheet/30 px-3 py-1 font-secondary text-xs font-bold text-ink">
            Pilihan Editor
          </span>
        </div>
        <h2 className="mt-3 text-balance font-primary text-[22px] font-semibold leading-[1.2] tracking-[-0.4px] text-ink transition group-hover:text-cobalt sm:text-[28px] sm:tracking-[-0.8px]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 font-secondary text-base leading-[1.56] text-muted">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-4 font-secondary text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.read_time} menit baca
          </span>
          <span>{formatDate(post.published_at)}</span>
        </div>
      </div>
    </Link>
  );
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
        <h3 className="mt-3 flex-1 text-balance font-primary text-[17px] font-semibold leading-[1.25] tracking-[-0.3px] text-ink transition group-hover:text-cobalt">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 font-secondary text-sm leading-[1.56] text-muted">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between font-secondary text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.read_time} menit
          </span>
          <span className="flex items-center gap-1 font-semibold text-cobalt transition group-hover:gap-2">
            Baca <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const [featured, allPosts] = await Promise.all([
    getFeaturedPost(),
    getPublishedPosts(),
  ]);

  const nonFeatured = allPosts.filter((p) => !p.featured);

  // Collect unique categories
  const categories = ["Semua", ...new Set(allPosts.map((p) => p.category))];

  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-white px-3 pb-16 pt-3 sm:px-5 sm:pt-5 lg:px-10">
          <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 pb-14 pt-28 sm:rounded-[32px] sm:px-8 sm:pt-36 lg:px-12 lg:pb-20 lg:pt-40">
            <SheetGrid cells={HERO_CELLS} />
            <div className="relative z-10 mx-auto max-w-[720px] text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-secondary text-sm font-bold text-muted shadow-card">
                <BookOpen className="h-4 w-4" />
                Blog Pakarsheet
              </p>
              <h1 className="mt-5 text-balance font-primary text-[36px] font-semibold leading-[1.1] tracking-[-1px] text-ink sm:text-[48px] sm:tracking-[-2px] lg:text-[56px] lg:tracking-[-2.5px]">
                Tips bisnis yang langsung bisa dipraktikkan.
              </h1>
              <p className="mt-5 font-secondary text-[18px] leading-[1.56] text-muted">
                Artikel seputar keuangan bisnis, jualan online, marketing digital, dan cara kerja lebih rapi dengan Google Sheets.
              </p>
            </div>
          </div>
        </section>

        {/* ── Category pills ───────────────────────────────────── */}
        {categories.length > 1 && (
          <section className="bg-white px-5 pb-4 lg:px-10">
            <div className="mx-auto max-w-[1068px]">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={cat === "Semua" ? "/blog" : `/blog/kategori/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`}
                    className="rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold text-muted shadow-card transition hover:border-cobalt hover:text-cobalt"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Posts grid ───────────────────────────────────────── */}
        <section className="bg-white px-5 py-10 lg:px-10 lg:py-14">
          <div className="mx-auto max-w-[1068px]">
            {allPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line py-20 text-center">
                <p className="font-secondary text-muted">Belum ada artikel yang dipublikasikan.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured && <FeaturedCard post={featured} />}
                {nonFeatured.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Tools CTA ────────────────────────────────────────── */}
        <section className="bg-white px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-[1068px]">
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-sky/30 px-6 py-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-primary text-xl font-semibold leading-[1.25] tracking-[-0.5px] text-ink">
                  Butuh kalkulator bisnis gratis?
                </p>
                <p className="mt-1 font-secondary text-sm text-muted">
                  Hitung margin, HPP, ROAS, cashflow, dan lebih banyak lagi — tanpa login.
                </p>
              </div>
              <Link
                href="/tools"
                className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink px-6 font-secondary text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cobalt"
              >
                Lihat semua tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
