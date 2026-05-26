import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";

export default function NotFound() {
  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content" className="bg-white">
        <section className="bg-white px-3 pb-0 pt-3 sm:px-5 sm:pt-5 lg:px-10">
          <div className="relative mx-auto flex min-h-[520px] max-w-[1380px] flex-col items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 py-24 text-center sm:rounded-[32px] sm:py-32">
            {/* Decorative icon */}
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card">
              <Search className="h-8 w-8 text-cobalt" />
            </span>

            {/* 404 label */}
            <p className="mt-6 font-secondary text-xs font-bold uppercase tracking-[0.12em] text-cobalt">
              Error 404
            </p>

            {/* Heading */}
            <h1 className="mt-3 text-balance font-primary text-[36px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[52px] sm:tracking-[-2px]">
              Halaman tidak ditemukan.
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-md font-secondary text-[18px] leading-[1.56] text-muted">
              Halaman yang kamu cari mungkin sudah dipindah, dihapus, atau URL-nya salah ketik.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-secondary text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt"
              >
                <ArrowLeft className="h-4 w-4 transition duration-300 group-hover:-translate-x-1" />
                Kembali ke Beranda
              </Link>
              <Link
                href="/tools"
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-6 font-secondary text-sm font-semibold text-ink shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-ink"
              >
                Coba Tools Gratis
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick links */}
        <section className="bg-white px-5 py-12 lg:px-10">
          <div className="mx-auto max-w-[1068px]">
            <p className="mb-6 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
              Mungkin kamu mencari ini
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Toko Template",       href: "/shop",  desc: "Template Google Sheets premium siap pakai." },
                { label: "Tools Kalkulator",    href: "/tools", desc: "Kalkulator bisnis gratis, tanpa login." },
                { label: "Konsultasi via WA",   href: "https://wa.me/6285XXXXXXXXX", desc: "Tanya langsung ke tim Pakarsheet." },
              ].map(({ label, href, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-3xl border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <p className="font-secondary text-sm font-semibold text-ink group-hover:text-cobalt">
                    {label}
                  </p>
                  <p className="mt-1 font-secondary text-xs leading-[1.5] text-muted">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
