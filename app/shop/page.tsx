import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopHero } from "@/components/ShopHero";
import { TemplateGrid } from "@/components/TemplateGrid";
import { BgTransition } from "@/components/BgTransition";
import { site } from "@/lib/site";
import { client } from "@/lib/sanity/client";
import { allShopTemplatesQuery, type SanityShopTemplate } from "@/lib/sanity/queries";
import { adaptSanityTemplate } from "@/lib/sanity/adapter";

export const revalidate = 60; // ISR: revalidate setiap 60 detik

export const metadata: Metadata = {
  title: `Toko Template — ${site.name}`,
  description:
    "Semua template Google Sheets premium Pakarsheet. Pilih template yang paling dekat dengan alur kerja bisnis kamu.",
  openGraph: {
    title: `Toko Template — ${site.name}`,
    description:
      "Semua template Google Sheets premium Pakarsheet. Pilih template yang paling dekat dengan alur kerja bisnis kamu.",
    type: "website",
  },
};

export default async function ShopPage() {
  const sanityTemplates = await client.fetch<SanityShopTemplate[]>(allShopTemplatesQuery);
  const templates = sanityTemplates.map(adaptSanityTemplate);

  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content">
        <ShopHero />
        <TemplateGrid templates={templates} />
      </main>
      <Footer />
    </>
  );
}
