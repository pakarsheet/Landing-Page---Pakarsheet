import {
  Calculator,
  TrendingUp,
  ShoppingCart,
  Megaphone,
  Tag,
  Store,
  BarChart2,
  FileText,
  ClipboardCheck,
  Zap,
  Users,
  Table2,
  Wallet,
  Package,
  UserCheck,
  TrendingDown,
} from "lucide-react";

export type ToolType = "kalkulator" | "worksheet";

export type ToolMeta = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  badge: string;
  icon: typeof Calculator;
  accent: string;
  keywords: string[];
  /** Short CTA label shown on ToolCard */
  ctaText: string;
  relatedShopSlug?: string;
  /** Distinguishes calculator vs worksheet — defaults to "kalkulator" */
  type?: ToolType;
  /** Estimated time to complete, shown on WorksheetCard */
  estimatedTime?: string;
};

export const tools: ToolMeta[] = [
  {
    slug: "kalkulator-margin",
    title: "Kalkulator Margin Keuntungan",
    shortTitle: "Margin Keuntungan",
    description:
      "Hitung margin profit per unit, total profit, markup, dan Break-Even Point (BEP) penjualan secara instan.",
    longDescription:
      "Analisis kelayakan profit dari struktur harga jual dan biaya per unit produk. Masukkan modal, harga jual, biaya operasional, dan jumlah unit — dapatkan margin, markup, total profit, dan BEP seketika.",
    badge: "Finance",
    icon: TrendingUp,
    accent: "bg-sheet text-ink",
    ctaText: "Hitung margin →",
    keywords: [
      "kalkulator margin keuntungan",
      "hitung margin profit",
      "cara hitung margin keuntungan toko online",
      "margin profit yang bagus berapa persen",
      "break even point",
      "markup harga",
      "rumus margin keuntungan",
    ],
  },
  {
    slug: "kalkulator-hpp",
    title: "Kalkulator HPP",
    shortTitle: "HPP Produksi",
    description:
      "Hitung Harga Pokok Produksi (HPP) dari bahan baku, tenaga kerja, dan overhead, lalu dapatkan harga jual minimum.",
    longDescription:
      "Jabarkan komponen biaya produksi dan tentukan harga jual minimum berdasarkan target margin. Cocok untuk produsen, bisnis kuliner, dan manufaktur kecil.",
    badge: "Produksi",
    icon: Calculator,
    accent: "bg-sky text-cobalt",
    ctaText: "Hitung HPP →",
    keywords: [
      "kalkulator HPP",
      "harga pokok produksi",
      "hitung HPP online",
      "biaya produksi per unit",
      "cara hitung HPP makanan per porsi",
      "HPP per porsi",
      "rumus HPP usaha kuliner",
      "HPP manufaktur kecil",
    ],
  },
  {
    slug: "kalkulator-harga-jual",
    title: "Kalkulator Harga Jual Marketplace",
    shortTitle: "Harga Jual Marketplace",
    description:
      "Simulasi harga banderol di Shopee, Tokopedia, TikTok Shop, dan Lazada agar fee platform tidak menggerus margin.",
    longDescription:
      "Tentukan harga jual minimum yang aman di marketplace Indonesia. Preset biaya admin tiap platform sudah tersedia — tinggal masukkan modal dan target margin.",
    badge: "Marketplace",
    icon: ShoppingCart,
    accent: "bg-lilac text-ink",
    ctaText: "Simulasi harga →",
    keywords: [
      "kalkulator harga jual marketplace",
      "harga jual shopee tokopedia",
      "fee marketplace indonesia",
      "hitung harga jual online",
      "cara hitung harga jual di shopee",
      "fee admin tokopedia berapa persen",
      "harga jual minimum marketplace",
    ],
  },
  {
    slug: "kalkulator-roas",
    title: "Kalkulator ROAS Iklan",
    shortTitle: "ROAS Iklan",
    description:
      "Hitung Return on Ad Spend (ROAS), CPA, AOV, dan laba bersih iklan Meta Ads, Google Ads, atau TikTok Ads.",
    longDescription:
      "Uji efisiensi biaya iklan digital terhadap volume penjualan dan laba bersih. Masukkan budget iklan, revenue, HPP, dan jumlah order — dapatkan ROAS, CPA, AOV, dan status profitable.",
    badge: "Marketing",
    icon: Megaphone,
    accent: "bg-sky text-cobalt",
    ctaText: "Cek ROAS →",
    keywords: [
      "kalkulator ROAS",
      "hitung return on ad spend",
      "ROAS iklan facebook",
      "CPA cost per acquisition",
      "roas iklan shopee berapa yang bagus",
      "cara hitung roas tiktok ads",
      "roas meta ads indonesia",
      "rumus roas iklan digital",
    ],
  },
  {
    slug: "kalkulator-diskon-bertingkat",
    title: "Kalkulator Diskon Bertingkat",
    shortTitle: "Diskon Bertingkat",
    description:
      "Hitung harga akhir setelah diskon bertingkat (misal 20%+10%), voucher, cashback, ongkir, dan biaya layanan.",
    longDescription:
      "Simulasi harga belanja online dengan skema promo kumulatif. Diskon bertingkat dihitung compound (bukan dijumlah), plus voucher nominal, cashback, ongkir, dan biaya admin.",
    badge: "Belanja",
    icon: Tag,
    accent: "bg-leaf text-cobalt",
    ctaText: "Hitung diskon →",
    keywords: [
      "kalkulator diskon bertingkat",
      "hitung diskon 20 10 persen",
      "diskon compound",
      "harga setelah diskon voucher",
      "cara hitung diskon bertingkat shopee",
      "diskon 20 persen plus 10 persen berapa",
      "kalkulator promo belanja online",
    ],
  },
  {
    slug: "kalkulator-profit-marketplace",
    title: "Kalkulator Profit Marketplace",
    shortTitle: "Profit Marketplace",
    description:
      "Hitung profit bersih seller setelah HPP, fee platform, voucher toko, subsidi ongkir, packaging, dan biaya iklan.",
    longDescription:
      "Kalkulasi komprehensif laba bersih e-commerce. Masukkan semua variabel pengeluaran — fee platform, subsidi promo, CPA iklan, packaging — dan lihat margin aktual serta harga BEP.",
    badge: "Marketplace",
    icon: Store,
    accent: "bg-sheet text-ink",
    ctaText: "Hitung profit →",
    keywords: [
      "kalkulator profit marketplace",
      "hitung profit bersih seller",
      "profit shopee tokopedia",
      "margin bersih jualan online",
      "cara hitung profit jualan di shopee",
      "profit bersih seller marketplace indonesia",
      "hitung laba bersih toko online",
    ],
  },
  {
    slug: "kalkulator-laba-rugi",
    title: "Kalkulator Laba Rugi Bisnis",
    shortTitle: "Laba Rugi Bisnis",
    description:
      "Hitung laba bersih bisnis bulan ini dari omzet, HPP, dan semua biaya tetap — langsung tahu untung atau rugi.",
    longDescription:
      "Banyak pemilik UMKM lihat saldo naik tapi tidak tahu apakah itu profit atau sekadar omzet. Masukkan pendapatan, modal barang terjual, dan semua pengeluaran tetap — dapatkan laba bersih, margin, rasio beban, dan BEP omzet minimum.",
    badge: "Finance",
    icon: FileText,
    accent: "bg-sky text-cobalt",
    ctaText: "Hitung laba rugi →",
    keywords: [
      "kalkulator laba rugi bisnis",
      "hitung untung rugi usaha",
      "laporan laba rugi sederhana UMKM",
      "cara hitung laba bersih toko",
      "rumus laba rugi usaha kecil",
      "laba bersih vs omzet",
      "hitung profit bersih bisnis bulanan",
    ],
  },
  {
    slug: "kalkulator-efektivitas-iklan",
    title: "Kalkulator Efektivitas Iklan",
    shortTitle: "Efektivitas Iklan",
    description:
      "Cek apakah iklan kamu benar-benar untung setelah HPP, fee marketplace, packaging, dan ongkir ikut dihitung.",
    longDescription:
      "ROAS tinggi belum tentu profit. Kalkulator ini membongkar biaya tersembunyi yang sering dilupakan saat menilai iklan — fee marketplace, packaging, subsidi ongkir — lalu hitung laba bersih aktual, ROAS minimum BEP, dan maksimal budget iklan yang masih aman.",
    badge: "Marketing",
    icon: BarChart2,
    accent: "bg-lilac text-ink",
    ctaText: "Cek efektivitas →",
    keywords: [
      "kalkulator efektivitas iklan",
      "iklan shopee rugi atau untung",
      "roas iklan setelah biaya marketplace",
      "hitung profit bersih iklan",
      "cara tahu iklan facebook ads untung",
      "roas minimum break even",
      "biaya tersembunyi iklan marketplace",
    ],
  },
  {
    slug: "kalkulator-cashflow",
    title: "Kalkulator Cashflow Bisnis",
    shortTitle: "Cashflow Bisnis",
    description:
      "Proyeksikan arus kas bulanan — hitung net cashflow, saldo akhir, runway, dan komposisi pengeluaran bisnis kamu.",
    longDescription:
      "Banyak bisnis profit di atas kertas tapi kehabisan uang tunai. Kalkulator ini membantu kamu memahami arus kas nyata: masukkan semua pemasukan dan pengeluaran bulan ini, lalu dapatkan net cashflow, saldo akhir, runway (berapa bulan kas bertahan), dan breakdown pengeluaran terbesar.",
    badge: "Finance",
    icon: Wallet,
    accent: "bg-leaf text-cobalt",
    ctaText: "Cek cashflow →",
    keywords: [
      "kalkulator cashflow bisnis",
      "hitung arus kas usaha",
      "cashflow positif negatif",
      "runway bisnis berapa bulan",
      "cara hitung cashflow UMKM",
      "proyeksi arus kas bulanan",
      "cashflow vs profit perbedaan",
    ],
  },
  {
    slug: "kalkulator-bundling",
    title: "Kalkulator Harga Bundling",
    shortTitle: "Harga Bundling",
    description:
      "Hitung harga bundle 2–5 produk agar tetap profit — lihat margin, diskon vs harga normal, dan nilai hemat untuk pembeli.",
    longDescription:
      "Bundling produk bisa meningkatkan AOV, tapi salah hitung bisa bikin rugi. Masukkan HPP dan harga normal tiap produk dalam bundle, tentukan harga jual bundle, dan langsung lihat margin, diskon efektif, harga minimum BEP, serta nilai hemat yang dirasakan pembeli.",
    badge: "Marketplace",
    icon: Package,
    accent: "bg-sky text-cobalt",
    ctaText: "Hitung bundle →",
    keywords: [
      "kalkulator harga bundling produk",
      "harga bundle shopee tokopedia",
      "cara hitung harga paket produk",
      "bundling produk agar profit",
      "diskon bundle vs harga satuan",
      "strategi bundling marketplace",
      "harga minimum bundle",
    ],
  },
  {
    slug: "kalkulator-komisi-reseller",
    title: "Kalkulator Komisi Reseller",
    shortTitle: "Komisi Reseller",
    description:
      "Hitung komisi reseller maksimal yang aman tanpa menggerus margin — lengkap dengan saran struktur tier komisi.",
    longDescription:
      "Berapa komisi yang bisa kamu berikan ke reseller tanpa rugi? Masukkan HPP, harga jual, dan target margin kamu — dapatkan komisi maksimal aman, harga beli reseller, saran struktur 3 tier komisi, dan proyeksi profit per reseller per bulan.",
    badge: "Finance",
    icon: UserCheck,
    accent: "bg-lilac text-ink",
    ctaText: "Hitung komisi →",
    keywords: [
      "kalkulator komisi reseller",
      "berapa komisi reseller yang wajar",
      "harga beli reseller",
      "struktur tier komisi reseller",
      "komisi agen dropshipper",
      "cara hitung komisi tanpa rugi",
      "program reseller UMKM",
    ],
  },
  {
    slug: "kalkulator-kenaikan-harga",
    title: "Kalkulator Kenaikan Harga",
    shortTitle: "Kenaikan Harga",
    description:
      "Simulasi dampak naik harga terhadap volume, omzet, dan profit — tahu persis apakah kenaikan harga layak dilakukan.",
    longDescription:
      "Takut naik harga karena khawatir pelanggan kabur? Kalkulator ini mensimulasikan dampak kenaikan harga X% terhadap volume penjualan, omzet, dan total profit — termasuk berapa persen penurunan volume yang masih bisa ditoleransi agar profit tidak turun.",
    badge: "Finance",
    icon: TrendingDown,
    accent: "bg-sheet text-ink",
    ctaText: "Simulasi harga →",
    keywords: [
      "kalkulator kenaikan harga produk",
      "dampak naik harga terhadap penjualan",
      "simulasi kenaikan harga",
      "apakah layak naik harga",
      "elastisitas harga UMKM",
      "strategi naik harga tanpa kehilangan pelanggan",
      "break even kenaikan harga",
    ],
  },
];

// ─── Worksheets ───────────────────────────────────────────────────────────────

export const worksheets: ToolMeta[] = [
  {
    slug: "scorecard-bisnis-bulanan",
    title: "Scorecard Bisnis Bulanan",
    shortTitle: "Scorecard Bisnis",
    description:
      "Evaluasi kesehatan bisnis bulan ini dari 4 area: keuangan, operasional, marketing, dan SDM — dapat skor + prioritas perbaikan.",
    longDescription:
      "Banyak pemilik UMKM tidak tahu area mana yang paling perlu diperbaiki. Scorecard ini memandu kamu mengisi 12 metrik bisnis, lalu menghasilkan skor per area, status kesehatan keseluruhan, dan 3 prioritas aksi bulan depan.",
    badge: "Evaluasi",
    icon: ClipboardCheck,
    accent: "bg-sky text-cobalt",
    ctaText: "Mulai evaluasi →",
    type: "worksheet",
    estimatedTime: "~10 menit",
    keywords: [
      "scorecard bisnis UMKM",
      "evaluasi kesehatan bisnis bulanan",
      "cara evaluasi bisnis sendiri",
      "indikator kinerja bisnis kecil",
      "KPI UMKM sederhana",
      "cek kesehatan bisnis",
    ],
  },
  {
    slug: "planner-flash-sale",
    title: "Planner Flash Sale",
    shortTitle: "Planner Flash Sale",
    description:
      "Rencanakan flash sale tanpa rugi — hitung diskon maksimal aman, estimasi revenue, profit, dan stok yang perlu disiapkan.",
    longDescription:
      "Seller sering asal kasih diskon flash sale tanpa hitung apakah masih profit. Planner ini memandu kamu dari target flash sale, produk yang dipromosikan, hingga diskon maksimal yang aman — lengkap dengan estimasi revenue dan profit bersih.",
    badge: "Promo",
    icon: Zap,
    accent: "bg-sheet text-ink",
    ctaText: "Buat rencana →",
    type: "worksheet",
    estimatedTime: "~8 menit",
    keywords: [
      "planner flash sale marketplace",
      "cara hitung diskon flash sale agar tidak rugi",
      "strategi flash sale shopee tokopedia",
      "diskon maksimal flash sale",
      "perencanaan promo seller",
      "flash sale tanpa rugi",
    ],
  },
  {
    slug: "planner-rekrut-karyawan",
    title: "Planner Rekrut Karyawan",
    shortTitle: "Rekrut Karyawan",
    description:
      "Cek apakah bisnismu sudah siap rekrut karyawan — hitung titik impas, estimasi biaya, dan kapan investasi SDM balik modal.",
    longDescription:
      "Kapan waktu yang tepat rekrut karyawan pertama? Planner ini memandu kamu menilai kesiapan bisnis, menghitung total biaya rekrut dan gaji, serta memproyeksikan kapan penambahan SDM akan balik modal — bukan sekadar feeling.",
    badge: "SDM",
    icon: Users,
    accent: "bg-lilac text-ink",
    ctaText: "Cek kesiapan →",
    type: "worksheet",
    estimatedTime: "~12 menit",
    keywords: [
      "kapan harus rekrut karyawan",
      "cara tahu bisnis siap tambah karyawan",
      "hitung biaya rekrut karyawan UMKM",
      "titik impas rekrut karyawan",
      "perencanaan SDM usaha kecil",
      "gaji karyawan pertama UMKM",
    ],
  },
  {
    slug: "tabel-fee-marketplace",
    title: "Tabel Fee Marketplace Lengkap",
    shortTitle: "Fee Marketplace",
    description:
      "Referensi fee terlengkap untuk Shopee, Tokopedia, TikTok Shop, Lazada, dan Blibli — bisa difilter per platform dan kategori.",
    longDescription:
      "Satu halaman referensi fee marketplace Indonesia yang komprehensif. Tidak perlu buka satu per satu Seller Centre — semua fee admin, service fee, dan biaya program sudah dirangkum dan bisa difilter per platform.",
    badge: "Referensi",
    icon: Table2,
    accent: "bg-leaf text-cobalt",
    ctaText: "Lihat tabel →",
    type: "worksheet",
    estimatedTime: "Referensi",
    keywords: [
      "fee marketplace indonesia lengkap",
      "biaya admin shopee tokopedia tiktok shop",
      "fee seller marketplace 2025",
      "tabel fee marketplace indonesia",
      "berapa fee shopee per transaksi",
      "perbandingan fee marketplace indonesia",
    ],
  },
];

// ─── Shared calculator UI helpers ────────────────────────────────────────────

/** Shared input wrapper class used across all calculators */
export const inputClass =
  "flex items-center rounded-2xl border border-line bg-white px-4 py-3 shadow-card focus-within:border-cobalt focus-within:ring-1 focus-within:ring-cobalt/20";

/** Marketplace platform presets */
export type Platform = {
  label: string;
  serviceFee: number;
  adminFee: number;
  /**
   * Catatan singkat tentang variasi fee platform ini.
   * Ditampilkan di bawah platform selector sebagai konteks untuk user.
   */
  feeNote: string;
};

/**
 * Preset fee marketplace untuk seller reguler (non-Mall) Indonesia.
 *
 * ⚠️  Fee marketplace berubah sewaktu-waktu dan bervariasi berdasarkan:
 *     kategori produk, tier seller, dan program promo yang diikuti.
 *
 * Sumber referensi (per Mei 2026):
 * - Shopee ID Seller Centre: seller.shopee.co.id
 * - Tokopedia Seller: seller.tokopedia.com
 * - TikTok Shop Seller Centre: seller-id.tiktok.com
 * - Lazada Seller Centre: sellercenter.lazada.co.id
 *
 * Selalu verifikasi fee aktual di Seller Centre masing-masing platform
 * sebelum menetapkan harga jual.
 */
export const marketplacePlatforms: Platform[] = [
  {
    label: "Shopee",
    serviceFee: 2.0,
    adminFee: 2.0,
    feeNote: "Estimasi seller reguler. Bervariasi 2–8% tergantung kategori & tier seller.",
  },
  {
    label: "Tokopedia",
    serviceFee: 1.8,
    adminFee: 1.0,
    feeNote: "Estimasi seller reguler. Bervariasi 1.8–5.5% tergantung kategori produk.",
  },
  {
    label: "TikTok Shop",
    serviceFee: 1.8,
    adminFee: 3.0,
    feeNote: "Estimasi seller reguler. Bervariasi 1.8–8% tergantung kategori & program afiliasi.",
  },
  {
    label: "Lazada",
    serviceFee: 2.0,
    adminFee: 2.0,
    feeNote: "Estimasi seller reguler. Bervariasi 2–6.5% tergantung kategori produk.",
  },
  {
    label: "Custom",
    serviceFee: 0,
    adminFee: 0,
    feeNote: "Masukkan fee aktual dari Seller Centre platform kamu.",
  },
];

// ─── Analytics event tracking ─────────────────────────────────────────────────

/** Fire a lightweight client-side analytics event (no-op if gtag not loaded) */
export function trackToolEvent(
  event: "tool_visited" | "tool_calculated" | "tool_conversion_clicked",
  toolSlug: string,
  extra?: Record<string, string>
) {
  if (typeof window === "undefined") return;
  try {
    // Google Analytics 4 via gtag
    type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };
    const gtagFn = (window as GtagWindow).gtag;
    if (typeof gtagFn === "function") {
      gtagFn("event", event, {
        tool_slug: toolSlug,
        ...extra,
      });
    }
    // Fallback: custom dataLayer (GTM)
    const dl = (window as Window & { dataLayer?: unknown[] }).dataLayer;
    if (Array.isArray(dl)) {
      dl.push({ event, tool_slug: toolSlug, ...extra });
    }
  } catch {
    // silently ignore tracking errors
  }
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

export function formatRupiah(value: number): string {
  if (!isFinite(value)) return "Rp 0";
  return (
    "Rp " +
    Math.round(value)
      .toLocaleString("id-ID")
  );
}

export function formatPct(value: number, decimals = 1): string {
  if (!isFinite(value)) return "0,0%";
  return value.toFixed(decimals).replace(".", ",") + "%";
}

export function formatMultiplier(value: number): string {
  if (!isFinite(value)) return "0,00x";
  return value.toFixed(2).replace(".", ",") + "x";
}

export function safeNum(val: string | number, fallback = 0): number {
  if (typeof val === "number") return isFinite(val) ? val : fallback;
  // Strip Indonesian thousand-separator dots, then normalise decimal comma → dot
  const cleaned = String(val).replace(/\./g, "").replace(/,/g, ".");
  const n = parseFloat(cleaned);
  return isFinite(n) ? n : fallback;
}

export function safeDivide(num: number, den: number, fallback = 0): number {
  if (den === 0 || !isFinite(den)) return fallback;
  const result = num / den;
  return isFinite(result) ? result : fallback;
}
