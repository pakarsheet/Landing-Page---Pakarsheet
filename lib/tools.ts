import {
  Calculator,
  TrendingUp,
  ShoppingCart,
  Megaphone,
  Tag,
  Store,
} from "lucide-react";

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
  relatedShopSlug?: string;
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
    keywords: [
      "kalkulator margin keuntungan",
      "hitung margin profit",
      "break even point",
      "markup harga",
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
    keywords: [
      "kalkulator HPP",
      "harga pokok produksi",
      "hitung HPP online",
      "biaya produksi per unit",
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
    keywords: [
      "kalkulator harga jual marketplace",
      "harga jual shopee tokopedia",
      "fee marketplace indonesia",
      "hitung harga jual online",
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
    keywords: [
      "kalkulator ROAS",
      "hitung return on ad spend",
      "ROAS iklan facebook",
      "CPA cost per acquisition",
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
    keywords: [
      "kalkulator diskon bertingkat",
      "hitung diskon 20 10 persen",
      "diskon compound",
      "harga setelah diskon voucher",
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
    keywords: [
      "kalkulator profit marketplace",
      "hitung profit bersih seller",
      "profit shopee tokopedia",
      "margin bersih jualan online",
    ],
  },
];

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
  const n = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, "."));
  return isFinite(n) ? n : fallback;
}

export function safeDivide(num: number, den: number, fallback = 0): number {
  if (den === 0 || !isFinite(den)) return fallback;
  const result = num / den;
  return isFinite(result) ? result : fallback;
}
