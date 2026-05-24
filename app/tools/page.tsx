import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";
import { ToolsHero } from "@/components/ToolsHero";
import { ToolsGrid } from "@/components/ToolsGrid";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Tools Kalkulator Bisnis Gratis — ${site.name}`,
  description:
    "Kalkulator bisnis gratis online: margin keuntungan, HPP, harga jual marketplace, ROAS iklan, diskon bertingkat, dan profit marketplace. Tanpa login, hasil instan.",
  openGraph: {
    title: `Tools Kalkulator Bisnis Gratis — ${site.name}`,
    description:
      "Kalkulator bisnis gratis online: margin keuntungan, HPP, harga jual marketplace, ROAS iklan, diskon bertingkat, dan profit marketplace.",
    type: "website",
  },
};

export default function ToolsPage() {
  return (
    <>
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
