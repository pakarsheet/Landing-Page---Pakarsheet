"use client";

import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef } from "./CalcInputPanel";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-kenaikan-harga";

const defaultVals = {
  hargaLama:       "80000",
  hpp:             "45000",
  biayaOps:        "5000",
  unitTerjualLama: "200",
  kenaikanPct:     "15",
  penurunanVolume: "10",
};

const fields: CalcFieldDef[] = [
  { id: "hargaLama",       label: "Harga Jual Saat Ini",         hint: "Harga yang berlaku sekarang",                          prefix: "Rp" },
  { id: "hpp",             label: "HPP / Modal per Unit",        hint: "Biaya pokok barang per unit",                          prefix: "Rp" },
  { id: "biayaOps",        label: "Biaya Operasional per Unit",  hint: "Packaging, ongkir, dan biaya lain per unit",           prefix: "Rp" },
  { id: "unitTerjualLama", label: "Volume Penjualan Saat Ini",   hint: "Rata-rata unit terjual per bulan dengan harga lama" },
  { id: "kenaikanPct",     label: "Rencana Kenaikan Harga (%)",  hint: "Berapa persen harga akan dinaikkan",                   suffix: "%" },
  { id: "penurunanVolume", label: "Estimasi Penurunan Volume (%)",hint: "Perkiraan berapa persen penjualan akan turun setelah naik harga", suffix: "%" },
];

export function KalkulatorKenaikanHarga() {
  const { vals, resetKey, reset, update } = useCalcTracking(SLUG, defaultVals);

  const hargaLama       = Math.max(0, safeNum(vals.hargaLama));
  const hpp             = Math.max(0, safeNum(vals.hpp));
  const biayaOps        = Math.max(0, safeNum(vals.biayaOps));
  const unitLama        = Math.max(1, safeNum(vals.unitTerjualLama, 1));
  const kenaikanPct     = Math.min(200, Math.max(0, safeNum(vals.kenaikanPct)));
  const penurunanVol    = Math.min(100, Math.max(0, safeNum(vals.penurunanVolume)));

  const totalModal      = hpp + biayaOps;
  const hargaBaru       = hargaLama * (1 + kenaikanPct / 100);
  const unitBaru        = unitLama * (1 - penurunanVol / 100);

  // Kondisi lama
  const profitUnitLama  = hargaLama - totalModal;
  const marginLama      = safeDivide(profitUnitLama, hargaLama) * 100;
  const omzetLama       = hargaLama * unitLama;
  const profitTotalLama = profitUnitLama * unitLama;

  // Kondisi baru
  const profitUnitBaru  = hargaBaru - totalModal;
  const marginBaru      = safeDivide(profitUnitBaru, hargaBaru) * 100;
  const omzetBaru       = hargaBaru * unitBaru;
  const profitTotalBaru = profitUnitBaru * unitBaru;

  // Delta
  const deltaOmzet      = omzetBaru - omzetLama;
  const deltaProfit     = profitTotalBaru - profitTotalLama;
  const deltaMargin     = marginBaru - marginLama;
  const worthIt         = profitTotalBaru >= profitTotalLama;

  // Break-even: berapa persen penurunan volume yang masih oke
  const bepPenurunan    = profitUnitBaru > 0
    ? Math.max(0, (1 - safeDivide(profitTotalLama, profitUnitBaru * unitLama)) * 100)
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={fields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        warning={
          !worthIt && hargaLama > 0
            ? { show: true, message: `Dengan penurunan volume ${formatPct(penurunanVol)}, total profit justru turun ${formatRupiah(Math.abs(deltaProfit))}. Pertimbangkan kenaikan lebih kecil atau strategi retensi pelanggan.` }
            : undefined
        }
        summary={[
          { label: "Harga Baru",    value: formatRupiah(hargaBaru) },
          { label: "Delta Profit",  value: (deltaProfit >= 0 ? "+" : "") + formatRupiah(deltaProfit), valueColor: deltaProfit >= 0 ? "text-green-600" : "text-red-600" },
        ]}
      />

      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Margin Setelah Naik Harga"
          value={formatPct(marginBaru)}
          subtitle={`Naik dari ${formatPct(marginLama)} → ${formatPct(marginBaru)} (+${formatPct(deltaMargin)})`}
          {...marginStatus(marginBaru)}
        />

        {/* Perbandingan sebelum vs sesudah */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Sebelum vs Sesudah
            </p>
          </div>
          <div className="grid grid-cols-3 gap-px bg-line">
            <div className="bg-white px-4 py-3">
              <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.06em] text-muted/60">Metrik</p>
            </div>
            <div className="bg-white px-4 py-3 text-center">
              <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.06em] text-muted/60">Sebelum</p>
            </div>
            <div className="bg-white px-4 py-3 text-center">
              <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.06em] text-cobalt">Sesudah</p>
            </div>
          </div>
          {[
            { label: "Harga Jual",    before: formatRupiah(hargaLama),       after: formatRupiah(hargaBaru) },
            { label: "Volume/Bulan",  before: `${Math.round(unitLama).toLocaleString("id-ID")} unit`, after: `${Math.round(unitBaru).toLocaleString("id-ID")} unit` },
            { label: "Margin",        before: formatPct(marginLama),         after: formatPct(marginBaru) },
            { label: "Omzet/Bulan",   before: formatRupiah(omzetLama),       after: formatRupiah(omzetBaru) },
            { label: "Profit/Bulan",  before: formatRupiah(profitTotalLama), after: formatRupiah(profitTotalBaru) },
          ].map(({ label, before, after }) => (
            <div key={label} className="grid grid-cols-3 gap-px border-t border-line bg-line">
              <div className="bg-white px-4 py-3">
                <span className="font-secondary text-xs text-muted">{label}</span>
              </div>
              <div className="bg-white px-4 py-3 text-center">
                <span className="font-secondary text-xs font-semibold text-ink">{before}</span>
              </div>
              <div className="bg-white px-4 py-3 text-center">
                <span className={`font-secondary text-xs font-semibold ${worthIt ? "text-green-600" : "text-orange-600"}`}>{after}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Analisis tambahan */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">Analisis</p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Delta Omzet/Bulan",          value: (deltaOmzet >= 0 ? "+" : "") + formatRupiah(deltaOmzet),   warn: deltaOmzet < 0 },
              { label: "Delta Profit/Bulan",         value: (deltaProfit >= 0 ? "+" : "") + formatRupiah(deltaProfit), warn: deltaProfit < 0 },
              { label: "Penurunan volume maks. aman",value: formatPct(bepPenurunan),                                    warn: penurunanVol > bepPenurunan },
              { label: "Keputusan",                  value: worthIt ? "Layak naik harga ✓" : "Perlu evaluasi ulang ✗", warn: !worthIt },
            ].map(({ label, value, warn }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className={`font-secondary text-sm font-semibold ${warn ? "text-red-600" : "text-green-600"}`}>{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer note="Estimasi penurunan volume bersifat asumsi. Lakukan survei atau A/B test harga kecil-kecilan sebelum menaikkan harga secara massal." />
      </div>
    </div>
  );
}
