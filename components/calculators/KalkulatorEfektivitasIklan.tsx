"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  formatRupiah, formatPct, formatMultiplier, safeNum, safeDivide,
} from "@/lib/tools";
import { formatThousands } from "@/lib/formatInput";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef, inputWrap, inputBase, prefixCls } from "./CalcInputPanel";
import { ResultCard, adEfficiencyStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-efektivitas-iklan";

const AD_CHANNELS = [
  { label: "Shopee Ads",    defaultRoasTarget: 3.0 },
  { label: "Tokopedia Ads", defaultRoasTarget: 3.0 },
  { label: "Meta Ads",      defaultRoasTarget: 3.5 },
  { label: "TikTok Ads",    defaultRoasTarget: 3.0 },
  { label: "Google Ads",    defaultRoasTarget: 4.0 },
  { label: "Custom",        defaultRoasTarget: 3.0 },
];

const defaultVals = {
  adSpend:        "500000",
  revenue:        "1800000",
  hpp:            "250000",
  qtyOrder:       "12",
  roasTarget:     "3.0",
  biayaPackaging: "2500",
  biayaOngkir:    "5000",
  feeMarketplace: "5",
};

const mainFields: CalcFieldDef[] = [
  { id: "adSpend",    label: "Total Budget Iklan",     hint: "Total pengeluaran iklan dalam periode ini",                prefix: "Rp" },
  { id: "revenue",    label: "Revenue dari Iklan",     hint: "Total omzet penjualan yang dihasilkan dari iklan",         prefix: "Rp" },
  { id: "hpp",        label: "HPP / Modal per Produk", hint: "Biaya pokok barang per unit, tidak termasuk iklan",        prefix: "Rp" },
  { id: "qtyOrder",   label: "Jumlah Order",           hint: "Total transaksi sukses dari iklan ini" },
  { id: "roasTarget", label: "Target ROAS",            hint: "ROAS minimum yang kamu anggap iklan ini layak jalan",      suffix: "x" },
];

const hiddenFields: CalcFieldDef[] = [
  { id: "biayaPackaging", label: "Packaging per Order",      hint: "Biaya kemasan per transaksi",                       prefix: "Rp" },
  { id: "biayaOngkir",    label: "Subsidi Ongkir per Order", hint: "Biaya ongkir yang kamu tanggung per transaksi",     prefix: "Rp" },
  { id: "feeMarketplace", label: "Fee Marketplace",          hint: "Persentase komisi platform dari harga jual",        suffix: "%" },
];

export function KalkulatorEfektivitasIklan() {
  const [channelIdx, setChannelIdx] = useState(0);
  const { vals, resetKey, reset: baseReset, update } = useCalcTracking(SLUG, defaultVals);

  const reset = () => { baseReset(); setChannelIdx(0); };

  const handleChannelChange = (idx: number) => {
    setChannelIdx(idx);
    update("roasTarget", String(AD_CHANNELS[idx].defaultRoasTarget));
  };

  const adSpend        = Math.max(0, safeNum(vals.adSpend));
  const revenue        = Math.max(0, safeNum(vals.revenue));
  const hpp            = Math.max(0, safeNum(vals.hpp));
  const qtyOrder       = Math.max(1, safeNum(vals.qtyOrder, 1));
  const roasTarget     = Math.max(0.1, safeNum(vals.roasTarget, 3));
  const biayaPackaging = Math.max(0, safeNum(vals.biayaPackaging));
  const biayaOngkir    = Math.max(0, safeNum(vals.biayaOngkir));
  const feeMarketplace = Math.min(100, Math.max(0, safeNum(vals.feeMarketplace)));

  const roas = safeDivide(revenue, adSpend);
  const cpa  = safeDivide(adSpend, qtyOrder);
  const aov  = safeDivide(revenue, qtyOrder);

  const feeNominalPerOrder    = aov * (feeMarketplace / 100);
  const biayaTersembunyi      = biayaPackaging + biayaOngkir + feeNominalPerOrder;
  const totalHPP              = hpp * qtyOrder;
  const totalBiayaTersembunyi = biayaTersembunyi * qtyOrder;
  const labaKotor             = revenue - totalHPP;
  const labaBersih            = labaKotor - adSpend - totalBiayaTersembunyi;
  const marginBersih          = safeDivide(labaBersih, revenue) * 100;

  const biayaTetapPerOrder = biayaPackaging + biayaOngkir;
  const rasioHPP           = safeDivide(hpp, aov);
  const rasioFee           = feeMarketplace / 100;
  const denomBEP           = 1 - rasioHPP - rasioFee;
  const revenueBEP         = denomBEP > 0 ? safeDivide(adSpend + biayaTetapPerOrder * qtyOrder, denomBEP) : 0;
  const roasMinimum        = safeDivide(revenueBEP, adSpend);
  const maxAdSpend         = Math.max(0, labaKotor - totalBiayaTersembunyi);

  const targetTercapai     = roas >= roasTarget;
  const selisihROAS        = roas - roasTarget;
  const hppMelebihiRevenue = totalHPP > revenue;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={mainFields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        warning={
          hppMelebihiRevenue
            ? {
                show: true,
                message:
                  "Total HPP melebihi revenue — kamu menjual di bawah modal. Cek harga jual atau HPP produk.",
              }
            : undefined
        }
        summary={[
          { label: "CPA", value: formatRupiah(cpa) },
          { label: "AOV", value: formatRupiah(aov) },
        ]}
      >
        {/* Channel selector */}
        <div className="border-b border-line px-6 py-5">
          <p className="mb-3 font-secondary text-sm font-semibold text-ink">Kanal Iklan</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih kanal iklan">
            {AD_CHANNELS.map((ch, i) => (
              <button
                key={ch.label}
                type="button"
                onClick={() => handleChannelChange(i)}
                aria-pressed={channelIdx === i}
                className={`rounded-full border px-4 py-1.5 font-secondary text-sm font-semibold transition ${
                  channelIdx === i
                    ? "border-cobalt bg-cobalt text-white shadow-card"
                    : "border-line bg-white text-ink hover:border-cobalt hover:text-cobalt"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Biaya tersembunyi section */}
        <div className="border-b border-line px-6 py-5">
          <p className="mb-1 font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
            Biaya Tersembunyi per Order
          </p>
          <p className="mb-4 font-secondary text-xs text-muted/70">
            Sering dilupakan saat hitung profit iklan — padahal langsung memotong laba.
          </p>
          <div key={`hidden-${resetKey}`} className="grid gap-5 sm:grid-cols-3">
            {hiddenFields.map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="mb-1 block font-secondary text-sm font-semibold text-ink">
                  {f.label}
                </label>
                <p className="mb-2 font-secondary text-xs text-muted/70">{f.hint}</p>
                <div className={inputWrap}>
                  {f.prefix && <span className={prefixCls} aria-hidden="true">{f.prefix}</span>}
                  <input
                    id={f.id}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    min={0}
                    value={f.prefix ? formatThousands(vals[f.id as keyof typeof defaultVals] ?? "") : (vals[f.id as keyof typeof defaultVals] ?? "")}
                    onChange={(e) => update(f.id, e.target.value)}
                    className={inputBase}
                  />
                  {f.suffix && <span className={prefixCls} aria-hidden="true">{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CalcInputPanel>

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Efektivitas Iklan"
          value={formatMultiplier(roas)}
          subtitle={`Target: ${formatMultiplier(roasTarget)} · ${
            targetTercapai
              ? `Lebih ${formatMultiplier(Math.abs(selisihROAS))}`
              : `Kurang ${formatMultiplier(Math.abs(selisihROAS))}`
          }`}
          {...adEfficiencyStatus(roas, roasTarget)}
        />

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Metrik Iklan
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "ROAS Aktual",          value: formatMultiplier(roas) },
              { label: "CPA (Biaya per Order)", value: formatRupiah(cpa) },
              { label: "AOV (Rata-rata Order)", value: formatRupiah(aov) },
              { label: "ROAS Minimum BEP",      value: formatMultiplier(roasMinimum) },
              { label: "Maks. Budget Iklan",    value: formatRupiah(maxAdSpend) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Laba Setelah Semua Biaya
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Revenue",                 value: formatRupiah(revenue),                      bold: false },
              { label: "Total HPP",               value: `− ${formatRupiah(totalHPP)}`,              bold: false },
              { label: "Laba Kotor",              value: formatRupiah(labaKotor),                    bold: false },
              { label: "Budget Iklan",            value: `− ${formatRupiah(adSpend)}`,               bold: false },
              { label: "Biaya Tersembunyi Total", value: `− ${formatRupiah(totalBiayaTersembunyi)}`, bold: false },
              { label: "Laba Bersih",             value: formatRupiah(labaBersih),                   bold: true },
              { label: "Margin Bersih",           value: formatPct(marginBersih),                    bold: false },
            ].map(({ label, value, bold }) => (
              <li
                key={label}
                className={`flex items-center justify-between gap-4 px-6 py-4 ${bold ? "bg-ink/[0.02]" : ""}`}
              >
                <span className={`font-secondary text-sm ${bold ? "font-bold text-ink" : "text-muted"}`}>
                  {label}
                </span>
                <span
                  className={`font-secondary text-sm font-semibold ${
                    bold ? (labaBersih >= 0 ? "text-green-600" : "text-red-600") : "text-ink"
                  }`}
                >
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer />
      </div>
    </div>
  );
}
