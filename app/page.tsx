import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { WhyNot } from "@/components/WhyNot";
import { Problems } from "@/components/Problems";
import { SocialProof } from "@/components/SocialProof";
import { Stats } from "@/components/Stats";
import { Templates } from "@/components/Templates";
import { Testimonials } from "@/components/Testimonials";
import { BgTransition } from "@/components/BgTransition";
import { FloatingWAButton } from "@/components/FloatingWAButton";
import { ToolsTeaser } from "@/components/ToolsTeaser";
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
