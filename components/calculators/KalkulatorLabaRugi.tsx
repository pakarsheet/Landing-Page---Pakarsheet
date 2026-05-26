"use client";

import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { formatThousands } from "@/lib/formatInput";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { inputWrap, inputBase, prefixCls } from "./CalcInputPanel";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";
import { Trash2, AlertTriangle } from "lucide-react";

const SLUG = "kalkulator-laba-rugi";

const defaultVals = {
  omzet:            "15000000",
  hpp:              "7500000",
  biayaSewa:        "1500000",
  biayaGaji:        "2000000",
  biayaIklan:       "500000",
  biayaOperasional: "300000",
  biayaLainnya:     "200000",
};

// KalkulatorLabaRugi has a custom two-section layout (Pemasukan / Pengeluaran)
// that doesn't map cleanly to CalcInputPanel's flat field grid.
// We reuse the shared inputWrap/inputBase/prefixCls constants and
// useCalcTracking hook, but render the panel structure manually.

type FieldDef = { id: keyof typeof defaultVals; label: string; hint: string };

const pemasukan: FieldDef[] = [
  { id: "omzet", label: "Total Omzet / Pendapatan",   hint: "Total uang masuk dari penjualan dalam periode ini" },
  { id: "hpp",   label: "HPP / Modal Barang Terjual", hint: "Total biaya pokok semua produk yang berhasil terjual" },
];

const pengeluaran: FieldDef[] = [
  { id: "biayaSewa",        label: "Biaya Sewa Tempat",       hint: "Sewa toko, gudang, atau kantor per bulan" },
  { id: "biayaGaji",        label: "Gaji Karyawan",           hint: "Total gaji semua karyawan bulan ini" },
  { id: "biayaIklan",       label: "Biaya Iklan & Marketing", hint: "Total pengeluaran iklan online maupun offline" },
  { id: "biayaOperasional", label: "Biaya Operasional Lain",  hint: "Listrik, internet, packaging, ongkir, dll" },
  { id: "biayaLainnya",     label: "Biaya Lain-lain",         hint: "Pengeluaran tidak terduga atau tidak masuk kategori di atas" },
];

function RpField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (id: string, val: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-secondary text-[15px] font-semibold text-ink">
        {label}
      </label>
      <p className="mb-2 font-secondary text-sm text-muted/60">{hint}</p>
      <p className="mb-2 font-secondary text-xs text-muted/70">{hint}</p>
      <div className={inputWrap}>
        <span className={prefixCls} aria-hidden="true">Rp</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          min={0}
          value={formatThousands(value)}
          onChange={(e) => onChange(id, e.target.value)}
          className={inputBase}
        />
      </div>
    </div>
  );
}

export function KalkulatorLabaRugi() {
  const { vals, resetKey, reset, update } = useCalcTracking(SLUG, defaultVals);

  const omzet            = Math.max(0, safeNum(vals.omzet));
  const hpp              = Math.max(0, safeNum(vals.hpp));
  const biayaSewa        = Math.max(0, safeNum(vals.biayaSewa));
  const biayaGaji        = Math.max(0, safeNum(vals.biayaGaji));
  const biayaIklan       = Math.max(0, safeNum(vals.biayaIklan));
  const biayaOperasional = Math.max(0, safeNum(vals.biayaOperasional));
  const biayaLainnya     = Math.max(0, safeNum(vals.biayaLainnya));

  const labaKotor       = omzet - hpp;
  const totalBiayaTetap = biayaSewa + biayaGaji + biayaIklan + biayaOperasional + biayaLainnya;
  const labaBersih      = labaKotor - totalBiayaTetap;
  const marginKotor     = safeDivide(labaKotor, omzet) * 100;
  const marginBersih    = safeDivide(labaBersih, omzet) * 100;
  const rasioHPP        = safeDivide(hpp, omzet) * 100;
  const rasioBeban      = safeDivide(totalBiayaTetap, omzet) * 100;

  const rasioHPPRate = safeDivide(hpp, omzet);
  const bepOmzet     = rasioHPPRate < 1 ? safeDivide(totalBiayaTetap, 1 - rasioHPPRate) : 0;
  const hppTinggi    = rasioHPP > 70;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">

      {/* ── Input Panel ─────────────────────────────────────────── */}
      <div className="rounded-3xl border border-line bg-white shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Kalkulator
            </p>
            <h2 className="mt-0.5 font-primary text-lg font-semibold tracking-[-0.3px] text-ink">
              Parameter Input
            </h2>
          </div>
          <button
            type="button"
            onClick={reset}
            aria-label="Hapus semua data"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-soft"
          >
            <Trash2 className="h-3 w-3" />
            Hapus Data
          </button>
        </div>

        {/* Pemasukan */}
        <div className="border-b border-line px-6 py-5">
          <p className="mb-4 font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
            Pemasukan
          </p>
          <div key={`income-${resetKey}`} className="grid gap-6 sm:grid-cols-2">
            {pemasukan.map((f) => (
              <RpField key={f.id} {...f} value={vals[f.id]} onChange={update} />
            ))}
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="px-6 py-5">
          <p className="mb-4 font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
            Pengeluaran Tetap
          </p>
          <div key={`expense-${resetKey}`} className="grid gap-6 sm:grid-cols-2">
            {pengeluaran.map((f) => (
              <RpField key={f.id} {...f} value={vals[f.id]} onChange={update} />
            ))}
          </div>
        </div>

        {hppTinggi && omzet > 0 && (
          <div
            role="alert"
            className="mx-6 mb-6 flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <p className="font-secondary text-sm text-orange-700">
              HPP melebihi 70% dari omzet ({formatPct(rasioHPP)}). Margin kotor sangat tipis — pertimbangkan
              efisiensi biaya produksi atau naikkan harga jual.
            </p>
          </div>
        )}

        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-3xl border-t border-line bg-line">
          <div className="bg-white px-6 py-5">
            <p className="font-secondary text-xs text-muted/60">Laba Kotor</p>
            <p
              className={`mt-1 font-secondary text-lg font-semibold ${
                labaKotor >= 0 ? "text-ink" : "text-red-600"
              }`}
            >
              {formatRupiah(labaKotor)}
            </p>
          </div>
          <div className="bg-white px-6 py-5">
            <p className="font-secondary text-xs text-muted/60">Total Biaya Tetap</p>
            <p className="mt-1 font-secondary text-lg font-semibold text-ink">
              {formatRupiah(totalBiayaTetap)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Laba Bersih Bulan Ini"
          value={formatRupiah(labaBersih)}
          subtitle={`Margin bersih: ${formatPct(marginBersih)}`}
          {...marginStatus(marginBersih)}
        />

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Ringkasan Laba Rugi
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Total Omzet",         value: formatRupiah(omzet),                  bold: false },
              { label: "HPP / Modal Terjual", value: `− ${formatRupiah(hpp)}`,             bold: false },
              { label: "Laba Kotor",          value: formatRupiah(labaKotor),              bold: false },
              { label: "Total Biaya Tetap",   value: `− ${formatRupiah(totalBiayaTetap)}`, bold: false },
              { label: "Laba Bersih",         value: formatRupiah(labaBersih),             bold: true },
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

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Analisis Rasio
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Margin Kotor",      value: formatPct(marginKotor) },
              { label: "Margin Bersih",     value: formatPct(marginBersih) },
              { label: "Rasio HPP",         value: formatPct(rasioHPP) },
              { label: "Rasio Beban Tetap", value: formatPct(rasioBeban) },
              { label: "BEP Omzet Min.",    value: formatRupiah(bepOmzet) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer />
      </div>
    </div>
  );
}
