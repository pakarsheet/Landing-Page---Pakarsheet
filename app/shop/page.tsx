import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopHero } from "@/components/ShopHero";
import { TemplateGrid } from "@/components/TemplateGrid";
import { BgTransition } from "@/components/BgTransition";
import { site } from "@/lib/site";

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

export default function ShopPage() {
  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content">
        <ShopHero />
        <TemplateGrid />
      </main>
      <Footer />
    </>
  );
}
