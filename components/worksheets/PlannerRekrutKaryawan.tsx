"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  formatRupiah, formatPct, safeNum, safeDivide,
  inputClass, trackToolEvent,
} from "@/lib/tools";

const SLUG = "planner-rekrut-karyawan";

type ReadinessQuestion = {
  id: string;
  label: string;
  hint: string;
};

const readinessQuestions: ReadinessQuestion[] = [
  {
    id: "omzet_stabil",
    label: "Omzet bisnis sudah stabil minimal 3 bulan berturut-turut?",
    hint: "Bukan naik turun drastis — stabil artinya bisa diprediksi",
  },
  {
    id: "owner_overload",
    label: "Kamu sering kewalahan dan pekerjaan penting tertunda?",
    hint: "Tanda bahwa kapasitas owner sudah di batas",
  },
  {
    id: "ada_tugas_delegasi",
    label: "Ada tugas spesifik yang bisa didelegasikan ke orang lain?",
    hint: "Bukan semua tugas — minimal ada 1 area yang bisa dilepas",
  },
  {
    id: "ada_sistem",
    label: "Ada sistem/SOP dasar yang bisa diikuti karyawan baru?",
    hint: "Karyawan baru butuh panduan — kalau belum ada, rekrut akan lebih sulit",
  },
  {
    id: "cashflow_cukup",
    label: "Cashflow cukup untuk bayar gaji minimal 3 bulan ke depan?",
    hint: "Rekrut tanpa cadangan gaji = risiko tinggi",
  },
];

const defaultVals = {
  omzetBulanan:    "20000000",
  marginBersih:    "20",
  gajiKaryawan:    "3000000",
  biayaRekrut:     "500000",
  biayaOnboarding: "300000",
  targetDelegasi:  "30",
};

export function PlannerRekrutKaryawan() {
  const [readiness, setReadiness] = useState<Record<string, boolean | null>>({});
  const [vals, setVals]           = useState(defaultVals);
  const [resetKey, setResetKey]   = useState(0);
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
    setReadiness({});
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

  const answerReadiness = (id: string, value: boolean) => {
    setReadiness((prev) => ({ ...prev, [id]: value }));
    interactionCount.current += 1;
    if (interactionCount.current >= 3 && !calculatedFired.current) {
      calculatedFired.current = true;
      trackToolEvent("tool_calculated", SLUG);
    }
  };

  const answeredReadiness   = Object.keys(readiness).length;
  const positiveCount       = Object.values(readiness).filter(Boolean).length;
  const readinessPct        = answeredReadiness > 0
    ? Math.round((positiveCount / readinessQuestions.length) * 100)
    : 0;

  const omzetBulanan    = Math.max(0, safeNum(vals.omzetBulanan));
  const marginBersih    = Math.min(100, Math.max(0, safeNum(vals.marginBersih)));
  const gajiKaryawan    = Math.max(0, safeNum(vals.gajiKaryawan));
  const biayaRekrut     = Math.max(0, safeNum(vals.biayaRekrut));
  const biayaOnboarding = Math.max(0, safeNum(vals.biayaOnboarding));
  const targetDelegasi  = Math.min(100, Math.max(0, safeNum(vals.targetDelegasi)));

  const profitBulanan   = omzetBulanan * (marginBersih / 100);
  const totalBiayaAwal  = biayaRekrut + biayaOnboarding;
  const nilaiDelegasi   = omzetBulanan * (targetDelegasi / 100) * (marginBersih / 100);
  const netBenefitBulan = nilaiDelegasi - gajiKaryawan;
  const bulanBEP        = netBenefitBulan > 0
    ? Math.ceil(safeDivide(totalBiayaAwal, netBenefitBulan))
    : 0;
  const omzetMinimum    = gajiKaryawan > 0 ? gajiKaryawan / 0.15 : 0;
  const gajiRasio       = safeDivide(gajiKaryawan, omzetBulanan) * 100;
  const gajiAman        = gajiRasio <= 15;

  const isReadinessComplete = answeredReadiness === readinessQuestions.length;

  const readinessStatus = () => {
    if (!isReadinessComplete) return { label: "Belum selesai", color: "text-muted", bg: "bg-sky" };
    if (readinessPct >= 80) return { label: "Siap rekrut", color: "text-green-700", bg: "bg-green-50" };
    if (readinessPct >= 60) return { label: "Hampir siap", color: "text-yellow-700", bg: "bg-yellow-50" };
    return { label: "Belum siap", color: "text-red-600", bg: "bg-red-50" };
  };

  const status = readinessStatus();

  const fields: { id: keyof typeof defaultVals; label: string; prefix?: string; suffix?: string; hint?: string }[] = [
    { id: "omzetBulanan",    label: "Omzet Rata-rata per Bulan",         prefix: "Rp", hint: "Rata-rata omzet 3 bulan terakhir." },
    { id: "marginBersih",    label: "Margin Bersih (%)",                 suffix: "%",  hint: "Profit bersih dibagi omzet." },
    { id: "gajiKaryawan",    label: "Gaji Karyawan per Bulan",           prefix: "Rp", hint: "Termasuk BPJS dan tunjangan jika ada." },
    { id: "biayaRekrut",     label: "Biaya Rekrut (iklan, tes, dll)",    prefix: "Rp" },
    { id: "biayaOnboarding", label: "Biaya Onboarding & Pelatihan",      prefix: "Rp" },
    { id: "targetDelegasi",  label: "% Beban Kerja yang Didelegasikan",  suffix: "%",  hint: "Estimasi berapa persen pekerjaan owner yang bisa diambil alih karyawan baru." },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      {/* ── Inputs ── */}
      <div className="space-y-6">
        {/* Kesiapan kualitatif */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-primary text-xl font-semibold tracking-[-0.4px] text-ink">
              Cek Kesiapan Bisnis
            </h2>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset planner rekrut karyawan"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
          <p className="mt-1 font-secondary text-sm text-muted">
            Jawab jujur — ini untuk membantu kamu memutuskan, bukan menghakimi.
          </p>

          <div key={`readiness-${resetKey}`} className="mt-5 space-y-4">
            {readinessQuestions.map((q) => (
              <div key={q.id} className="rounded-2xl border border-line p-4">
                <p className="font-secondary text-sm font-semibold text-ink">{q.label}</p>
                <p className="mt-0.5 font-secondary text-xs leading-[1.4] text-muted">{q.hint}</p>
                <div className="mt-3 flex gap-2">
                  {[
                    { label: "Ya", value: true },
                    { label: "Belum", value: false },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => answerReadiness(q.id, value)}
                      aria-pressed={readiness[q.id] === value}
                      className={`rounded-full border px-5 py-1.5 font-secondary text-sm font-semibold transition ${
                        readiness[q.id] === value
                          ? value
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-orange-400 bg-orange-50 text-orange-700"
                          : "border-line bg-white text-ink hover:border-cobalt/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kalkulasi finansial */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <h2 className="font-primary text-xl font-semibold tracking-[-0.4px] text-ink">
            Kalkulasi Finansial
          </h2>
          <p className="mt-1 font-secondary text-sm text-muted">
            Hitung apakah bisnis kamu secara angka sudah mampu menanggung karyawan baru.
          </p>

          <div key={`finance-${resetKey}`} className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                  {f.label}
                </label>
                {f.hint && (
                  <p id={`${f.id}-hint`} className="mb-1.5 font-secondary text-xs leading-[1.4] text-muted">
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

          {!gajiAman && omzetBulanan > 0 && (
            <div role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              <p className="font-secondary text-sm text-orange-700">
                Gaji {formatPct(gajiRasio)} dari omzet — idealnya di bawah 15%. Omzet minimum yang disarankan: {formatRupiah(omzetMinimum)}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        {/* Skor kesiapan */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Skor Kesiapan
          </p>
          <p className="mt-2 font-primary text-[40px] font-semibold leading-none tracking-[-1.8px] text-ink">
            {isReadinessComplete ? `${readinessPct}` : "—"}<span className="text-[24px] text-muted">/100</span>
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-cobalt transition-all duration-500"
              style={{ width: `${readinessPct}%` }}
            />
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-secondary text-xs font-bold ${status.bg} ${status.color}`}>
              {isReadinessComplete && readinessPct >= 60
                ? <CheckCircle2 className="h-3.5 w-3.5" />
                : <AlertTriangle className="h-3.5 w-3.5" />
              }
              {status.label}
            </span>
          </div>
        </div>

        {/* Analisis finansial */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Analisis Finansial
          </p>
          <ul className="space-y-4">
            {[
              { label: "Profit Bersih Bulanan",    value: formatRupiah(profitBulanan) },
              { label: "Gaji vs Omzet",            value: formatPct(gajiRasio), warn: !gajiAman },
              { label: "Total Biaya Awal Rekrut",  value: formatRupiah(totalBiayaAwal) },
              { label: "Omzet Minimum Disarankan", value: formatRupiah(omzetMinimum) },
            ].map(({ label, value, warn }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className={`font-secondary text-sm font-semibold ${warn ? "text-orange-600" : "text-ink"}`}>{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* BEP rekrut */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Proyeksi Balik Modal
          </p>
          <ul className="space-y-4">
            {[
              { label: "Nilai Delegasi per Bulan", value: formatRupiah(nilaiDelegasi) },
              { label: "Net Benefit per Bulan",    value: formatRupiah(netBenefitBulan), highlight: true },
              { label: "Estimasi Balik Modal",     value: bulanBEP > 0 ? `${bulanBEP} bulan` : netBenefitBulan <= 0 ? "Tidak balik modal" : "—" },
            ].map(({ label, value, highlight }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className={`font-secondary text-sm ${highlight ? "font-bold text-ink" : "text-muted"}`}>{label}</span>
                <span className={`font-secondary text-sm font-semibold ${
                  highlight ? (netBenefitBulan >= 0 ? "text-green-600" : "text-red-600") : "text-ink"
                }`}>{value}</span>
              </li>
            ))}
          </ul>
          {netBenefitBulan <= 0 && omzetBulanan > 0 && (
            <p className="mt-3 font-secondary text-xs text-muted">
              Nilai yang didelegasikan lebih kecil dari gaji. Pertimbangkan naikkan % delegasi atau tunggu omzet lebih tinggi.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
