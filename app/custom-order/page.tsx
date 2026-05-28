import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, MessageCircle,
  Zap, Users, Layers, Shield, Video,
  RefreshCw, Clock, Star,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";
import { SheetGrid } from "@/components/SheetGrid";
import { site } from "@/lib/site";
import { getSiteSettings } from "@/lib/supabase/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Custom Order — ${site.name}`,
  description:
    "Jasa custom Google Sheets untuk bisnis kamu — dari modifikasi template hingga sistem otomatisasi multi-divisi. Konsultasi gratis via WhatsApp.",
  alternates: { canonical: "/custom-order" },
  openGraph: {
    title: `Custom Order — ${site.name}`,
    description:
      "Jasa custom Google Sheets untuk bisnis kamu — dari modifikasi template hingga sistem otomatisasi multi-divisi. Konsultasi gratis via WhatsApp.",
    type: "website",
  },
};

const HERO_CELLS = [
  { col: 1, row: 1, delay: "0s" },
  { col: 5, row: 2, delay: "0.8s" },
  { col: 8, row: 1, delay: "1.6s" },
  { col: 2, row: 4, delay: "2.0s" },
  { col: 7, row: 5, delay: "1.1s" },
];

const packages = [
  {
    slug: "modifikasi",
    name: "Custom Modifikasi",
    tagline: "Ubah / Tambah dari Template Eksis",
    desc: "Sudah naksir template Pakarsheet tapi mau tambah 1–2 lembar kerja baru atau ubah sedikit alur rumusnya? Paket ini jawabannya.",
    price: "Rp249rb",
    originalPrice: "Rp349rb",
    note: "Sudah termasuk template dasarnya",
    icon: Layers,
    accent: "bg-sky text-cobalt",
    highlighted: false,
    points: [
      "Modifikasi template Pakarsheet yang sudah ada",
      "Tambah 1–2 lembar kerja baru sesuai kebutuhan",
      "Penyesuaian rumus dan alur data",
      "Dashboard ringkasan diperbarui",
      "Panduan penggunaan kustom (screencast 5–10 menit)",
      "Support WhatsApp 30 hari",
      "2x revisi",
    ],
  },
  {
    slug: "total",
    name: "Custom Total",
    tagline: "Bikin dari Nol / Dari Excel Berantakan",
    desc: "Punya file spreadsheet lama yang super berantakan? Kami rapikan total dan bangun ulang jadi sistem otomatis sesuai alur bisnis kamu.",
    price: "Rp499rb",
    originalPrice: "Rp749rb",
    note: "Paling banyak dipesan",
    icon: Zap,
    accent: "bg-sheet text-ink",
    highlighted: true,
    points: [
      "Desain sistem dari nol sesuai alur bisnis",
      "Struktur data, formula, dan dashboard otomatis",
      "Laporan visual (grafik/tren) langsung update",
      "Lisensi 1 bisnis — bisa dipakai seluruh tim internal",
      "Panduan penggunaan kustom (screencast 5–10 menit)",
      "Support WhatsApp 30 hari",
      "3x revisi",
    ],
  },
  {
    slug: "sistem-tim",
    name: "Custom Sistem + Otomatisasi",
    tagline: "Untuk Tim / Multi-Divisi",
    desc: "Untuk bisnis yang butuh spreadsheet saling terhubung antar file, dashboard performa tim kompleks, atau sistem kontrol akses admin vs owner.",
    price: "Rp999rb",
    originalPrice: "Rp1.499rb",
    note: "Untuk bisnis yang sudah berkembang",
    icon: Users,
    accent: "bg-lilac text-ink",
    highlighted: false,
    points: [
      "Multi-sheet saling terhubung antar file",
      "Dashboard performa tim yang kompleks",
      "Sistem kontrol akses admin vs owner",
      "Formula otomatisasi advance",
      "Lisensi 1 bisnis — multi-user internal",
      "Panduan penggunaan kustom (screencast 5–10 menit)",
      "Support WhatsApp 30 hari",
      "3x revisi",
    ],
  },
];

const inclusions = [
  { icon: Star,      title: "Template Custom Eksklusif",           desc: "Dirancang khusus sesuai alur kerja bisnis kamu — bukan template massal.",                          accent: "bg-sheet text-ink"   },
  { icon: Zap,       title: "Dashboard & Formula Otomatis",         desc: "Laporan visual (grafik/tren) yang langsung update begitu admin input data.",                        accent: "bg-sky text-cobalt"  },
  { icon: Users,     title: "Lisensi 1 Bisnis (Multi-User)",        desc: "Bisa dipakai seluruh tim internal — Owner, Admin, Finance, Sales, dll.",                           accent: "bg-lilac text-ink"   },
  { icon: Video,     title: "Panduan Penggunaan Kustom",            desc: "Video screencast 5–10 menit khusus sistem yang baru dibuatkan untuk kamu.",                        accent: "bg-leaf text-cobalt" },
  { icon: Shield,    title: "Premium Support WA (30 Hari)",         desc: "Bantuan jika ada rumus error atau tim bingung cara input di awal pemakaian.",                      accent: "bg-sky text-cobalt"  },
  { icon: RefreshCw, title: "Garansi Revisi",                       desc: "Kuota revisi 2–3 kali untuk memastikan sistem berjalan lancar sesuai kebutuhan.",                  accent: "bg-sheet text-ink"   },
];

const steps = [
  {
    step: "01",
    title: "Konsultasi & Kirim File",
    desc: "Ceritakan masalah kamu lewat WhatsApp dan kirimkan contoh file spreadsheet yang sekarang dipakai. Gratis, tanpa komitmen.",
    badge: "Gratis",
    callout: "Tidak perlu komitmen — cerita dulu, putuskan belakangan.",
    calloutStyle: "bg-leaf text-cobalt" as const,
  },
  {
    step: "02",
    title: "Deal Cakupan & Pembayaran",
    desc: "Kami rekomendasikan paket yang paling sesuai. Kamu bayar DP 50% atau langsung lunas untuk harga promo.",
    badge: "DP 50%",
    callout: null,
    calloutStyle: null,
  },
  {
    step: "03",
    title: "Proses Pengerjaan",
    desc: "Kami rancang sistem kerja dan formulasinya. Estimasi 3–7 hari kerja tergantung kerumitan.",
    badge: "3–7 hari",
    callout: null,
    calloutStyle: null,
  },
  {
    step: "04",
    title: "Review & Revisi",
    desc: "Kamu coba template versi pertama. Jika ada yang kurang pas, masuk ke sesi revisi sesuai kuota paket.",
    badge: "Revisi inklusif",
    callout: null,
    calloutStyle: null,
  },
  {
    step: "05",
    title: "Serah Terima & Pelunasan",
    desc: "Template final disetujui, sisa pembayaran dilunasi. Kamu dapat hak akses penuh + video panduan kustom.",
    badge: "Akses penuh",
    callout: "Termasuk video panduan kustom + hak akses penuh ke file.",
    calloutStyle: "bg-sheet/25 text-ink" as const,
  },
];

const stepPalette = [
  { num: "bg-ink text-white",   badge: "bg-leaf text-cobalt",  bar: "bg-ink"    },
  { num: "bg-cobalt text-white", badge: "bg-blush text-cobalt", bar: "bg-cobalt" },
  { num: "bg-sheet text-ink",    badge: "bg-sky text-cobalt",   bar: "bg-sheet"  },
  { num: "bg-cobalt text-white", badge: "bg-blush text-cobalt", bar: "bg-cobalt" },
  { num: "bg-ink text-white",    badge: "bg-sheet text-ink",    bar: "bg-ink"    },
];

export default async function CustomOrderPage() {
  const settings = await getSiteSettings();
  const waNumber = settings?.whatsapp_number ?? "6280000000000";
  const wa = (msg: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  const waGeneral = wa("Halo Pakarsheet, saya ingin konsultasi kebutuhan custom Google Sheets untuk bisnis saya.");

  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-white px-3 pb-0 pt-3 sm:px-5 sm:pt-5 lg:px-10">
          <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 pb-14 pt-28 sm:rounded-[32px] sm:px-8 sm:pt-36 lg:px-12 lg:pb-20 lg:pt-40">
            <SheetGrid cells={HERO_CELLS} />
            <div className="relative z-10 mx-auto max-w-[760px] text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-secondary text-sm font-bold text-muted shadow-card">
                <MessageCircle className="h-4 w-4" />
                Jasa Custom Google Sheets
              </p>
              <h1 className="mt-5 text-balance font-primary text-[36px] font-semibold leading-[1.1] tracking-[-1px] text-ink sm:text-[48px] sm:tracking-[-2px] lg:text-[58px] lg:tracking-[-2.5px]">
                Spreadsheet yang benar-benar pas untuk bisnis kamu.
              </h1>
              <p className="mt-5 font-secondary text-[18px] leading-[1.56] text-muted">
                Template standar tidak selalu cocok. Kami bantu rancang sistem Google Sheets dari nol — atau rapikan file berantakan kamu — sesuai alur kerja bisnis yang sebenarnya.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href={waGeneral} target="_blank" rel="noopener noreferrer"
                  className="group inline-flex h-14 items-center gap-2 rounded-full bg-ink px-7 font-secondary text-base font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt">
                  <MessageCircle className="h-5 w-5" />
                  Konsultasi Gratis via WhatsApp
                  <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                </a>
                <Link href="/shop"
                  className="inline-flex h-14 items-center gap-2 rounded-full border border-line bg-white px-7 font-secondary text-base font-semibold text-ink shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-ink">
                  Lihat template siap pakai
                </Link>
              </div>
              <p className="mt-5 font-secondary text-sm text-muted/70">
                Konsultasi awal gratis · Tidak perlu komitmen dulu
              </p>
            </div>
          </div>
        </section>

        {/* ── Packages ─────────────────────────────────────────── */}
        <section className="bg-white px-5 py-14 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1068px]">
            <div className="mb-12 text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">Pilihan Paket</p>
              <h2 className="text-balance font-primary text-[28px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px] sm:tracking-[-1px]">Pilih sesuai kebutuhan bisnis kamu.</h2>
              <p className="mx-auto mt-3 max-w-lg font-secondary text-base leading-[1.6] text-muted">Harga promo berlaku untuk pemesanan awal. Semua paket sudah termasuk konsultasi, pengerjaan, revisi, dan panduan kustom.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {packages.map((pkg) => {
                const Icon = pkg.icon;
                const pkgWa = wa(`Halo Pakarsheet, saya tertarik dengan ${pkg.name} (${pkg.tagline}). Boleh konsultasi dulu?`);
                return (
                  <div key={pkg.slug} className={`relative flex flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-soft ${pkg.highlighted ? "border-ink bg-ink shadow-soft" : "border-line bg-white shadow-card"}`}>
                    {pkg.highlighted && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-sheet px-4 py-1 font-secondary text-xs font-bold text-ink shadow-card">Paling Banyak Dipesan</span>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${pkg.highlighted ? "bg-white/15" : pkg.accent}`}>
                        <Icon className={`h-5 w-5 ${pkg.highlighted ? "text-white" : ""}`} />
                      </span>
                      <span className={`rounded-full px-3 py-1 font-secondary text-[11px] font-bold ${pkg.highlighted ? "bg-white/10 text-white/70" : "bg-sky text-cobalt"}`}>{pkg.tagline}</span>
                    </div>
                    <h3 className={`mt-5 font-primary text-[22px] font-semibold leading-[1.2] tracking-[-0.4px] ${pkg.highlighted ? "text-white" : "text-ink"}`}>{pkg.name}</h3>
                    <p className={`mt-2 font-secondary text-sm leading-[1.6] ${pkg.highlighted ? "text-white/65" : "text-muted"}`}>{pkg.desc}</p>
                    <div className="mt-6">
                      <div className="flex items-end gap-2.5">
                        <strong className={`font-primary text-[40px] font-bold leading-none tracking-[-2px] ${pkg.highlighted ? "text-white" : "text-ink"}`}>{pkg.price}</strong>
                        <span className={`mb-1 font-secondary text-sm line-through ${pkg.highlighted ? "text-white/40" : "text-muted"}`}>{pkg.originalPrice}</span>
                      </div>
                      <p className={`mt-1.5 font-secondary text-xs ${pkg.highlighted ? "text-sheet/80" : "text-cobalt"}`}>{pkg.note}</p>
                    </div>
                    <div className={`my-6 border-t ${pkg.highlighted ? "border-white/10" : "border-line"}`} />
                    <ul className="flex-1 space-y-3">
                      {pkg.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5">
                          <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${pkg.highlighted ? "text-sheet" : "text-cobalt"}`} />
                          <span className={`font-secondary text-sm leading-[1.5] ${pkg.highlighted ? "text-white/80" : "text-ink"}`}>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={pkgWa} target="_blank" rel="noopener noreferrer"
                      className={`mt-7 flex h-12 items-center justify-center gap-2 rounded-full font-secondary text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${pkg.highlighted ? "bg-sheet text-ink hover:bg-white" : "bg-ink text-white hover:bg-cobalt"}`}>
                      <MessageCircle className="h-4 w-4" />
                      Pesan Paket Ini
                    </a>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-center font-secondary text-sm text-muted">
              Tidak yakin pilih paket mana?{" "}
              <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="font-semibold text-cobalt hover:underline">Konsultasi dulu — gratis.</a>
            </p>
          </div>
        </section>

        {/* ── Inclusions ───────────────────────────────────────── */}
        <section className="bg-white px-5 pb-14 lg:px-10 lg:pb-20">
          <div className="mx-auto max-w-[1068px]">
            <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
              <div className="border-b border-line bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-8 py-8 sm:px-10 sm:py-10">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">Yang Kamu Dapat</p>
                <h2 className="text-balance font-primary text-[26px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[34px] sm:tracking-[-0.8px]">Semua paket sudah termasuk ini.</h2>
                <p className="mt-3 max-w-lg font-secondary text-base leading-[1.6] text-muted">Karena harganya lebih tinggi dari template biasa, value yang kamu dapat juga jauh lebih premium.</p>
              </div>
              <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
                {inclusions.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className={`flex items-start gap-4 p-6 sm:p-7 border-b border-line sm:border-r last:border-b-0 [&:nth-child(2n)]:sm:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 ${i >= inclusions.length - (inclusions.length % 3 || 3) ? "lg:border-b-0" : ""}`}>
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-secondary text-sm font-bold text-ink">{item.title}</p>
                        <p className="mt-1 font-secondary text-sm leading-[1.6] text-muted">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Process ──────────────────────────────────────────── */}
        <section className="bg-white px-5 pb-14 lg:px-10 lg:pb-20">
          <div className="mx-auto max-w-[1068px]">
            <div className="mb-12 text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
                <Clock className="h-4 w-4" />
                Alur Kerja
              </p>
              <h2 className="text-balance font-primary text-[28px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px] sm:tracking-[-1px]">
                Dari konsultasi sampai serah terima.
              </h2>
              <p className="mx-auto mt-3 max-w-md font-secondary text-base leading-[1.6] text-muted">
                Alur kerja yang rapi supaya pengerjaan tidak molor dan scope tidak melebar tanpa batas.
              </p>
            </div>

            <ol className="divide-y divide-line overflow-hidden rounded-3xl border border-line shadow-card">
              {steps.map((s, i) => {
                const p = stepPalette[i];
                return (
                  <li key={s.step} className="group grid grid-cols-[72px_1fr] bg-white transition duration-200 hover:bg-[#fafbff] sm:grid-cols-[100px_1fr]">
                    {/* Left — number */}
                    <div className="flex flex-col items-center border-r border-line">
                      <div className="flex flex-1 items-start justify-center pt-6 sm:pt-7">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl font-primary text-base font-bold shadow-soft ${p.num}`}>
                          {s.step}
                        </span>
                      </div>
                    </div>
                    {/* Right — content */}
                    <div className="px-6 py-6 sm:px-8 sm:py-7">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 font-secondary text-xs font-bold leading-none ${p.badge}`}>{s.badge}</span>
                        <h3 className="font-primary text-[18px] font-semibold leading-[1.25] tracking-[-0.3px] text-ink sm:text-[20px]">{s.title}</h3>
                      </div>
                      <p className="mt-3 max-w-2xl font-secondary text-base leading-[1.65] text-muted">{s.desc}</p>
                      {s.callout && (
                        <div className={`mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 ${s.calloutStyle}`}>
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span className="font-secondary text-sm font-semibold">{s.callout}</span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="bg-white px-5 pb-14 lg:px-10 lg:pb-20">
          <div className="mx-auto max-w-[760px]">
            <h2 className="mb-8 text-center font-primary text-[24px] font-semibold leading-[1.2] tracking-[-0.4px] text-ink sm:text-[30px] sm:tracking-[-0.6px]">
              Pertanyaan yang sering ditanya
            </h2>
            <div className="space-y-3">
              {[
                { q: "Apakah konsultasi awal berbayar?", a: "Tidak. Konsultasi awal via WhatsApp sepenuhnya gratis dan tanpa komitmen. Kami bantu identifikasi kebutuhan kamu dulu sebelum memutuskan paket mana yang paling sesuai." },
                { q: "Berapa lama proses pengerjaannya?", a: "Estimasi 3–7 hari kerja tergantung kerumitan. Paket Modifikasi biasanya lebih cepat (3–4 hari), sedangkan Paket Sistem Tim bisa sampai 7 hari. Timeline pasti akan dikonfirmasi setelah konsultasi." },
                { q: "Bagaimana sistem pembayarannya?", a: "Bisa DP 50% di awal dan pelunasan setelah template final disetujui. Atau langsung lunas di depan untuk mendapatkan harga promo. Metode pembayaran dikonfirmasi saat deal." },
                { q: "Apa bedanya lisensi custom dengan template biasa?", a: "Template biasa berlisensi 1 akun (personal). Custom order berlisensi 1 bisnis — artinya seluruh tim internal (Owner, Admin, Finance, Sales, dll) bisa menggunakan file yang sama tanpa biaya tambahan." },
                { q: "Bagaimana jika saya butuh perubahan setelah serah terima?", a: "Revisi dalam kuota paket (2–3x) bisa dilakukan sebelum serah terima final. Setelah itu, perubahan besar dihitung sebagai order baru. Support WhatsApp 30 hari tetap aktif untuk pertanyaan penggunaan." },
                { q: "Apakah saya perlu kirim file lama saya?", a: "Untuk Paket Modifikasi dan Custom Total, mengirim file lama sangat membantu kami memahami alur kerja yang sudah ada. Tapi tidak wajib — bisa juga mulai dari cerita kebutuhan bisnis kamu." },
              ].map((faq) => (
                <details key={faq.q} className="group rounded-[24px] border border-line bg-white shadow-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                    <span className="font-primary text-[16px] font-semibold leading-[1.3] tracking-[-0.2px] text-ink">{faq.q}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-white shadow-card transition duration-300 group-open:rotate-45">
                      <ArrowRight className="h-3.5 w-3.5 -rotate-45 text-cobalt" />
                    </span>
                  </summary>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <p className="font-secondary text-sm leading-[1.7] text-muted">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────── */}
        <section className="bg-white px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-[1068px]">
            <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-16">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sheet/20 blur-3xl" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-cobalt/20 blur-3xl" />
              <div className="relative z-10">
                <p className="font-secondary text-xs font-bold uppercase tracking-[0.1em] text-sheet">Mulai sekarang</p>
                <h2 className="mt-3 text-balance font-primary text-[28px] font-semibold leading-[1.15] tracking-[-0.5px] text-white sm:text-[38px] sm:tracking-[-1px]">
                  Ceritakan kebutuhan bisnis kamu.
                </h2>
                <p className="mx-auto mt-4 max-w-md font-secondary text-base leading-[1.6] text-white/60">
                  Konsultasi awal gratis. Tidak perlu komitmen dulu — cukup cerita masalahnya, kami bantu carikan solusinya.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a href={waGeneral} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex h-14 items-center gap-2 rounded-full bg-sheet px-8 font-secondary text-base font-semibold text-ink shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-white">
                    <MessageCircle className="h-5 w-5" />
                    Chat via WhatsApp
                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                  </a>
                  <Link href="/shop"
                    className="inline-flex h-14 items-center gap-2 rounded-full border border-white/20 px-8 font-secondary text-base font-semibold text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:text-white">
                    Lihat template siap pakai
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
