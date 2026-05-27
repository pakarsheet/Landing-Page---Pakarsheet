import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Kebijakan Pengembalian Dana — ${site.name}`,
  description: `Kebijakan pengembalian dana untuk pembelian produk digital ${site.name}.`,
  alternates: { canonical: "/refund-policy" },
};

const LAST_UPDATED = "24 Mei 2026";

export default function RefundPolicyPage() {
  return (
    <>
      <main id="main-content" className="bg-white">
        <section className="bg-white px-5 pb-5 pt-10 sm:pt-12 lg:px-10 lg:pt-16">
          <div className="mx-auto max-w-[1068px] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 py-8 sm:px-8 sm:py-10">

            {/* Hero header */}
            <div className="px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
              <p className="font-secondary text-xs font-bold uppercase tracking-[0.1em] text-cobalt">
                Legal
              </p>
              <h1 className="mt-3 font-primary text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[44px] sm:tracking-[-1.5px]">
                Kebijakan Pengembalian Dana
              </h1>
              <p className="mt-3 font-secondary text-base text-muted">
                Terakhir diperbarui: {LAST_UPDATED}
              </p>
            </div>

            {/* Content card */}
            <div className="rounded-[20px] bg-white px-6 py-10 shadow-card sm:px-10 sm:py-12">
              <div className="space-y-10 font-secondary text-base leading-[1.75] text-ink">

                <div>
                  <p className="text-muted">
                    Kami ingin kamu puas dengan setiap produk {site.name}. Halaman ini menjelaskan kondisi di mana pengembalian dana dapat diproses.
                  </p>
                </div>

                <Section title="1. Sifat Produk Digital">
                  <p>
                    Semua produk {site.name} adalah <strong>produk digital</strong> (template Google Sheets dan konten unduhan). Karena produk dapat langsung diakses setelah pembelian, secara umum kami <strong>tidak menerima pengembalian dana</strong> berdasarkan perubahan pikiran atau ketidakcocokan preferensi.
                  </p>
                  <p>
                    Kami sangat menyarankan kamu membaca deskripsi produk, melihat preview, dan menghubungi kami terlebih dahulu jika ada pertanyaan sebelum melakukan pembelian.
                  </p>
                </Section>

                <Section title="2. Kondisi yang Memenuhi Syarat Refund">
                  <p>Pengembalian dana <strong>dapat diproses</strong> jika:</p>
                  <ul>
                    <li>
                      <strong>Produk tidak dapat diakses</strong> — link unduhan tidak berfungsi atau file tidak dapat dibuka karena kesalahan teknis dari pihak kami, dan tidak dapat diselesaikan dalam 2 hari kerja.
                    </li>
                    <li>
                      <strong>Produk berbeda dari deskripsi</strong> — konten yang diterima secara signifikan berbeda dari yang tertera di halaman produk.
                    </li>
                    <li>
                      <strong>Pembelian duplikat</strong> — terjadi pembayaran ganda untuk produk yang sama karena kesalahan sistem.
                    </li>
                  </ul>
                </Section>

                <Section title="3. Kondisi yang Tidak Memenuhi Syarat Refund">
                  <p>Pengembalian dana <strong>tidak dapat diproses</strong> untuk:</p>
                  <ul>
                    <li>Perubahan pikiran setelah produk diunduh atau diakses.</li>
                    <li>Ketidakcocokan dengan versi Google Sheets tertentu (produk kami kompatibel dengan Google Sheets versi terbaru).</li>
                    <li>Kesalahan penggunaan atau modifikasi template oleh pengguna.</li>
                    <li>Pembelian yang sudah lebih dari 3 hari kerja tanpa laporan masalah.</li>
                  </ul>
                </Section>

                <Section title="4. Cara Mengajukan Refund">
                  <p>
                    Untuk mengajukan pengembalian dana, kirimkan email ke{" "}
                    <a href="mailto:hello@pakarsheet.com" className="text-cobalt hover:underline">hello@pakarsheet.com</a>{" "}
                    dengan informasi berikut:
                  </p>
                  <ul>
                    <li>Nama lengkap dan email yang digunakan saat pembelian.</li>
                    <li>Nama produk yang dibeli.</li>
                    <li>Bukti pembayaran (screenshot atau nomor transaksi).</li>
                    <li>Penjelasan singkat tentang masalah yang dialami.</li>
                  </ul>
                  <p>
                    Kami akan merespons dalam <strong>2 hari kerja</strong> dan memproses refund yang disetujui dalam <strong>5–7 hari kerja</strong> melalui metode pembayaran asal.
                  </p>
                </Section>

                <Section title="5. Pertanyaan">
                  <p>
                    Jika ada pertanyaan sebelum atau sesudah pembelian, jangan ragu menghubungi kami:
                  </p>
                  <ul>
                    <li>Email: <a href="mailto:hello@pakarsheet.com" className="text-cobalt hover:underline">hello@pakarsheet.com</a></li>
                    <li>WhatsApp: <a href={site.contactUrl} className="text-cobalt hover:underline">Chat via WhatsApp</a></li>
                  </ul>
                </Section>

              </div>

              {/* Back link */}
              <div className="mt-12 border-t border-line pt-8">
                <Link href="/" className="font-secondary text-sm font-semibold text-cobalt hover:underline">
                  ← Kembali ke beranda
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-primary text-xl font-semibold tracking-[-0.3px] text-ink sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-3 text-muted [&_a]:text-cobalt [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul>li]:list-disc">
        {children}
      </div>
    </div>
  );
}
