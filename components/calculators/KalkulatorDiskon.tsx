"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide, inputClass, trackToolEvent } from "@/lib/tools";
import { ResultCard, savingsStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-diskon-bertingkat";

const defaultVals = {
  hargaAwal:    "250000",
  d1:           "20",
  d2:           "10",
  d3:           "0",
  voucher:      "15000",
  cashbackPct:  "5",
  ongkir:       "12000",
  biayaLayanan: "2000",
};

export function KalkulatorDiskon() {
  const [vals, setVals] = useState(defaultVals);
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

  const hargaAwal    = Math.max(0, safeNum(vals.hargaAwal));
  const d1           = Math.min(100, Math.max(0, safeNum(vals.d1)));
  const d2           = Math.min(100, Math.max(0, safeNum(vals.d2)));
  const d3           = Math.min(100, Math.max(0, safeNum(vals.d3)));
  const voucher      = Math.max(0, safeNum(vals.voucher));
  const cashbackPct  = Math.min(100, Math.max(0, safeNum(vals.cashbackPct)));
  const ongkir       = Math.max(0, safeNum(vals.ongkir));
  const biayaLayanan = Math.max(0, safeNum(vals.biayaLayanan));

  // Compound discount steps
  const nominalD1      = hargaAwal * (d1 / 100);
  const sisa1          = hargaAwal - nominalD1;
  const nominalD2      = sisa1 * (d2 / 100);
  const sisa2          = sisa1 - nominalD2;
  const nominalD3      = sisa2 * (d3 / 100);
  const subtotalDiskon = sisa2 - nominalD3;

  const voucherTerpakai        = Math.min(voucher, subtotalDiskon);
  const subtotalSetelahVoucher = subtotalDiskon - voucherTerpakai;

  const bayarCheckout   = subtotalSetelahVoucher + ongkir + biayaLayanan;
  const cashbackNominal = subtotalSetelahVoucher * (cashbackPct / 100);
  const biayaEfektif    = Math.max(0, bayarCheckout - cashbackNominal);

  // PRD §4.5 step 8: HematEfektif = (HargaAwal - SubtotalDiskon) + VoucherTerpakai + CashbackNominal
  // NOT clamped — ongkir/biaya are separate costs, not subtracted from savings
  const hematEfektif = (hargaAwal - subtotalDiskon) + voucherTerpakai + cashbackNominal;

  // Warn when biayaEfektif > hargaAwal (net cost exceeds original price due to ongkir)
  const netLoss = biayaEfektif > hargaAwal;

  // PRD §4.5 step 9: DiskonEfektif = HematEfektif / HargaAwal × 100
  const diskonEfektif    = safeDivide(hematEfektif, hargaAwal) * 100;
  const diskonBertingkat = safeDivide(hargaAwal - subtotalDiskon, hargaAwal) * 100;

  const fields: { id: keyof typeof defaultVals; label: string; prefix?: string; suffix?: string; max?: number; hint?: string }[] = [
    { id: "hargaAwal",    label: "Harga Awal Barang",  prefix: "Rp" },
    { id: "d1",           label: "Diskon Pertama (%)", suffix: "%", max: 100, hint: "Diskon bertingkat dihitung berurutan (compound), bukan dijumlah." },
    { id: "d2",           label: "Diskon Kedua (%)",   suffix: "%", max: 100 },
    { id: "d3",           label: "Diskon Ketiga (%)",  suffix: "%", max: 100 },
    { id: "voucher",      label: "Voucher Potongan",   prefix: "Rp" },
    { id: "cashbackPct",  label: "Cashback (%)",       suffix: "%", max: 100, hint: "Cashback dihitung dari subtotal setelah voucher, bukan dari harga awal." },
    { id: "ongkir",       label: "Ongkos Kirim",       prefix: "Rp" },
    { id: "biayaLayanan", label: "Biaya Layanan",      prefix: "Rp", hint: "Biaya penanganan, asuransi, atau biaya aplikasi." },
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
            aria-label="Reset kalkulator diskon bertingkat ke nilai default"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
        <div key={resetKey} className="mt-5 grid gap-4 sm:grid-cols-2">
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
                  max={f.max}
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

        {/* Warning: total bayar melebihi harga awal */}
        {netLoss && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <p className="font-secondary text-sm text-orange-700">
              Total biaya efektif melebihi harga awal barang. Ongkir + biaya layanan lebih besar dari semua diskon yang didapat.
            </p>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="Biaya Efektif Akhir"
          value={formatRupiah(biayaEfektif)}
          subtitle={
            netLoss
              ? `Hemat: ${formatRupiah(hematEfektif)} — tapi bayar lebih dari harga awal`
              : `Hemat: ${formatRupiah(hematEfektif)} (${formatPct(diskonEfektif)})`
          }
          {...savingsStatus(diskonEfektif)}
        />

        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Rincian Perhitungan
          </p>
          <ul className="space-y-4">
            {[
              { label: "Harga setelah diskon bertingkat", value: formatRupiah(subtotalDiskon) },
              { label: "Diskon bertingkat efektif",       value: formatPct(diskonBertingkat) },
              { label: "Voucher terpakai",                value: formatRupiah(voucherTerpakai) },
              { label: "Subtotal setelah voucher",        value: formatRupiah(subtotalSetelahVoucher) },
              { label: "Total bayar checkout",            value: formatRupiah(bayarCheckout) },
              { label: "Cashback",                        value: formatRupiah(cashbackNominal) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CalcDisclaimer note="Cashback dan voucher aktual tergantung syarat & ketentuan platform. Cek detail promo di aplikasi sebelum checkout." />
    </div>
  );
}
