import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag } from "lucide-react";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";
import { site } from "@/lib/site";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  getPostBySlug,
  getAllPostSlugs,
  getRelatedPosts,
} from "@/lib/supabase/queries";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = `${post.title} — ${site.name}`;
  return {
    title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: [post.author_name],
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

function buildJsonLd(post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: post.cover_image ?? undefined,
        datePublished: post.published_at ?? post.created_at,
        dateModified: post.updated_at,
        author: {
          "@type": "Organization",
          name: post.author_name,
        },
        publisher: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
        },
        url: `${site.url}/blog/${post.slug}`,
        keywords: post.tags.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${post.slug}` },
        ],
      },
    ],
  };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  "Tips Bisnis":        "bg-sheet text-ink",
  "Keuangan Bisnis":    "bg-sky text-cobalt",
  "Jualan Online":      "bg-lilac text-ink",
  "Marketing":          "bg-leaf text-cobalt",
  "Google Sheets Tips": "bg-sky text-cobalt",
  "Manajemen Bisnis":   "bg-lilac text-ink",
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "bg-sky text-cobalt";
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, post.category, 3);
  const jsonLd = buildJsonLd(post);
  const safeContent = sanitizeHtml(post.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BgTransition />
      <main id="main-content" className="bg-white">

        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <div className="mx-auto max-w-[760px] px-5 pb-0 pt-8 lg:px-6 lg:pt-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-secondary text-sm text-muted">
            <Link href="/" className="transition hover:text-cobalt">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="transition hover:text-cobalt">Blog</Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/blog/kategori/${encodeURIComponent(post.category.toLowerCase().replace(/\s+/g, "-"))}`}
              className="transition hover:text-cobalt"
            >
              {post.category}
            </Link>
          </nav>
        </div>

        {/* ── Article header ─────────────────────────────────── */}
        <article className="mx-auto max-w-[760px] px-5 py-8 lg:px-6">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 font-secondary text-sm font-semibold text-muted transition hover:text-cobalt"
          >
            <ArrowLeft className="h-4 w-4" />
            Semua artikel
          </Link>

          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 font-secondary text-xs font-bold ${categoryColor(post.category)}`}>
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 font-secondary text-sm text-muted">
              <Clock className="h-3.5 w-3.5" />
              {post.read_time} menit baca
            </span>
            <span className="flex items-center gap-1.5 font-secondary text-sm text-muted">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.published_at)}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-5 text-balance font-primary text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[40px] sm:tracking-[-1.5px]">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-4 font-secondary text-[18px] leading-[1.56] text-muted">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="mt-6 flex items-center gap-3 border-b border-line pb-6">
            {post.author_avatar ? (
              <Image
                src={post.author_avatar}
                alt={post.author_name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky font-secondary text-sm font-bold text-cobalt">
                {post.author_name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-secondary text-sm font-semibold text-ink">{post.author_name}</p>
              <p className="font-secondary text-xs text-muted">Pakarsheet</p>
            </div>
          </div>

          {/* Cover image */}
          {post.cover_image && (
            <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* ── Article body ─────────────────────────────────── */}
          <div
            className="prose-blog mt-8"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
              <Tag className="h-4 w-4 text-muted" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-white px-3 py-1 font-secondary text-xs font-semibold text-muted shadow-card"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* ── Related tool CTA ───────────────────────────────── */}
        {post.related_tool_slug && (
          <div className="mx-auto max-w-[760px] px-5 pb-8 lg:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-8 sm:px-10">
              <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sheet/20 blur-3xl" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-cobalt/20 blur-3xl" />
              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-secondary text-xs font-bold uppercase tracking-[0.1em] text-sheet">
                    Kalkulator gratis
                  </p>
                  <p className="mt-1 font-primary text-xl font-semibold leading-[1.2] tracking-[-0.4px] text-white">
                    Coba langsung di kalkulator kami
                  </p>
                  <p className="mt-1 font-secondary text-sm leading-[1.56] text-white/60">
                    Hitung angka bisnis kamu secara instan — tanpa login, 100% gratis.
                  </p>
                </div>
                <Link
                  href={`/tools/${post.related_tool_slug}`}
                  className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-sheet px-6 font-secondary text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Buka kalkulator
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Related shop CTA ───────────────────────────────── */}
        {post.related_shop_slug && (
          <div className="mx-auto max-w-[760px] px-5 pb-8 lg:px-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-sky/30 px-6 py-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-primary text-lg font-semibold leading-[1.25] tracking-[-0.4px] text-ink">
                  Mau yang lebih otomatis?
                </p>
                <p className="mt-1 font-secondary text-sm text-muted">
                  Template Google Sheets premium — tinggal isi data, laporan langsung jadi.
                </p>
              </div>
              <Link
                href={`/shop/${post.related_shop_slug}`}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 font-secondary text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cobalt"
              >
                Lihat template
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ── Related posts ──────────────────────────────────── */}
        {related.length > 0 && (
          <section className="bg-white px-5 pb-20 lg:px-10">
            <div className="mx-auto max-w-[1068px]">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
                  Artikel terkait
                </p>
                <Link href="/blog" className="font-secondary text-sm font-semibold text-cobalt transition hover:underline">
                  Lihat semua →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                  >
                    <span className={`rounded-full px-2.5 py-0.5 font-secondary text-[10px] font-bold ${categoryColor(p.category)}`}>
                      {p.category}
                    </span>
                    <p className="mt-3 font-secondary text-sm font-semibold text-ink group-hover:text-cobalt line-clamp-2">
                      {p.title}
                    </p>
                    <div className="mt-2 flex items-center gap-1 font-secondary text-xs text-muted">
                      <Clock className="h-3 w-3" />
                      {p.read_time} menit
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
