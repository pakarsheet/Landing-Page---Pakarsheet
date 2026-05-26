"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import {
  formatRupiah, formatPct, formatMultiplier, safeNum, safeDivide,
  inputClass, trackToolEvent,
} from "@/lib/tools";
import { ResultCard, adEfficiencyStatus } from "@/components/ui/ResultCard";

const SLUG = "kalkulator-efektivitas-iklan";

// Kanal iklan yang umum dipakai seller Indonesia
const AD_CHANNELS = [
  { label: "Shopee Ads",    defaultRoasTarget: 3.0 },
  { label: "Tokopedia Ads", defaultRoasTarget: 3.0 },
  { label: "Meta Ads",      defaultRoasTarget: 3.5 },
  { label: "TikTok Ads",    defaultRoasTarget: 3.0 },
  { label: "Google Ads",    defaultRoasTarget: 4.0 },
  { label: "Custom",        defaultRoasTarget: 3.0 },
];

const defaultVals = {
  adSpend:     "500000",
  revenue:     "1800000",
  hpp:         "250000",
  qtyOrder:    "12",
  roasTarget:  "3.0",
  // Biaya tersembunyi yang sering dilupakan
  biayaPackaging: "2500",
  biayaOngkir:    "5000",
  feeMarketplace: "5",
};

export function KalkulatorEfektivitasIklan() {
  const [channelIdx, setChannelIdx] = useState(0);
  const [vals, setVals]             = useState(defaultVals);
  const [resetKey, setResetKey]     = useState(0);
  const visitedFired     = useRef(false);
  const interactionCount = useRef(0);
  const calculatedFired  = useRef(false);

  useEffect(() => {
    if (visitedFired.current) return;
    visitedFired.current = true;
    trackToolEvent("tool_visited", SLUG);
  }, []);

  const reset = () => {
    setVals(defaultVals);
    setChannelIdx(0);
    setResetKey((k) => k + 1);
  };

  const update = (id: string, value: string) => {
    setVals((prev) => ({ ...prev, [id]: value }));
    interactionCount.current += 1;
    if (interactionCount.current >= 3 && !calculatedFired.current) {
      calculatedFired.current = true;
      trackToolEvent("tool_calculated", SLUG);
    }
  };

  // Saat ganti channel, update roasTarget ke default channel tersebut
  const handleChannelChange = (idx: number) => {
    setChannelIdx(idx);
    setVals((prev) => ({
      ...prev,
      roasTarget: String(AD_CHANNELS[idx].defaultRoasTarget),
    }));
  };

  // ── Kalkulasi ──────────────────────────────────────────────────────────────
  const adSpend        = Math.max(0, safeNum(vals.adSpend));
  const revenue        = Math.max(0, safeNum(vals.revenue));
  const hpp            = Math.max(0, safeNum(vals.hpp));
  const qtyOrder       = Math.max(1, safeNum(vals.qtyOrder, 1));
  const roasTarget     = Math.max(0.1, safeNum(vals.roasTarget, 3));
  const biayaPackaging = Math.max(0, safeNum(vals.biayaPackaging));
  const biayaOngkir    = Math.max(0, safeNum(vals.biayaOngkir));
  const feeMarketplace = Math.min(100, Math.max(0, safeNum(vals.feeMarketplace)));

  // Metrik dasar
  const roas = safeDivide(revenue, adSpend);
  const cpa  = safeDivide(adSpend, qtyOrder);
  const aov  = safeDivide(revenue, qtyOrder);

  // Biaya tersembunyi per order
  const feeNominalPerOrder = aov * (feeMarketplace / 100);
  const biayaTersembunyi   = biayaPackaging + biayaOngkir + feeNominalPerOrder;

  // Laba dengan memperhitungkan semua biaya
  const totalHPP           = hpp * qtyOrder;
  const totalBiayaTersembunyi = biayaTersembunyi * qtyOrder;
  const labaKotor          = revenue - totalHPP;
  const labaBersih         = labaKotor - adSpend - totalBiayaTersembunyi;
  const marginBersih       = safeDivide(labaBersih, revenue) * 100;

  // ROAS minimum agar break-even (labaBersih = 0)
  // revenue = totalHPP + adSpend + totalBiayaTersembunyi
  // revenue - totalHPP - totalBiayaTersembunyi = adSpend
  // Karena biayaTersembunyi proporsional dengan revenue (fee marketplace), kita hitung iteratif
  // Simplifikasi: asumsikan biayaPackaging + biayaOngkir tetap, fee proporsional
  const biayaTetapPerOrder = biayaPackaging + biayaOngkir;
  const rasioHPP           = safeDivide(hpp, aov);
  const rasioFee           = feeMarketplace / 100;
  // BEP: revenue*(1 - rasioHPP - rasioFee) = adSpend + biayaTetapPerOrder*qtyOrder
  const denomBEP           = 1 - rasioHPP - rasioFee;
  const roasBEP            = denomBEP > 0
    ? safeDivide(adSpend + biayaTetapPerOrder * qtyOrder, adSpend) * (1 / denomBEP) * safeDivide(adSpend, revenue) * roas
    : 0;
  // Cara lebih langsung: roasBEP = revenue_bep / adSpend, revenue_bep = (adSpend + biayaTetap*qty) / (1 - rasioHPP - rasioFee)
  const revenueBEP         = denomBEP > 0
    ? safeDivide(adSpend + biayaTetapPerOrder * qtyOrder, denomBEP)
    : 0;
  const roasMinimum        = safeDivide(revenueBEP, adSpend);

  // Maksimal budget iklan yang masih profitable (dengan revenue & qty tetap)
  const maxAdSpend = Math.max(0, labaKotor - totalBiayaTersembunyi);

  // Apakah mencapai target ROAS?
  const targetTercapai = roas >= roasTarget;
  const selisihROAS    = roas - roasTarget;

  // Warning: revenue lebih kecil dari HPP
  const hppMelebihiRevenue = totalHPP > revenue;

  const fields: { id: keyof typeof defaultVals; label: string; prefix?: string; suffix?: string; min?: number; hint?: string }[] = [
    { id: "adSpend",     label: "Total Budget Iklan",       prefix: "Rp", hint: "Total pengeluaran iklan dalam periode ini." },
    { id: "revenue",     label: "Revenue dari Iklan",       prefix: "Rp", hint: "Total omzet penjualan yang dihasilkan dari iklan." },
    { id: "hpp",         label: "HPP / Modal per Produk",   prefix: "Rp", hint: "Biaya pokok barang per unit, tidak termasuk iklan." },
    { id: "qtyOrder",    label: "Jumlah Order",             min: 1,       hint: "Total transaksi sukses dari iklan ini." },
    { id: "roasTarget",  label: "Target ROAS",              suffix: "x",  hint: "ROAS minimum yang kamu anggap iklan ini layak jalan." },
  ];

  const hiddenCostFields: { id: keyof typeof defaultVals; label: string; prefix?: string; suffix?: string; hint?: string }[] = [
    { id: "biayaPackaging",  label: "Packaging per Order",       prefix: "Rp", hint: "Biaya kemasan per transaksi." },
    { id: "biayaOngkir",     label: "Subsidi Ongkir per Order",  prefix: "Rp", hint: "Biaya ongkir yang kamu tanggung per transaksi." },
    { id: "feeMarketplace",  label: "Fee Marketplace",           suffix: "%",  hint: "Persentase komisi platform dari harga jual." },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* ── Inputs ── */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-primary text-xl font-semibold tracking-[-0.4px] text-ink">
            Parameter Input
          </h2>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset kalkulator efektivitas iklan ke nilai default"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        {/* Channel selector */}
        <div className="mt-5">
          <p className="mb-2 font-secondary text-sm font-semibold text-ink">Kanal Iklan</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih kanal iklan">
            {AD_CHANNELS.map((ch, i) => (
              <button
                key={ch.label}
                type="button"
                onClick={() => handleChannelChange(i)}
                aria-pressed={channelIdx === i}
                className={`rounded-full border px-4 py-1.5 font-secondary text-sm font-semibold transition ${
                  channelIdx === i
                    ? "border-cobalt bg-cobalt text-white"
                    : "border-line bg-white text-ink hover:border-cobalt hover:text-cobalt"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main fields */}
        <div key={`main-${resetKey}`} className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                {f.label}
              </label>
              {f.hint && (
                <p id={`${f.id}-hint`} className="mb-1.5 font-secondary text-xs text-muted">
                  {f.hint}
                </p>
              )}
              <div className={inputClass}>
                {f.prefix && (
                  <span className="mr-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">{f.prefix}</span>
                )}
                <input
                  id={f.id}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  min={f.min ?? 0}
                  value={vals[f.id]}
                  onChange={(e) => update(f.id, e.target.value)}
                  aria-describedby={f.hint ? `${f.id}-hint` : undefined}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
                {f.suffix && (
                  <span className="ml-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">{f.suffix}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Biaya tersembunyi */}
        <p className="mt-6 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
          Biaya Tersembunyi per Order
        </p>
        <p className="mt-1 font-secondary text-xs text-muted">
          Sering dilupakan saat hitung profit iklan — padahal langsung memotong laba.
        </p>
        <div key={`hidden-${resetKey}`} className="mt-3 grid gap-4 sm:grid-cols-3">
          {hiddenCostFields.map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                {f.label}
              </label>
              {f.hint && (
                <p id={`${f.id}-hint`} className="mb-1.5 font-secondary text-xs text-muted">
                  {f.hint}
                </p>
              )}
              <div className={inputClass}>
                {f.prefix && (
                  <span className="mr-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">{f.prefix}</span>
                )}
                <input
                  id={f.id}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  min={0}
                  value={vals[f.id]}
                  onChange={(e) => update(f.id, e.target.value)}
                  aria-describedby={f.hint ? `${f.id}-hint` : undefined}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
                {f.suffix && (
                  <span className="ml-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">{f.suffix}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Warning: HPP melebihi revenue */}
        {hppMelebihiRevenue && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <p className="font-secondary text-sm text-orange-700">
              Total HPP melebihi revenue — kamu menjual di bawah modal. Cek harga jual atau HPP produk.
            </p>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="Efektivitas Iklan"
          value={formatMultiplier(roas)}
          subtitle={`Target: ${formatMultiplier(roasTarget)} · ${targetTercapai ? `Lebih ${formatMultiplier(Math.abs(selisihROAS))}` : `Kurang ${formatMultiplier(Math.abs(selisihROAS))}`}`}
          {...adEfficiencyStatus(roas, roasTarget)}
        />

        {/* Metrik utama */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Metrik Iklan
          </p>
          <ul className="space-y-4">
            {[
              { label: "ROAS Aktual",          value: formatMultiplier(roas) },
              { label: "CPA (Biaya per Order)", value: formatRupiah(cpa) },
              { label: "AOV (Rata-rata Order)", value: formatRupiah(aov) },
              { label: "ROAS Minimum BEP",      value: formatMultiplier(roasMinimum) },
              { label: "Maks. Budget Iklan",    value: formatRupiah(maxAdSpend) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Laba setelah semua biaya */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Laba Setelah Semua Biaya
          </p>
          <ul className="space-y-4">
            {[
              { label: "Revenue",                  value: formatRupiah(revenue),               highlight: false },
              { label: "Total HPP",                value: `− ${formatRupiah(totalHPP)}`,       highlight: false },
              { label: "Laba Kotor",               value: formatRupiah(labaKotor),             highlight: false },
              { label: "Budget Iklan",             value: `− ${formatRupiah(adSpend)}`,        highlight: false },
              { label: "Biaya Tersembunyi Total",  value: `− ${formatRupiah(totalBiayaTersembunyi)}`, highlight: false },
              { label: "Laba Bersih",              value: formatRupiah(labaBersih),            highlight: true  },
              { label: "Margin Bersih",            value: formatPct(marginBersih),             highlight: false },
            ].map(({ label, value, highlight }) => (
              <li
                key={label}
                className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0"
              >
                <span className={`font-secondary text-sm ${highlight ? "font-bold text-ink" : "text-muted"}`}>
                  {label}
                </span>
                <span className={`font-secondary text-sm font-semibold ${
                  highlight
                    ? labaBersih >= 0 ? "text-green-600" : "text-red-600"
                    : "text-ink"
                }`}>
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
