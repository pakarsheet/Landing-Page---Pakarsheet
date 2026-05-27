"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Info } from "lucide-react";
import { trackToolEvent } from "@/lib/tools";

const SLUG = "tabel-fee-marketplace";

type FeeRow = {
  platform: string;
  kategori: string;
  serviceFee: string;
  adminFee: string;
  totalFee: string;
  catatan: string;
};

const feeData: FeeRow[] = [
  // Shopee
  { platform: "Shopee", kategori: "Fashion & Aksesoris",    serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler non-Mall" },
  { platform: "Shopee", kategori: "Elektronik",             serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler non-Mall" },
  { platform: "Shopee", kategori: "Makanan & Minuman",      serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler non-Mall" },
  { platform: "Shopee", kategori: "Kecantikan",             serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler non-Mall" },
  { platform: "Shopee", kategori: "Rumah & Dapur",          serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler non-Mall" },
  { platform: "Shopee", kategori: "Olahraga",               serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler non-Mall" },
  { platform: "Shopee", kategori: "Shopee Mall",            serviceFee: "3%",   adminFee: "5%",   totalFee: "8%",   catatan: "Khusus seller Mall" },
  // Tokopedia
  { platform: "Tokopedia", kategori: "Fashion & Aksesoris", serviceFee: "1.8%", adminFee: "1%",   totalFee: "2.8%", catatan: "Seller reguler" },
  { platform: "Tokopedia", kategori: "Elektronik",          serviceFee: "1.8%", adminFee: "1%",   totalFee: "2.8%", catatan: "Seller reguler" },
  { platform: "Tokopedia", kategori: "Makanan & Minuman",   serviceFee: "1.8%", adminFee: "1%",   totalFee: "2.8%", catatan: "Seller reguler" },
  { platform: "Tokopedia", kategori: "Kecantikan",          serviceFee: "1.8%", adminFee: "1%",   totalFee: "2.8%", catatan: "Seller reguler" },
  { platform: "Tokopedia", kategori: "Rumah & Dapur",       serviceFee: "1.8%", adminFee: "1%",   totalFee: "2.8%", catatan: "Seller reguler" },
  { platform: "Tokopedia", kategori: "Olahraga",            serviceFee: "1.8%", adminFee: "1%",   totalFee: "2.8%", catatan: "Seller reguler" },
  { platform: "Tokopedia", kategori: "Power Merchant",      serviceFee: "1.8%", adminFee: "3.7%", totalFee: "5.5%", catatan: "Seller Power Merchant" },
  // TikTok Shop
  { platform: "TikTok Shop", kategori: "Fashion & Aksesoris",  serviceFee: "1.8%", adminFee: "3%",   totalFee: "4.8%", catatan: "Seller reguler" },
  { platform: "TikTok Shop", kategori: "Elektronik",            serviceFee: "1.8%", adminFee: "3%",   totalFee: "4.8%", catatan: "Seller reguler" },
  { platform: "TikTok Shop", kategori: "Makanan & Minuman",     serviceFee: "1.8%", adminFee: "3%",   totalFee: "4.8%", catatan: "Seller reguler" },
  { platform: "TikTok Shop", kategori: "Kecantikan",            serviceFee: "1.8%", adminFee: "3%",   totalFee: "4.8%", catatan: "Seller reguler" },
  { platform: "TikTok Shop", kategori: "Rumah & Dapur",         serviceFee: "1.8%", adminFee: "3%",   totalFee: "4.8%", catatan: "Seller reguler" },
  { platform: "TikTok Shop", kategori: "Olahraga",              serviceFee: "1.8%", adminFee: "3%",   totalFee: "4.8%", catatan: "Seller reguler" },
  { platform: "TikTok Shop", kategori: "Program Afiliasi",      serviceFee: "1.8%", adminFee: "8%",   totalFee: "9.8%", catatan: "Jika menggunakan afiliator" },
  // Lazada
  { platform: "Lazada", kategori: "Fashion & Aksesoris",    serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Lazada", kategori: "Elektronik",             serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Lazada", kategori: "Makanan & Minuman",      serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Lazada", kategori: "Kecantikan",             serviceFee: "2%",   adminFee: "2.5%", totalFee: "4.5%", catatan: "Seller reguler" },
  { platform: "Lazada", kategori: "Rumah & Dapur",          serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Lazada", kategori: "Olahraga",               serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Lazada", kategori: "LazMall",                serviceFee: "2%",   adminFee: "4.5%", totalFee: "6.5%", catatan: "Khusus seller LazMall" },
  // Blibli
  { platform: "Blibli", kategori: "Fashion & Aksesoris",    serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Blibli", kategori: "Elektronik",             serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Blibli", kategori: "Makanan & Minuman",      serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Blibli", kategori: "Kecantikan",             serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Blibli", kategori: "Rumah & Dapur",          serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Blibli", kategori: "Olahraga",               serviceFee: "2%",   adminFee: "2%",   totalFee: "4%",   catatan: "Seller reguler" },
  { platform: "Blibli", kategori: "BlibliMall",             serviceFee: "2%",   adminFee: "3%",   totalFee: "5%",   catatan: "Khusus seller BlibliMall" },
];

const platforms = ["Semua", "Shopee", "Tokopedia", "TikTok Shop", "Lazada", "Blibli"];

const platformColors: Record<string, string> = {
  Shopee:          "bg-orange-50 text-orange-700 border-orange-200",
  Tokopedia:       "bg-green-50 text-green-700 border-green-200",
  "TikTok Shop":   "bg-slate-50 text-slate-700 border-slate-200",
  Lazada:          "bg-blue-50 text-blue-700 border-blue-200",
  Blibli:          "bg-sky text-cobalt border-line",
};

export function TabelFeeMarketplace() {
  const [activePlatform, setActivePlatform] = useState("Semua");
  const [search, setSearch]                 = useState("");
  const visitedFired = useRef(false);

  useEffect(() => {
    if (visitedFired.current) return;
    visitedFired.current = true;
    trackToolEvent("tool_visited", SLUG);
  }, []);

  const filtered = feeData.filter((row) => {
    const matchPlatform = activePlatform === "Semua" || row.platform === activePlatform;
    const matchSearch   = search === "" ||
      row.platform.toLowerCase().includes(search.toLowerCase()) ||
      row.kategori.toLowerCase().includes(search.toLowerCase());
    return matchPlatform && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-sky/40 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" />
        <p className="font-secondary text-sm text-muted">
          Data fee ini adalah estimasi untuk seller reguler per Mei 2026. Fee aktual bervariasi berdasarkan kategori produk, tier seller, dan program yang diikuti. Selalu verifikasi di Seller Centre masing-masing platform sebelum menetapkan harga jual.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter platform">
          {platforms.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setActivePlatform(p)}
              aria-pressed={activePlatform === p}
              className={`rounded-full border px-4 py-1.5 font-secondary text-sm font-semibold transition ${
                activePlatform === p
                  ? "border-cobalt bg-cobalt text-white"
                  : "border-line bg-white text-ink hover:border-cobalt hover:text-cobalt"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 shadow-card focus-within:border-cobalt focus-within:ring-1 focus-within:ring-cobalt/20 sm:w-56">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent font-secondary text-sm text-ink outline-none placeholder:text-muted"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-line bg-sky/30">
                <th className="px-5 py-3.5 text-left font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">Platform</th>
                <th className="px-5 py-3.5 text-left font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">Kategori</th>
                <th className="px-5 py-3.5 text-right font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">Service Fee</th>
                <th className="px-5 py-3.5 text-right font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">Admin Fee</th>
                <th className="px-5 py-3.5 text-right font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">Total Fee</th>
                <th className="px-5 py-3.5 text-left font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center font-secondary text-sm text-muted">
                    Tidak ada data yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-line last:border-0 hover:bg-sky/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-secondary text-xs font-bold ${platformColors[row.platform] ?? "bg-sky text-cobalt border-line"}`}>
                        {row.platform}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-secondary text-sm text-ink">{row.kategori}</td>
                    <td className="px-5 py-4 text-right font-secondary text-sm text-muted">{row.serviceFee}</td>
                    <td className="px-5 py-4 text-right font-secondary text-sm text-muted">{row.adminFee}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-secondary text-sm font-bold text-ink">{row.totalFee}</span>
                    </td>
                    <td className="px-5 py-4 font-secondary text-xs text-muted">{row.catatan}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-line px-5 py-3">
          <p className="font-secondary text-xs text-muted">
            Menampilkan {filtered.length} dari {feeData.length} data · Terakhir diperbarui: Mei 2026
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Fee belum termasuk", body: "Biaya program gratis ongkir, voucher toko, dan biaya iklan dalam platform — hitung terpisah." },
          { title: "Verifikasi selalu", body: "Fee bisa berubah kapan saja. Cek Seller Centre sebelum set harga jual untuk event besar." },
          { title: "Hitung total beban", body: "Gunakan Kalkulator Profit Marketplace kami untuk hitung profit bersih setelah semua biaya." },
        ].map(({ title, body }) => (
          <div key={title} className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <p className="font-secondary text-sm font-bold text-ink">{title}</p>
            <p className="mt-1 font-secondary text-sm leading-[1.5] text-muted">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
