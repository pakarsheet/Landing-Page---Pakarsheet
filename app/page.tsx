import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { Problems } from "@/components/Problems";
import { Stats } from "@/components/Stats";
import { Templates } from "@/components/Templates";
import { Testimonials } from "@/components/Testimonials";
import { BgTransition } from "@/components/BgTransition";
import { FloatingWAButton } from "@/components/FloatingWAButton";
import { getSiteSettings, buildWaUrl } from "@/lib/sanity/settings";

export default async function Home() {
  const settings = await getSiteSettings();
  const waUrl = buildWaUrl(settings);

  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content">
        <Hero contactUrl={waUrl} />
        <Stats />
        <Problems />
        <Features />
        <Templates />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA contactUrl={waUrl} />
      </main>
      <Footer />
      <FloatingWAButton href={waUrl} />
    </>
  );
}
