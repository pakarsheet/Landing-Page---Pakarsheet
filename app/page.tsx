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

export default function Home() {
  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Stats />
        <Problems />
        <Features />
        <Templates />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
