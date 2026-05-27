"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, TrendingUp, TrendingDown, Minus, Wallet, Settings2, Megaphone, Users, type LucideIcon } from "lucide-react";
import { trackToolEvent } from "@/lib/tools";

const SLUG = "scorecard-bisnis-bulanan";

type Question = {
  id: string;
  label: string;
  hint: string;
  options: { label: string; value: number }[];
};

type Area = {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  questions: Question[];
};

const areas: Area[] = [
  {
    id: "keuangan",
    label: "Keuangan",
    icon: Wallet,
    accent: "bg-sky text-cobalt",
    questions: [
      {
        id: "margin",
        label: "Bagaimana margin keuntungan bersih bulan ini?",
        hint: "Profit bersih dibagi omzet",
        options: [
          { label: "Di atas 20% — sangat sehat", value: 4 },
          { label: "10–20% — cukup", value: 3 },
          { label: "1–10% — tipis", value: 2 },
          { label: "Rugi atau belum tahu", value: 1 },
        ],
      },
      {
        id: "cashflow",
        label: "Apakah uang kas selalu cukup untuk operasional harian?",
        hint: "Tidak pernah kehabisan uang untuk beli stok, bayar gaji, dll",
        options: [
          { label: "Selalu cukup, ada cadangan", value: 4 },
          { label: "Biasanya cukup, kadang mepet", value: 3 },
          { label: "Sering mepet, perlu pinjam", value: 2 },
          { label: "Sering tidak cukup", value: 1 },
        ],
      },
      {
        id: "piutang",
        label: "Bagaimana kondisi piutang / tagihan yang belum dibayar?",
        hint: "Uang dari pembeli/klien yang belum masuk",
        options: [
          { label: "Tidak ada piutang macet", value: 4 },
          { label: "Ada sedikit, masih terkontrol", value: 3 },
          { label: "Cukup banyak, mulai mengganggu", value: 2 },
          { label: "Banyak piutang macet", value: 1 },
        ],
      },
    ],
  },
  {
    id: "operasional",
    label: "Operasional",
    icon: Settings2,
    accent: "bg-sheet text-ink",
    questions: [
      {
        id: "stok",
        label: "Seberapa baik pengelolaan stok bulan ini?",
        hint: "Tidak kehabisan stok saat ramai, tidak numpuk stok mati",
        options: [
          { label: "Stok selalu tersedia, tidak ada yang mati", value: 4 },
          { label: "Sesekali kehabisan atau kelebihan", value: 3 },
          { label: "Sering kehabisan atau banyak stok mati", value: 2 },
          { label: "Tidak ada sistem stok sama sekali", value: 1 },
        ],
      },
      {
        id: "fulfillment",
        label: "Seberapa cepat dan akurat proses packing & pengiriman?",
        hint: "Order diproses tepat waktu, jarang ada komplain pengiriman",
        options: [
          { label: "Hampir tidak ada keterlambatan atau kesalahan", value: 4 },
          { label: "Sesekali ada masalah kecil", value: 3 },
          { label: "Sering terlambat atau salah kirim", value: 2 },
          { label: "Banyak komplain pengiriman", value: 1 },
        ],
      },
      {
        id: "proses",
        label: "Apakah proses kerja harian sudah terdokumentasi (SOP)?",
        hint: "Tim tahu harus ngapain tanpa harus tanya terus",
        options: [
          { label: "Ada SOP jelas, tim mandiri", value: 4 },
          { label: "Ada sebagian, masih perlu bimbingan", value: 3 },
          { label: "Belum ada, semua masih di kepala owner", value: 2 },
          { label: "Tidak ada dan sering kacau", value: 1 },
        ],
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    accent: "bg-lilac text-ink",
    questions: [
      {
        id: "konversi",
        label: "Bagaimana tingkat konversi dari pengunjung ke pembeli?",
        hint: "Dari yang lihat produk, berapa yang jadi beli",
        options: [
          { label: "Konversi bagus, banyak yang beli", value: 4 },
          { label: "Lumayan, masih bisa ditingkatkan", value: 3 },
          { label: "Rendah, banyak yang lihat tapi tidak beli", value: 2 },
          { label: "Tidak tahu atau sangat rendah", value: 1 },
        ],
      },
      {
        id: "iklan",
        label: "Apakah biaya iklan menghasilkan profit yang jelas?",
        hint: "ROAS iklan di atas titik impas",
        options: [
          { label: "Iklan jelas profitable, ROAS bagus", value: 4 },
          { label: "Break-even atau sedikit profit", value: 3 },
          { label: "Tidak yakin apakah iklan untung atau rugi", value: 2 },
          { label: "Tidak pasang iklan atau jelas rugi", value: 1 },
        ],
      },
      {
        id: "repeat",
        label: "Seberapa banyak pembeli yang kembali beli lagi?",
        hint: "Repeat buyer adalah tanda produk dan layanan bagus",
        options: [
          { label: "Banyak repeat buyer, pelanggan setia", value: 4 },
          { label: "Ada beberapa, tapi belum banyak", value: 3 },
          { label: "Jarang ada yang beli lagi", value: 2 },
          { label: "Hampir tidak ada repeat buyer", value: 1 },
        ],
      },
    ],
  },
  {
    id: "sdm",
    label: "SDM & Tim",
    icon: Users,
    accent: "bg-leaf text-cobalt",
    questions: [
      {
        id: "produktivitas",
        label: "Apakah tim bekerja produktif dan tahu prioritasnya?",
        hint: "Tidak banyak waktu terbuang, pekerjaan selesai tepat waktu",
        options: [
          { label: "Tim sangat produktif dan mandiri", value: 4 },
          { label: "Cukup produktif, sesekali perlu arahan", value: 3 },
          { label: "Sering tidak fokus atau salah prioritas", value: 2 },
          { label: "Tidak ada tim atau sangat tidak produktif", value: 1 },
        ],
      },
      {
        id: "beban",
        label: "Seberapa besar beban kerja owner dibanding kapasitas?",
        hint: "Owner tidak harus handle semua hal sendiri",
        options: [
          { label: "Beban terdistribusi baik, owner bisa fokus strategi", value: 4 },
          { label: "Agak banyak, tapi masih bisa dihandle", value: 3 },
          { label: "Overload, banyak hal yang tertunda", value: 2 },
          { label: "Owner handle semua, sangat kewalahan", value: 1 },
        ],
      },
      {
        id: "sistem",
        label: "Apakah ada sistem pencatatan data bisnis yang rapi?",
        hint: "Laporan, data penjualan, keuangan — mudah diakses kapan saja",
        options: [
          { label: "Ada sistem rapi, data mudah diakses", value: 4 },
          { label: "Ada sebagian, masih ada yang manual", value: 3 },
          { label: "Sebagian besar masih manual atau berantakan", value: 2 },
          { label: "Tidak ada pencatatan sama sekali", value: 1 },
        ],
      },
    ],
  },
];

const MAX_SCORE_PER_AREA = 12; // 3 pertanyaan × max 4 poin

function areaStatus(score: number) {
  const pct = (score / MAX_SCORE_PER_AREA) * 100;
  if (pct >= 80) return { label: "Sangat Sehat", color: "text-green-700", bg: "bg-green-50", bar: "bg-green-500" };
  if (pct >= 60) return { label: "Sehat",        color: "text-green-600", bg: "bg-green-50", bar: "bg-green-400" };
  if (pct >= 40) return { label: "Perlu Perhatian", color: "text-yellow-700", bg: "bg-yellow-50", bar: "bg-yellow-400" };
  return              { label: "Perlu Perbaikan",   color: "text-red-600",    bg: "bg-red-50",    bar: "bg-red-500" };
}

function overallStatus(pct: number) {
  if (pct >= 80) return { label: "Bisnis Sangat Sehat", color: "text-green-700", bg: "bg-green-50", bar: "bg-green-500", icon: TrendingUp };
  if (pct >= 60) return { label: "Bisnis Sehat",        color: "text-green-600", bg: "bg-green-50", bar: "bg-green-400", icon: TrendingUp };
  if (pct >= 40) return { label: "Perlu Beberapa Perbaikan", color: "text-yellow-700", bg: "bg-yellow-50", bar: "bg-yellow-400", icon: Minus };
  return              { label: "Butuh Perhatian Serius",     color: "text-red-600",    bg: "bg-red-50",    bar: "bg-red-500",    icon: TrendingDown };
}

type Answers = Record<string, number>;

export function ScorecardBisnis() {
  const [answers, setAnswers] = useState<Answers>({});
  const [resetKey, setResetKey] = useState(0);
  const visitedFired     = useRef(false);
  const interactionCount = useRef(0);
  const calculatedFired  = useRef(false);

  useEffect(() => {
    if (visitedFired.current) return;
    visitedFired.current = true;
    trackToolEvent("tool_visited", SLUG);
  }, []);

  const reset = () => { setAnswers({}); setResetKey((k) => k + 1); };

  const answer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    interactionCount.current += 1;
    if (interactionCount.current >= 3 && !calculatedFired.current) {
      calculatedFired.current = true;
      trackToolEvent("tool_calculated", SLUG);
    }
  };

  const totalQuestions = areas.reduce((sum, a) => sum + a.questions.length, 0);
  const answeredCount  = Object.keys(answers).length;
  const completionPct  = Math.round((answeredCount / totalQuestions) * 100);

  const areaScores = areas.map((area) => {
    const score    = area.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const answered = area.questions.filter((q) => answers[q.id] !== undefined).length;
    return { ...area, score, answered };
  });

  const totalScore    = areaScores.reduce((sum, a) => sum + a.score, 0);
  const maxTotalScore = areas.length * MAX_SCORE_PER_AREA;
  const overallPct    = answeredCount > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
  const overall       = overallStatus(overallPct);
  const OverallIcon   = overall.icon;
  const isComplete    = answeredCount === totalQuestions;

  const sortedByScore = [...areaScores]
    .filter((a) => a.answered === a.questions.length)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      {/* ── Questions ── */}
      <div className="space-y-6">
        {/* Progress bar */}
        <div className="rounded-3xl border border-line bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-secondary text-sm font-semibold text-ink">
                Progress: {answeredCount}/{totalQuestions} pertanyaan
              </p>
              <p className="mt-0.5 font-secondary text-xs text-muted">
                {completionPct < 100 ? "Isi semua pertanyaan untuk hasil lengkap" : "Semua pertanyaan sudah diisi ✓"}
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset scorecard ke awal"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-cobalt transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Area questions */}
        {areas.map((area) => (
          <div key={`${area.id}-${resetKey}`} className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <div className="mb-5 flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${area.accent}`}>
                <area.icon className="h-5 w-5" />
              </span>
              <h2 className="font-primary text-xl font-semibold tracking-[-0.4px] text-ink">
                {area.label}
              </h2>
            </div>

            <div className="space-y-6">
              {area.questions.map((q) => (
                <div key={q.id}>
                  <p className="mb-1 font-secondary text-sm font-semibold text-ink">{q.label}</p>
                  <p className="mb-3 font-secondary text-xs leading-[1.4] text-muted">{q.hint}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => answer(q.id, opt.value)}
                        aria-pressed={answers[q.id] === opt.value}
                        className={`rounded-2xl border px-4 py-3 text-left font-secondary text-sm font-semibold transition duration-200 ${
                          answers[q.id] === opt.value
                            ? "border-cobalt bg-cobalt/5 text-cobalt"
                            : "border-line bg-white text-ink hover:border-cobalt/40 hover:bg-sky/30"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        {/* Overall score */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Skor Keseluruhan
          </p>
          <p className="mt-2 font-primary text-[40px] font-semibold leading-none tracking-[-1.8px] text-ink">
            {overallPct}<span className="text-[24px] text-muted">/100</span>
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-line">
            <div
              className={`h-full rounded-full transition-all duration-700 ${overall.bar}`}
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-secondary text-xs font-bold ${overall.bg} ${overall.color}`}>
              <OverallIcon className="h-3.5 w-3.5" />
              {overall.label}
            </span>
          </div>
          {!isComplete && (
            <p className="mt-3 font-secondary text-xs text-muted">
              Isi semua {totalQuestions} pertanyaan untuk skor yang akurat.
            </p>
          )}
        </div>

        {/* Skor per area */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Skor per Area
          </p>
          <ul className="space-y-4">
            {areaScores.map((area) => {
              const pct    = area.answered > 0 ? Math.round((area.score / MAX_SCORE_PER_AREA) * 100) : 0;
              const status = areaStatus(area.score);
              return (
                <li key={area.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-secondary text-sm font-semibold text-ink flex items-center gap-1.5">
                      <area.icon className="h-3.5 w-3.5 shrink-0" />
                      {area.label}
                    </span>
                    <span className={`font-secondary text-xs font-bold ${status.color}`}>
                      {area.answered === area.questions.length ? `${pct}%` : "—"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Prioritas perbaikan */}
        {isComplete && sortedByScore.length > 0 && (
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
              Prioritas Bulan Depan
            </p>
            <ul className="space-y-3">
              {sortedByScore.map((area, i) => (
                <li key={area.id} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink font-secondary text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-secondary text-sm font-semibold text-ink flex items-center gap-1.5">
                      <area.icon className="h-3.5 w-3.5 shrink-0" />
                      Perbaiki area {area.label}
                    </p>
                    <p className="font-secondary text-xs text-muted">
                      Skor {Math.round((area.score / MAX_SCORE_PER_AREA) * 100)}% — {areaStatus(area.score).label}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
