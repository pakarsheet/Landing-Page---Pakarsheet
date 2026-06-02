import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";
import { ToolsHero } from "@/components/ToolsHero";
import { ToolsGrid } from "@/components/ToolsGrid";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: `Tools Kalkulator Bisnis Gratis — ${site.name}`,
  description:
    "Kalkulator bisnis gratis online: margin keuntungan, HPP, harga jual marketplace, ROAS iklan, diskon bertingkat, dan profit marketplace. Tanpa login, hasil instan.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: `Tools Kalkulator Bisnis Gratis — ${site.name}`,
    description:
      "Kalkulator bisnis gratis online: margin keuntungan, HPP, harga jual marketplace, ROAS iklan, diskon bertingkat, dan profit marketplace.",
    type: "website",
  },
};

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Tools Kalkulator Bisnis Gratis — ${site.name}`,
    description: "Kalkulator bisnis gratis online: margin keuntungan, HPP, harga jual marketplace, ROAS iklan, diskon bertingkat, dan profit marketplace.",
    url: `${site.url}/tools`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((t, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${site.url}/tools/${t.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BgTransition />
      <Navbar />
      <main id="main-content">
        <ToolsHero />
        <ToolsGrid />
      </main>
      <Footer />
    </>
  );
}
