"use client";

import { useState } from "react";
import { formatRupiah, formatPct, safeNum, safeDivide, marketplacePlatforms } from "@/lib/tools";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef, inputWrap, inputBase, prefixCls } from "./CalcInputPanel";
import { PlatformSelector } from "./PlatformSelector";
import { ResultCard, profitStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";
import { formatThousands } from "@/lib/formatInput";

const SLUG = "kalkulator-profit-marketplace";

const defaultVals = {
  hargaJual:       "120000",
  hpp:             "65000",
  qty:             "25",
  pack:            "2500",
  ongkirSeller:    "5000",
  voucherSeller:   "10000",
  adSpendPerOrder: "8000",
  biayaFixed:      "1000",
  customFee:       "5",
};

const baseFields: CalcFieldDef[] = [
  { id: "hargaJual",       label: "Harga Jual per Unit",        hint: "Harga yang tertera di listing produk",                 prefix: "Rp" },
  { id: "hpp",             label: "HPP / Modal per Unit",       hint: "Biaya pokok barang per unit",                          prefix: "Rp" },
  { id: "qty",             label: "Jumlah Terjual",             hint: "Target atau aktual penjualan untuk hitung total",       min: 1 },
  { id: "pack",            label: "Packaging per Unit",         hint: "Kardus, bubble wrap, stiker per unit",                 prefix: "Rp" },
  { id: "ongkirSeller",    label: "Subsidi Ongkir per Unit",    hint: "Biaya ongkir yang kamu tanggung per transaksi",        prefix: "Rp" },
  { id: "voucherSeller",   label: "Voucher / Diskon Seller",    hint: "Nominal diskon produk yang ditanggung toko kamu",      prefix: "Rp" },
  { id: "adSpendPerOrder", label: "Biaya Iklan per Order (CPA)",hint: "Rata-rata biaya iklan untuk menghasilkan 1 transaksi", prefix: "Rp" },
  { id: "biayaFixed",      label: "Biaya Admin Tetap per Order",hint: "Biaya penanganan tetap per transaksi",                 prefix: "Rp" },
];

export function KalkulatorProfitMarketplace() {
  const [platformIdx, setPlatformIdx] = useState(0);
  const { vals, resetKey, reset: baseReset, update } = useCalcTracking(SLUG, defaultVals);

  const reset = () => { baseReset(); setPlatformIdx(0); };

  const isCustom = platformIdx === marketplacePlatforms.length - 1;
  const platform = marketplacePlatforms[platformIdx];
  const feePlatformPct = isCustom
    ? Math.min(100, Math.max(0, safeNum(vals.customFee)))
    : platform.serviceFee + platform.adminFee;

  const hargaJual       = Math.max(0, safeNum(vals.hargaJual));
  const hpp             = Math.max(0, safeNum(vals.hpp));
  const qty             = Math.max(1, safeNum(vals.qty, 1));
  const pack            = Math.max(0, safeNum(vals.pack));
  const ongkirSeller    = Math.max(0, safeNum(vals.ongkirSeller));
  const voucherSeller   = Math.max(0, safeNum(vals.voucherSeller));
  const adSpendPerOrder = Math.max(0, safeNum(vals.adSpendPerOrder));
  const biayaFixed      = Math.max(0, safeNum(vals.biayaFixed));

  const platformFeeUnit   = hargaJual * (Math.min(100, feePlatformPct) / 100);
  const opsCostUnit       = pack + ongkirSeller + voucherSeller + adSpendPerOrder + biayaFixed;
  const totalBebanPerUnit = hpp + platformFeeUnit + opsCostUnit;
  const profitUnit        = hargaJual - totalBebanPerUnit;
  const marginPct         = safeDivide(profitUnit, hargaJual) * 100;
  const markupPct         = safeDivide(profitUnit, totalBebanPerUnit) * 100;

  const omzetTotal       = hargaJual * qty;
  const totalProfit      = profitUnit * qty;
  const totalPlatformFee = platformFeeUnit * qty;
  const totalBeban       = totalBebanPerUnit * qty;

  const ratePlatform = feePlatformPct / 100;
  const hargaBEP     = ratePlatform < 1 ? safeDivide(hpp + opsCostUnit, 1 - ratePlatform) : 0;
  const maxAdSpend   = Math.max(0, hargaJual - hpp - platformFeeUnit - pack - ongkirSeller - voucherSeller - biayaFixed);

  const platformNote = !isCustom
    ? `Total fee ${feePlatformPct.toFixed(1)}% — ${platform.feeNote}`
    : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={baseFields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        summary={[
          { label: "Omzet Total",  value: formatRupiah(omzetTotal) },
          {
            label: "Total Profit",
            value: formatRupiah(totalProfit),
            valueColor: totalProfit >= 0 ? "text-green-600" : "text-red-600",
          },
        ]}
      >
        <PlatformSelector
          platformIdx={platformIdx}
          onChange={setPlatformIdx}
          note={platformNote}
        />

        {/* Custom fee field — only shown when "Custom" platform is selected */}
        {isCustom && (
          <div className="border-b border-line px-6 pb-5">
            <div>
              <label htmlFor="customFee" className="mb-1 block font-secondary text-sm font-semibold text-ink">
                Fee Marketplace
              </label>
              <p className="mb-2 font-secondary text-xs text-muted/70">Total persentase fee platform</p>
              <div className={inputWrap}>
                <input
                  id="customFee"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={vals.customFee}
                  onChange={(e) => update("customFee", e.target.value)}
                  className={inputBase}
                />
                <span className={prefixCls} aria-hidden="true">%</span>
              </div>
            </div>
          </div>
        )}
      </CalcInputPanel>

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Profit Bersih per Unit"
          value={formatRupiah(profitUnit)}
          subtitle={`Margin: ${formatPct(marginPct)} · Markup: ${formatPct(markupPct)}`}
          {...profitStatus(profitUnit, marginPct)}
        />

        {/* Per-unit detail */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">Per Unit</p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Margin Bersih",          value: formatPct(marginPct) },
              { label: "Markup Bersih",           value: formatPct(markupPct) },
              { label: "Fee Platform",            value: formatRupiah(platformFeeUnit) },
              { label: "Total Biaya Ops",         value: formatRupiah(opsCostUnit) },
              { label: "Harga BEP Minimum",       value: formatRupiah(hargaBEP) },
              { label: "Maks. Biaya Iklan/Order", value: formatRupiah(maxAdSpend) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total summary */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Total ({qty.toLocaleString("id-ID")} unit)
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Omzet Total",         value: formatRupiah(omzetTotal),       colored: false },
              { label: "Total Profit Bersih", value: formatRupiah(totalProfit),      colored: true },
              { label: "Total Fee Platform",  value: formatRupiah(totalPlatformFee), colored: false },
              { label: "Total Beban",         value: formatRupiah(totalBeban),       colored: false },
            ].map(({ label, value, colored }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span
                  className={`font-secondary text-sm font-semibold ${
                    colored
                      ? totalProfit >= 0
                        ? "text-green-600"
                        : "text-red-600"
                      : "text-ink"
                  }`}
                >
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer note="Fee marketplace bervariasi per kategori, tier seller, dan program promo. Selalu verifikasi fee aktual di Seller Centre." />
      </div>
    </div>
  );
}
