import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { getSiteSettings, buildWaUrl } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: `Syarat & Ketentuan — ${site.name}`,
  description: `Syarat dan ketentuan penggunaan layanan dan produk ${site.name}.`,
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "24 Mei 2026";

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const waUrl = buildWaUrl(settings) || site.contactUrl;
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
                Syarat &amp; Ketentuan
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
                    Dengan mengakses website atau membeli produk {site.name}, kamu menyetujui syarat dan ketentuan berikut. Harap baca dengan seksama sebelum menggunakan layanan kami.
                  </p>
                </div>

                <Section title="1. Definisi">
                  <ul>
                    <li><strong>"{site.name}"</strong> merujuk pada platform, produk, dan layanan yang dioperasikan di bawah merek Pakarsheet.</li>
                    <li><strong>"Produk"</strong> merujuk pada template Google Sheets dan konten digital lainnya yang tersedia di toko kami.</li>
                    <li><strong>"Pengguna"</strong> merujuk pada siapa pun yang mengakses website atau membeli produk kami.</li>
                  </ul>
                </Section>

                <Section title="2. Penggunaan Produk">
                  <p>Setelah pembelian, kamu mendapatkan lisensi <strong>non-eksklusif, tidak dapat dipindahtangankan</strong> untuk menggunakan produk untuk keperluan bisnis pribadi atau tim internal kamu.</p>
                  <p>Kamu <strong>tidak diperbolehkan</strong> untuk:</p>
                  <ul>
                    <li>Menjual kembali, mendistribusikan, atau membagikan produk kepada pihak lain.</li>
                    <li>Mengklaim produk sebagai karya sendiri.</li>
                    <li>Menggunakan produk untuk membuat produk serupa yang dijual secara komersial.</li>
                    <li>Menghapus atribusi atau branding {site.name} dari produk.</li>
                  </ul>
                </Section>

                <Section title="3. Pembelian dan Pembayaran">
                  <ul>
                    <li>Semua harga tercantum dalam Rupiah (IDR) dan sudah termasuk pajak yang berlaku.</li>
                    <li>Pembayaran diproses melalui platform yang kami tentukan. Kami tidak menyimpan data kartu kredit.</li>
                    <li>Setelah pembayaran dikonfirmasi, produk akan dikirimkan melalui email atau link unduhan.</li>
                  </ul>
                </Section>

                <Section title="4. Kebijakan Pengembalian Dana">
                  <p>
                    Karena sifat produk digital yang langsung dapat diakses setelah pembelian, kami <strong>tidak menerima pengembalian dana</strong> kecuali:
                  </p>
                  <ul>
                    <li>Produk tidak dapat diakses atau diunduh karena kesalahan teknis dari pihak kami.</li>
                    <li>Produk yang diterima berbeda secara signifikan dari deskripsi yang tertera.</li>
                  </ul>
                  <p>
                    Untuk mengajukan klaim, hubungi kami dalam <strong>3 hari kerja</strong> setelah pembelian melalui{" "}
                    <a href="mailto:hello@pakarsheet.com" className="text-cobalt hover:underline">hello@pakarsheet.com</a>.
                  </p>
                </Section>

                <Section title="5. Kalkulator dan Tools Gratis">
                  <p>
                    Kalkulator dan tools gratis di website ini disediakan "sebagaimana adanya" tanpa jaminan akurasi untuk keputusan bisnis spesifik. Hasil kalkulasi bersifat estimasi dan tidak menggantikan saran profesional keuangan atau akuntansi.
                  </p>
                </Section>

                <Section title="6. Hak Kekayaan Intelektual">
                  <p>
                    Seluruh konten di website ini — termasuk teks, desain, template, kode, dan merek dagang — adalah milik {site.name} dan dilindungi oleh hukum hak cipta yang berlaku di Indonesia.
                  </p>
                </Section>

                <Section title="7. Batasan Tanggung Jawab">
                  <p>
                    {site.name} tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan produk atau layanan kami, termasuk namun tidak terbatas pada kehilangan data atau keuntungan bisnis.
                  </p>
                </Section>

                <Section title="8. Perubahan Layanan">
                  <p>
                    Kami berhak mengubah, menangguhkan, atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya. Kami juga dapat memperbarui syarat ini — penggunaan layanan setelah perubahan dianggap sebagai persetujuan.
                  </p>
                </Section>

                <Section title="9. Hukum yang Berlaku">
                  <p>
                    Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui musyawarah, dan jika tidak tercapai kesepakatan, melalui pengadilan yang berwenang di Indonesia.
                  </p>
                </Section>

                <Section title="10. Hubungi Kami">
                  <p>Pertanyaan tentang syarat ini dapat dikirimkan ke:</p>
                  <ul>
                    <li>Email: <a href="mailto:hello@pakarsheet.com" className="text-cobalt hover:underline">hello@pakarsheet.com</a></li>
                    <li>WhatsApp: <a href={waUrl} className="text-cobalt hover:underline">Chat via WhatsApp</a></li>
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
