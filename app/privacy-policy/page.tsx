import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Kebijakan Privasi — ${site.name}`,
  description: `Kebijakan privasi ${site.name} menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi kamu.`,
  alternates: { canonical: "/privacy-policy" },
};

const LAST_UPDATED = "24 Mei 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <main id="main-content" className="bg-white">
        <section className="bg-white px-5 py-5 lg:px-10">
          <div className="mx-auto max-w-[1068px] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 py-8 sm:px-8 sm:py-10">

            {/* Hero header */}
            <div className="px-2 pb-8 pt-6 sm:px-4 sm:pt-10">
              <p className="font-secondary text-xs font-bold uppercase tracking-[0.1em] text-cobalt">
                Legal
              </p>
              <h1 className="mt-3 font-primary text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[44px] sm:tracking-[-1.5px]">
                Kebijakan Privasi
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
                    {site.name} ("<strong className="font-semibold text-ink">kami</strong>") berkomitmen menjaga privasi pengguna. Kebijakan ini menjelaskan informasi apa yang kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak kamu sebagai pengguna.
                  </p>
                </div>

                <Section title="1. Informasi yang Kami Kumpulkan">
                  <p>Kami dapat mengumpulkan informasi berikut ketika kamu menggunakan layanan {site.name}:</p>
                  <ul>
                    <li><strong>Informasi yang kamu berikan secara langsung</strong> — nama, alamat email, atau nomor WhatsApp saat menghubungi kami atau melakukan pembelian.</li>
                    <li><strong>Data penggunaan</strong> — halaman yang dikunjungi, durasi kunjungan, dan interaksi dengan kalkulator gratis kami (tidak terhubung ke identitas pribadi).</li>
                    <li><strong>Data teknis</strong> — jenis browser, sistem operasi, dan alamat IP untuk keperluan keamanan dan analitik.</li>
                  </ul>
                </Section>

                <Section title="2. Cara Kami Menggunakan Informasi">
                  <p>Informasi yang dikumpulkan digunakan untuk:</p>
                  <ul>
                    <li>Memproses pembelian dan mengirimkan produk digital.</li>
                    <li>Merespons pertanyaan dan permintaan konsultasi.</li>
                    <li>Meningkatkan kualitas produk dan pengalaman pengguna.</li>
                    <li>Mengirimkan informasi produk baru (hanya jika kamu menyetujuinya).</li>
                  </ul>
                  <p>Kami <strong>tidak menjual</strong> data pribadi kamu kepada pihak ketiga.</p>
                </Section>

                <Section title="3. Penyimpanan dan Keamanan Data">
                  <p>
                    Data disimpan di server yang aman. Kami menggunakan langkah-langkah teknis dan organisasi yang wajar untuk melindungi informasi dari akses tidak sah, kehilangan, atau penyalahgunaan.
                  </p>
                  <p>
                    Namun, tidak ada sistem yang 100% aman. Kami menyarankan kamu untuk tidak membagikan informasi sensitif melalui saluran yang tidak terenkripsi.
                  </p>
                </Section>

                <Section title="4. Cookie dan Teknologi Pelacakan">
                  <p>
                    Website ini dapat menggunakan cookie untuk menyimpan preferensi dan menganalisis trafik. Kamu dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi optimal.
                  </p>
                </Section>

                <Section title="5. Layanan Pihak Ketiga">
                  <p>Kami dapat menggunakan layanan pihak ketiga seperti:</p>
                  <ul>
                    <li>Google Analytics — untuk analitik penggunaan website.</li>
                    <li>WhatsApp Business — untuk komunikasi pelanggan.</li>
                    <li>Platform pembayaran — untuk memproses transaksi.</li>
                  </ul>
                  <p>Layanan-layanan ini memiliki kebijakan privasi masing-masing yang berlaku secara independen.</p>
                </Section>

                <Section title="6. Hak Kamu">
                  <p>Kamu berhak untuk:</p>
                  <ul>
                    <li>Meminta akses ke data pribadi yang kami simpan.</li>
                    <li>Meminta koreksi data yang tidak akurat.</li>
                    <li>Meminta penghapusan data (dengan batasan tertentu).</li>
                    <li>Menarik persetujuan pengiriman komunikasi pemasaran kapan saja.</li>
                  </ul>
                  <p>
                    Untuk mengajukan permintaan, hubungi kami di{" "}
                    <a href="mailto:hello@pakarsheet.com" className="text-cobalt hover:underline">
                      hello@pakarsheet.com
                    </a>.
                  </p>
                </Section>

                <Section title="7. Perubahan Kebijakan">
                  <p>
                    Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui website atau email. Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap kebijakan yang diperbarui.
                  </p>
                </Section>

                <Section title="8. Hubungi Kami">
                  <p>Jika ada pertanyaan tentang kebijakan privasi ini, silakan hubungi:</p>
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
