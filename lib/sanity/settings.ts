import { client } from "./client";
import { siteSettingsQuery, type SanitySiteSettings } from "./queries";

// Fallback jika belum ada dokumen di Sanity
const FALLBACK: SanitySiteSettings = {
  whatsappNumber: "6280000000000",
  whatsappMessage:
    "Halo Pakarsheet, saya ingin tahu lebih lanjut tentang produknya 😊",
};

export async function getSiteSettings(): Promise<SanitySiteSettings> {
  try {
    const data = await client.fetch<SanitySiteSettings | null>(
      siteSettingsQuery,
      {},
      // Tidak cache — selalu fresh agar perubahan admin langsung terasa
      { next: { revalidate: 60 } }
    );
    return data ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/** Bangun URL wa.me dari settings */
export function buildWaUrl(settings: SanitySiteSettings): string {
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappMessage
  )}`;
}
