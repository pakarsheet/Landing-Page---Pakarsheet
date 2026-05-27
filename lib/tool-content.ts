/**
 * SEO content for each tool page.
 * Rendered below the calculator as rich text to help Google understand the page.
 */

export type ToolContent = {
  /** Short "how to use" guide */
  howToUse: string[];
  /** FAQ items specific to this tool */
  faqs: { q: string; a: string }[];
  /** Formula explanation shown in a callout */
  formula?: string;
};

export const toolContent: Record<string, ToolContent> = {
  "kalkulator-margin": {
    formula: "Margin = (Harga Jual − HPP) ÷ Harga Jual × 100%",
    howToUse: [
      "Masukkan HPP (Harga Pokok Produksi/Pembelian) per unit produk.",
      "Masukkan harga jual yang ingin kamu tetapkan.",
      "Isi biaya operasional per unit jika ada (opsional).",
      "Masukkan jumlah unit yang dijual untuk melihat total profit.",
      "Kalkulator akan otomatis menghitung margin, markup, total profit, dan BEP.",
    ],
    faqs: [
      {
        q: "Berapa margin keuntungan yang ideal untuk bisnis?",
        a: "Tidak ada angka universal, tapi secara umum: bisnis produk fisik 20–40%, bisnis jasa 40–60%, bisnis digital 60–80%. Yang terpenting adalah margin kamu cukup untuk menutup semua biaya operasional dan masih menghasilkan profit bersih.",
      },
      {
        q: "Apa perbedaan margin dan markup?",
        a: "Margin dihitung dari harga jual (profit ÷ harga jual), sedangkan markup dihitung dari HPP (profit ÷ HPP). Margin 40% tidak sama dengan markup 40%. Margin 40% setara dengan markup 66,7%.",
      },
      {
        q: "Bagaimana cara meningkatkan margin keuntungan?",
        a: "Ada dua cara: naikkan harga jual atau turunkan HPP. Naikkan harga jual dengan meningkatkan nilai produk (branding, kualitas, layanan). Turunkan HPP dengan negosiasi supplier, efisiensi produksi, atau beli dalam volume lebih besar.",
      },
    ],
  },

  "kalkulator-hpp": {
    formula: "HPP = Bahan Baku + Tenaga Kerja Langsung + Overhead Pabrik",
    howToUse: [
      "Masukkan total biaya bahan baku untuk satu batch produksi.",
      "Isi jumlah unit yang dihasilkan dari batch tersebut.",
      "Masukkan biaya tenaga kerja langsung per batch.",
      "Isi biaya overhead (listrik, gas, kemasan, dll) per batch.",
      "Tentukan target margin keuntungan untuk mendapat harga jual minimum.",
    ],
    faqs: [
      {
        q: "Apa saja yang termasuk biaya overhead dalam HPP?",
        a: "Overhead mencakup semua biaya produksi yang tidak langsung: listrik dan gas untuk produksi, sewa dapur/pabrik, depresiasi peralatan, kemasan, biaya quality control, dan biaya tidak langsung lainnya.",
      },
      {
        q: "Apakah gaji pemilik termasuk dalam HPP?",
        a: "Jika pemilik terlibat langsung dalam produksi, nilai waktu pemilik sebaiknya dimasukkan sebagai biaya tenaga kerja. Ini penting agar HPP mencerminkan biaya produksi yang sebenarnya.",
      },
      {
        q: "Seberapa sering HPP harus dihitung ulang?",
        a: "HPP harus dihitung ulang setiap ada perubahan signifikan pada harga bahan baku, biaya tenaga kerja, atau overhead. Minimal review setiap 3 bulan, atau segera setelah ada kenaikan harga bahan baku.",
      },
    ],
  },

  "kalkulator-harga-jual": {
    formula: "Harga Jual Min = HPP ÷ (1 − Fee Platform% − Target Margin%)",
    howToUse: [
      "Pilih platform marketplace yang ingin kamu simulasikan.",
      "Masukkan HPP produk kamu.",
      "Tentukan target margin keuntungan yang ingin dicapai.",
      "Isi biaya tambahan seperti packaging dan subsidi ongkir jika ada.",
      "Kalkulator akan menampilkan harga jual minimum yang aman.",
    ],
    faqs: [
      {
        q: "Berapa fee marketplace Shopee untuk seller reguler?",
        a: "Fee Shopee untuk seller reguler terdiri dari service fee sekitar 2% dan admin fee sekitar 2%, total sekitar 4%. Namun fee ini bervariasi berdasarkan kategori produk, tier seller, dan program yang diikuti. Selalu cek Seller Centre untuk fee aktual.",
      },
      {
        q: "Apakah harga di semua marketplace harus sama?",
        a: "Tidak harus, tapi sebaiknya tidak terlalu berbeda jauh untuk menghindari konflik antar platform. Kamu bisa menyesuaikan harga berdasarkan fee masing-masing platform agar margin tetap konsisten.",
      },
      {
        q: "Bagaimana cara bersaing harga tanpa mengorbankan margin?",
        a: "Fokus pada nilai tambah selain harga: foto produk berkualitas, deskripsi lengkap, rating toko yang baik, dan layanan cepat. Kompetisi harga murni biasanya tidak sustainable jangka panjang.",
      },
    ],
  },

  "kalkulator-roas": {
    formula: "ROAS = Revenue dari Iklan ÷ Biaya Iklan",
    howToUse: [
      "Masukkan total biaya iklan yang dikeluarkan dalam periode tertentu.",
      "Isi total revenue yang dihasilkan dari iklan tersebut.",
      "Masukkan HPP rata-rata produk yang terjual.",
      "Isi jumlah order yang dihasilkan.",
      "Kalkulator akan menampilkan ROAS, CPA, AOV, dan laba bersih.",
    ],
    faqs: [
      {
        q: "ROAS berapa yang dianggap bagus?",
        a: "ROAS 'bagus' berbeda untuk setiap bisnis tergantung margin produk. Bisnis dengan margin 50% butuh ROAS minimal 2x untuk break-even. Bisnis dengan margin 20% butuh ROAS minimal 5x. Hitung ROAS BEP kamu terlebih dahulu.",
      },
      {
        q: "Kenapa ROAS di dashboard iklan berbeda dengan kenyataan?",
        a: "Platform iklan menggunakan attribution model yang bisa menghitung konversi dari multiple touchpoints. Satu penjualan bisa diklaim oleh beberapa iklan sekaligus. Selalu bandingkan dengan data aktual dari Seller Centre.",
      },
      {
        q: "Apa perbedaan ROAS dan ROI iklan?",
        a: "ROAS mengukur revenue vs biaya iklan. ROI mengukur profit bersih vs biaya iklan. ROAS 4x tidak berarti ROI 400% — kamu masih harus kurangi HPP dan biaya lain untuk mendapat profit aktual.",
      },
    ],
  },

  "kalkulator-diskon-bertingkat": {
    formula: "Diskon Bertingkat = 1 − (1 − D1%) × (1 − D2%) × ...",
    howToUse: [
      "Masukkan harga normal produk sebelum diskon.",
      "Isi persentase diskon pertama (misal: 20%).",
      "Tambahkan diskon kedua jika ada (misal: 10%).",
      "Masukkan voucher nominal atau cashback jika ada.",
      "Isi biaya ongkir dan biaya layanan untuk melihat total yang harus dibayar.",
    ],
    faqs: [
      {
        q: "Apa itu diskon bertingkat dan bagaimana cara hitungnya?",
        a: "Diskon bertingkat (compound discount) adalah diskon yang diterapkan secara berurutan, bukan dijumlahkan. Diskon 20%+10% bukan berarti 30%, tapi 28%. Rumusnya: harga akhir = harga awal × (1-20%) × (1-10%) = harga awal × 0,8 × 0,9.",
      },
      {
        q: "Apakah diskon 20%+10% sama dengan diskon 30%?",
        a: "Tidak. Diskon 20%+10% menghasilkan diskon efektif 28%, bukan 30%. Selisihnya kecil tapi penting untuk perhitungan yang akurat, terutama untuk pembelian dalam jumlah besar.",
      },
      {
        q: "Bagaimana cara menghitung harga akhir dengan voucher dan cashback?",
        a: "Urutan perhitungan: (1) Terapkan diskon bertingkat pada harga normal, (2) Kurangi voucher nominal, (3) Tambahkan ongkir dan biaya layanan, (4) Kurangi cashback. Kalkulator ini menghitung semua langkah secara otomatis.",
      },
    ],
  },

  "kalkulator-profit-marketplace": {
    formula: "Profit Bersih = Harga Jual − HPP − Fee Platform − Voucher − Ongkir − Packaging − Biaya Iklan",
    howToUse: [
      "Masukkan harga jual produk di marketplace.",
      "Isi HPP (harga pokok produk).",
      "Pilih platform dan masukkan fee yang berlaku.",
      "Isi biaya voucher toko, subsidi ongkir, dan packaging.",
      "Masukkan biaya iklan per unit jika menggunakan Shopee Ads atau sejenisnya.",
    ],
    faqs: [
      {
        q: "Biaya apa saja yang sering dilupakan seller saat hitung profit?",
        a: "Yang paling sering dilupakan: subsidi ongkir gratis (seller yang menanggung), voucher toko, biaya packaging (bubble wrap, kardus, selotip), biaya iklan per unit, dan biaya return/retur produk.",
      },
      {
        q: "Bagaimana cara menghitung profit jika ikut flash sale?",
        a: "Saat flash sale, harga jual turun tapi semua biaya tetap sama atau bahkan naik (karena volume lebih tinggi). Hitung profit per unit dengan harga flash sale, pastikan masih di atas HPP + semua biaya.",
      },
      {
        q: "Berapa margin bersih yang wajar untuk seller marketplace?",
        a: "Untuk produk fisik di marketplace Indonesia, margin bersih 10–20% setelah semua biaya sudah cukup baik. Di bawah 10% berisiko karena tidak ada buffer untuk biaya tak terduga.",
      },
    ],
  },

  "kalkulator-laba-rugi": {
    formula: "Laba Bersih = Pendapatan − HPP − Biaya Operasional Tetap",
    howToUse: [
      "Masukkan total pendapatan (omzet) bulan ini.",
      "Isi HPP total dari semua produk yang terjual.",
      "Masukkan semua biaya tetap: gaji, sewa, utilitas, dll.",
      "Isi biaya variabel lainnya yang belum termasuk di HPP.",
      "Kalkulator akan menampilkan laba bersih, margin, dan BEP omzet.",
    ],
    faqs: [
      {
        q: "Apa perbedaan laba kotor dan laba bersih?",
        a: "Laba kotor = Pendapatan − HPP. Laba bersih = Laba kotor − semua biaya operasional. Laba kotor yang tinggi tidak menjamin laba bersih yang baik jika biaya operasional terlalu besar.",
      },
      {
        q: "Kenapa omzet naik tapi laba tidak naik?",
        a: "Ini bisa terjadi karena: biaya operasional naik lebih cepat dari omzet, HPP naik (harga bahan baku naik), atau kamu memberikan diskon lebih banyak. Analisis komponen biaya untuk menemukan penyebabnya.",
      },
      {
        q: "Berapa BEP omzet yang harus dicapai setiap bulan?",
        a: "BEP omzet = Total Biaya Tetap ÷ (1 − HPP%). Ini adalah omzet minimum yang harus dicapai agar bisnis tidak rugi. Di bawah BEP, bisnis merugi. Di atas BEP, setiap rupiah tambahan menghasilkan profit.",
      },
    ],
  },

  "kalkulator-efektivitas-iklan": {
    formula: "ROAS BEP = Harga Jual ÷ (Harga Jual − HPP − Fee − Biaya Lain)",
    howToUse: [
      "Masukkan harga jual dan HPP produk.",
      "Isi fee marketplace yang berlaku.",
      "Masukkan biaya packaging, ongkir, dan biaya lain per unit.",
      "Isi data iklan: budget, revenue dari iklan, dan jumlah order.",
      "Kalkulator akan menampilkan apakah iklan profitable dan ROAS minimum BEP.",
    ],
    faqs: [
      {
        q: "Kenapa ROAS 3x bisa tetap rugi?",
        a: "Karena ROAS hanya mengukur revenue vs biaya iklan, tidak memperhitungkan HPP dan biaya lain. Jika HPP 60% dari harga jual dan fee marketplace 5%, kamu butuh ROAS minimal 2,5x hanya untuk break-even dari biaya produksi dan platform.",
      },
      {
        q: "Bagaimana cara menentukan budget iklan yang tepat?",
        a: "Hitung dulu ROAS BEP kamu. Kemudian set target ROAS yang lebih tinggi (misal 1,5x ROAS BEP) sebagai target iklan. Budget iklan = Revenue target ÷ Target ROAS.",
      },
      {
        q: "Kapan sebaiknya matikan iklan yang tidak perform?",
        a: "Jika ROAS aktual di bawah ROAS BEP selama 3–7 hari berturut-turut (tergantung volume), pertimbangkan untuk pause dan optimasi. Jangan matikan terlalu cepat karena iklan butuh waktu untuk belajar.",
      },
    ],
  },

  "kalkulator-cashflow": {
    formula: "Net Cashflow = Total Pemasukan − Total Pengeluaran",
    howToUse: [
      "Masukkan saldo awal bulan (uang yang ada di rekening bisnis).",
      "Isi semua sumber pemasukan: penjualan, piutang masuk, dll.",
      "Masukkan semua pengeluaran: stok, gaji, sewa, utilitas, iklan, dll.",
      "Kalkulator akan menampilkan net cashflow, saldo akhir, dan runway.",
      "Runway menunjukkan berapa bulan bisnis bisa bertahan dengan kas saat ini.",
    ],
    faqs: [
      {
        q: "Apa itu runway bisnis dan berapa yang ideal?",
        a: "Runway adalah berapa bulan bisnis bisa bertahan dengan kas yang ada jika tidak ada pemasukan baru. Idealnya minimal 3–6 bulan. Runway di bawah 2 bulan adalah tanda bahaya yang perlu segera diatasi.",
      },
      {
        q: "Bagaimana cara memperbaiki cashflow yang negatif?",
        a: "Langkah cepat: percepat collection piutang, tunda pengeluaran yang tidak mendesak, negosiasi tempo pembayaran ke supplier. Langkah jangka panjang: tingkatkan margin, kurangi stok berlebih, dan buat cash reserve.",
      },
      {
        q: "Apakah cashflow positif berarti bisnis profit?",
        a: "Tidak selalu. Cashflow bisa positif karena pinjaman atau modal masuk, bukan dari operasional. Sebaliknya, bisnis yang profit bisa cashflow negatif jika banyak piutang belum dibayar atau stok menumpuk.",
      },
    ],
  },

  "kalkulator-bundling": {
    formula: "Margin Bundle = (Harga Bundle − Total HPP Semua Produk) ÷ Harga Bundle × 100%",
    howToUse: [
      "Masukkan HPP dan harga normal untuk setiap produk dalam bundle (2–5 produk).",
      "Tentukan harga jual bundle yang ingin kamu tetapkan.",
      "Kalkulator akan menampilkan margin bundle, diskon efektif, dan harga BEP.",
      "Lihat juga 'nilai hemat' yang dirasakan pembeli untuk menilai daya tarik bundle.",
    ],
    faqs: [
      {
        q: "Bagaimana cara menentukan harga bundle yang menarik tapi tetap profit?",
        a: "Harga bundle idealnya 10–25% lebih murah dari total harga satuan. Pastikan harga bundle masih di atas total HPP semua produk ditambah target margin minimum. Gunakan kalkulator ini untuk menemukan sweet spot.",
      },
      {
        q: "Produk apa yang cocok untuk di-bundle?",
        a: "Produk yang saling melengkapi (complementary products) paling efektif untuk bundling. Contoh: kopi + gula + creamer, atau baju + celana + ikat pinggang. Bundling produk yang tidak relevan biasanya kurang menarik.",
      },
      {
        q: "Apakah bundling selalu meningkatkan profit?",
        a: "Tidak selalu. Bundling meningkatkan AOV (Average Order Value) dan bisa meningkatkan total profit jika volume naik. Tapi jika diskon bundle terlalu besar, margin per transaksi bisa turun. Hitung dengan cermat sebelum launch.",
      },
    ],
  },

  "kalkulator-komisi-reseller": {
    formula: "Komisi Maks = Harga Jual − HPP − (Harga Jual × Target Margin%)",
    howToUse: [
      "Masukkan HPP produk kamu.",
      "Isi harga jual normal (harga konsumen akhir).",
      "Tentukan target margin minimum yang ingin kamu pertahankan.",
      "Kalkulator akan menampilkan komisi maksimal aman dan harga beli reseller.",
      "Lihat juga saran struktur 3 tier komisi untuk program reseller yang lebih terstruktur.",
    ],
    faqs: [
      {
        q: "Berapa komisi reseller yang wajar?",
        a: "Komisi reseller yang umum di Indonesia berkisar 10–30% dari harga jual, tergantung industri dan margin produk. Yang terpenting adalah komisi cukup menarik bagi reseller tapi tidak menggerus margin kamu.",
      },
      {
        q: "Apa perbedaan reseller, agen, dan dropshipper?",
        a: "Reseller membeli stok terlebih dahulu lalu jual. Agen biasanya punya area eksklusif dan komisi lebih besar. Dropshipper tidak pegang stok, hanya forward order. Struktur komisi dan harga beli berbeda untuk masing-masing.",
      },
      {
        q: "Bagaimana cara membuat program reseller yang efektif?",
        a: "Kunci program reseller yang berhasil: komisi yang kompetitif, materi marketing yang siap pakai, support yang responsif, dan sistem tracking yang transparan. Tier komisi berdasarkan volume juga efektif untuk mendorong reseller lebih aktif.",
      },
    ],
  },

  "kalkulator-kenaikan-harga": {
    formula: "Volume Toleransi Turun = (Kenaikan Harga%) ÷ (Margin Baru%) × 100%",
    howToUse: [
      "Masukkan harga jual saat ini dan HPP produk.",
      "Isi volume penjualan rata-rata per bulan.",
      "Tentukan persentase kenaikan harga yang ingin disimulasikan.",
      "Kalkulator akan menampilkan dampak terhadap omzet dan profit.",
      "Lihat juga berapa persen penurunan volume yang masih bisa ditoleransi.",
    ],
    faqs: [
      {
        q: "Kapan waktu yang tepat untuk naik harga?",
        a: "Waktu yang baik untuk naik harga: saat ada kenaikan biaya produksi, saat produk kamu sudah punya brand yang kuat, saat kompetitor juga naik harga, atau saat kamu menambahkan nilai baru ke produk.",
      },
      {
        q: "Bagaimana cara naik harga tanpa kehilangan pelanggan?",
        a: "Komunikasikan alasan kenaikan harga dengan jujur, berikan notice yang cukup, tawarkan nilai tambah bersamaan dengan kenaikan harga, dan pertimbangkan kenaikan bertahap daripada sekaligus besar.",
      },
      {
        q: "Berapa persen kenaikan harga yang masih bisa diterima pasar?",
        a: "Tidak ada angka pasti, tapi kenaikan 5–10% biasanya lebih mudah diterima daripada kenaikan 20–30% sekaligus. Faktor lain: seberapa kuat brand kamu, seberapa banyak alternatif yang tersedia, dan seberapa price-sensitive target pasar kamu.",
      },
    ],
  },
};
