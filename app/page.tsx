import dynamic from "next/dynamic";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Problems } from "@/components/Problems";
import { SocialProof } from "@/components/SocialProof";
import { Stats } from "@/components/Stats";
import { BeforeAfter } from "@/components/BeforeAfter";
import { BgTransition } from "@/components/BgTransition";
import { FloatingWAButton } from "@/components/FloatingWAButton";

const CTA = dynamic(() => import("@/components/CTA").then(m => ({ default: m.CTA })));
const FAQ = dynamic(() => import("@/components/FAQ").then(m => ({ default: m.FAQ })));
const HowItWorks = dynamic(() => import("@/components/HowItWorks").then(m => ({ default: m.HowItWorks })));
const Pricing = dynamic(() => import("@/components/Pricing").then(m => ({ default: m.Pricing })));
const WhyNot = dynamic(() => import("@/components/WhyNot").then(m => ({ default: m.WhyNot })));
const Templates = dynamic(() => import("@/components/Templates").then(m => ({ default: m.Templates })));
const Testimonials = dynamic(() => import("@/components/Testimonials").then(m => ({ default: m.Testimonials })));
const ToolsTeaser = dynamic(() => import("@/components/ToolsTeaser").then(m => ({ default: m.ToolsTeaser })));
import { GlobalAnnouncement } from "@/components/GlobalAnnouncement";
import { getSiteSettings, buildWaUrl } from "@/lib/supabase/queries";
import { site } from "@/lib/site";

export const revalidate = 60;

export default async function Home() {
  const settings = await getSiteSettings();
  const waUrl = buildWaUrl(settings) || site.contactUrl;

  return (
    <>
      <BgTransition />
      <GlobalAnnouncement />
      <Navbar />
      <main id="main-content">
        <Hero contactUrl={waUrl} />
        <SocialProof />
        <Stats />
        <Problems />
        <BeforeAfter />
        <Features />
        <Templates />
        <HowItWorks />
        <ToolsTeaser />
        <Pricing />
        <WhyNot />
        <Testimonials />
        <FAQ />
        <CTA contactUrl={waUrl} />
      </main>
      <Footer />
      <FloatingWAButton href={waUrl} />
    </>
  );
}
