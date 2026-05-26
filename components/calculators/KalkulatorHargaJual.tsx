"use client";

import { useState } from "react";
import { formatRupiah, formatPct, safeNum, safeDivide, marketplacePlatforms } from "@/lib/tools";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef } from "./CalcInputPanel";
import { PlatformSelector } from "./PlatformSelector";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-harga-jual";

const defaultVals = {
  modalHpp:      "50000",
  targetMargin:  "20",
  subsidiOngkir: "0",
  biayaPack:     "2000",
  customService: "0",
  customAdmin:   "0",
};

const baseFields: CalcFieldDef[] = [
  { id: "modalHpp",      label: "Modal / HPP per Unit",     hint: "Biaya pokok barang per unit",                           prefix: "Rp" },
  { id: "targetMargin",  label: "Target Margin",            hint: "Persentase keuntungan dari harga jual",                 suffix: "%", max: 90 },
  { id: "subsidiOngkir", label: "Subsidi Ongkir per Unit",  hint: "Biaya ongkir yang kamu tanggung per transaksi",         prefix: "Rp" },
  { id: "biayaPack",     label: "Biaya Packaging per Unit", hint: "Kardus, bubble wrap, stiker per unit",                  prefix: "Rp" },
];

const customFields: CalcFieldDef[] = [
  { id: "customService", label: "Service Fee", hint: "Persentase service fee platform", suffix: "%" },
  { id: "customAdmin",   label: "Admin Fee",   hint: "Persentase admin fee platform",   suffix: "%" },
];

export function KalkulatorHargaJual() {
  const [platformIdx, setPlatformIdx] = useState(0);
  const { vals, resetKey, reset: baseReset, update } = useCalcTracking(SLUG, defaultVals);

  const reset = () => { baseReset(); setPlatformIdx(0); };

  const isCustom   = platformIdx === marketplacePlatforms.length - 1;
  const platform   = marketplacePlatforms[platformIdx];
  const serviceFee = isCustom ? Math.min(100, Math.max(0, safeNum(vals.customService))) : platform.serviceFee;
  const adminFee   = isCustom ? Math.min(100, Math.max(0, safeNum(vals.customAdmin)))   : platform.adminFee;

  const modalHpp      = Math.max(0, safeNum(vals.modalHpp));
  const targetMargin  = Math.min(90, Math.max(0, safeNum(vals.targetMargin)));
  const subsidiOngkir = Math.max(0, safeNum(vals.subsidiOngkir));
  const biayaPack     = Math.max(0, safeNum(vals.biayaPack));

  const totalModal   = modalHpp + subsidiOngkir + biayaPack;
  const feeRate      = (serviceFee + adminFee) / 100;
  const divisor      = 1 - feeRate - targetMargin / 100;
  const isImpossible = divisor <= 0;
  const hargaJual    = isImpossible ? 0 : safeDivide(totalModal, divisor);
  const feePlatform  = hargaJual * feeRate;
  const profitUnit   = hargaJual - totalModal - feePlatform;
  const actualMargin = safeDivide(profitUnit, hargaJual) * 100;

  const platformNote = !isCustom
    ? `Service fee ${serviceFee}% + Admin fee ${adminFee}% = ${(serviceFee + adminFee).toFixed(1)}% total — ${platform.feeNote}`
    : undefined;

  const activeFields = [...baseFields, ...(isCustom ? customFields : [])];

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={activeFields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        warning={
          isImpossible
            ? {
                show: true,
                message:
                  "Target margin + fee platform melebihi 100%. Turunkan target margin atau pilih platform dengan fee lebih rendah.",
              }
            : undefined
        }
        summary={[
          { label: "Total Modal",   value: formatRupiah(totalModal) },
          { label: "Fee Platform",  value: isImpossible ? "—" : formatRupiah(feePlatform) },
        ]}
      >
        <PlatformSelector
          platformIdx={platformIdx}
          onChange={setPlatformIdx}
          note={platformNote}
        />
      </CalcInputPanel>

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Harga Jual Minimum"
          value={isImpossible ? "—" : formatRupiah(hargaJual)}
          subtitle={isImpossible ? "Kombinasi tidak valid" : `Margin aktual: ${formatPct(actualMargin)}`}
          {...marginStatus(isImpossible ? 0 : actualMargin)}
        />

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Rincian Kalkulasi
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Potongan Fee Platform",  value: isImpossible ? "—" : formatRupiah(feePlatform) },
              { label: "Profit Bersih per Unit", value: isImpossible ? "—" : formatRupiah(profitUnit) },
              { label: "Total Modal per Unit",   value: formatRupiah(totalModal) },
              { label: "Total Fee Rate",         value: formatPct(feeRate * 100) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer note="Fee marketplace bervariasi per kategori, tier seller, dan program promo. Selalu cek Seller Centre platform kamu untuk angka terkini." />
      </div>
    </div>
  );
}
