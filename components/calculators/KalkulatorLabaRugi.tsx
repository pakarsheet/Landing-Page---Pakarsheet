"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import {
  formatRupiah, formatPct, safeNum, safeDivide,
  inputClass, trackToolEvent,
} from "@/lib/tools";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";

const SLUG = "kalkulator-laba-rugi";

const defaultVals = {
  omzet:          "15000000",
  hpp:            "7500000",
  biayaSewa:      "1500000",
  biayaGaji:      "2000000",
  biayaIklan:     "500000",
  biayaOperasional: "300000",
  biayaLainnya:   "200000",
};

export function KalkulatorLabaRugi() {
  const [vals, setVals]       = useState(defaultVals);
  const [resetKey, setResetKey] = useState(0);
  const visitedFired     = useRef(false);
  const interactionCount = useRef(0);
  const calculatedFired  = useRef(false);

  useEffect(() => {
    if (visitedFired.current) return;
    visitedFired.current = true;
    trackToolEvent("tool_visited", SLUG);
  }, []);

  const reset = () => { setVals(defaultVals); setResetKey((k) => k + 1); };

  const update = (id: string, value: string) => {
    setVals((prev) => ({ ...prev, [id]: value }));
    interactionCount.current += 1;
    if (interactionCount.current >= 3 && !calculatedFired.current) {
      calculatedFired.current = true;
      trackToolEvent("tool_calculated", SLUG);
    }
  };

  // ── Kalkulasi ──────────────────────────────────────────────────────────────
  const omzet            = Math.max(0, safeNum(vals.omzet));
  const hpp              = Math.max(0, safeNum(vals.hpp));
  const biayaSewa        = Math.max(0, safeNum(vals.biayaSewa));
  const biayaGaji        = Math.max(0, safeNum(vals.biayaGaji));
  const biayaIklan       = Math.max(0, safeNum(vals.biayaIklan));
  const biayaOperasional = Math.max(0, safeNum(vals.biayaOperasional));
  const biayaLainnya     = Math.max(0, safeNum(vals.biayaLainnya));

  const labaKotor        = omzet - hpp;
  const totalBiayaTetap  = biayaSewa + biayaGaji + biayaIklan + biayaOperasional + biayaLainnya;
  const labaBersih       = labaKotor - totalBiayaTetap;
  const marginKotor      = safeDivide(labaKotor, omzet) * 100;
  const marginBersih     = safeDivide(labaBersih, omzet) * 100;
  const rasioHPP         = safeDivide(hpp, omzet) * 100;
  const rasioBeban       = safeDivide(totalBiayaTetap, omzet) * 100;

  // BEP: omzet minimum agar labaBersih = 0
  // labaBersih = omzet - hpp - totalBiayaTetap = 0
  // Karena HPP bisa proporsional, kita pakai rasio HPP aktual
  const rasioHPPRate = safeDivide(hpp, omzet);
  const bepOmzet     = rasioHPPRate < 1
    ? safeDivide(totalBiayaTetap, 1 - rasioHPPRate)
    : 0;

  const hppTinggi = rasioHPP > 70;

  const pemasukan: { id: keyof typeof defaultVals; label: string; hint?: string }[] = [
    { id: "omzet", label: "Total Omzet / Pendapatan", hint: "Total uang masuk dari penjualan dalam periode ini." },
    { id: "hpp",   label: "HPP / Modal Barang Terjual", hint: "Total biaya pokok semua produk yang berhasil terjual." },
  ];

  const pengeluaran: { id: keyof typeof defaultVals; label: string; hint?: string }[] = [
    { id: "biayaSewa",        label: "Biaya Sewa Tempat",       hint: "Sewa toko, gudang, atau kantor per bulan." },
    { id: "biayaGaji",        label: "Gaji Karyawan",           hint: "Total gaji semua karyawan bulan ini." },
    { id: "biayaIklan",       label: "Biaya Iklan & Marketing",  hint: "Total pengeluaran iklan online maupun offline." },
    { id: "biayaOperasional", label: "Biaya Operasional Lain",  hint: "Listrik, internet, packaging, ongkir, dll." },
    { id: "biayaLainnya",     label: "Biaya Lain-lain",         hint: "Pengeluaran tidak terduga atau tidak masuk kategori di atas." },
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
            aria-label="Reset kalkulator laba rugi ke nilai default"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        {/* Pemasukan */}
        <p className="mt-5 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
          Pemasukan
        </p>
        <div key={`income-${resetKey}`} className="mt-3 grid gap-4 sm:grid-cols-2">
          {pemasukan.map((f) => (
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
                <span className="mr-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">Rp</span>
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
              </div>
            </div>
          ))}
        </div>

        {/* Pengeluaran */}
        <p className="mt-6 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
          Pengeluaran Tetap
        </p>
        <div key={`expense-${resetKey}`} className="mt-3 grid gap-4 sm:grid-cols-2">
          {pengeluaran.map((f) => (
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
                <span className="mr-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">Rp</span>
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
              </div>
            </div>
          ))}
        </div>

        {/* Warning: HPP terlalu tinggi */}
        {hppTinggi && omzet > 0 && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <p className="font-secondary text-sm text-orange-700">
              HPP kamu melebihi 70% dari omzet ({formatPct(rasioHPP)}). Margin kotor sangat tipis — pertimbangkan efisiensi biaya produksi atau naikkan harga jual.
            </p>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="Laba Bersih Bulan Ini"
          value={formatRupiah(labaBersih)}
          subtitle={`Margin bersih: ${formatPct(marginBersih)}`}
          {...marginStatus(marginBersih)}
        />

        {/* Ringkasan Laba Rugi */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Ringkasan
          </p>
          <ul className="space-y-4">
            {[
              { label: "Total Omzet",        value: formatRupiah(omzet),           highlight: false },
              { label: "HPP / Modal Terjual", value: `− ${formatRupiah(hpp)}`,     highlight: false },
              { label: "Laba Kotor",          value: formatRupiah(labaKotor),       highlight: false },
              { label: "Total Biaya Tetap",   value: `− ${formatRupiah(totalBiayaTetap)}`, highlight: false },
              { label: "Laba Bersih",         value: formatRupiah(labaBersih),      highlight: true  },
            ].map(({ label, value, highlight }) => (
              <li
                key={label}
                className={`flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0 ${highlight ? "pt-1" : ""}`}
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

        {/* Analisis Rasio */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Analisis Rasio
          </p>
          <ul className="space-y-4">
            {[
              { label: "Margin Kotor",       value: formatPct(marginKotor) },
              { label: "Margin Bersih",      value: formatPct(marginBersih) },
              { label: "Rasio HPP",          value: formatPct(rasioHPP) },
              { label: "Rasio Beban Tetap",  value: formatPct(rasioBeban) },
              { label: "BEP Omzet Minimum",  value: formatRupiah(bepOmzet) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
