"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { ResultCard, savingsStatus } from "@/components/ui/ResultCard";

export function KalkulatorDiskon() {
  const [vals, setVals] = useState({
    hargaAwal: "250000",
    d1: "20",
    d2: "10",
    d3: "0",
    voucher: "15000",
    cashbackPct: "5",
    ongkir: "12000",
    biayaLayanan: "2000",
  });

  const hargaAwal    = safeNum(vals.hargaAwal);
  const d1           = Math.min(100, Math.max(0, safeNum(vals.d1)));
  const d2           = Math.min(100, Math.max(0, safeNum(vals.d2)));
  const d3           = Math.min(100, Math.max(0, safeNum(vals.d3)));
  const voucher      = safeNum(vals.voucher);
  const cashbackPct  = Math.min(100, Math.max(0, safeNum(vals.cashbackPct)));
  const ongkir       = safeNum(vals.ongkir);
  const biayaLayanan = safeNum(vals.biayaLayanan);

  // Compound discount steps
  const nominalD1      = hargaAwal * (d1 / 100);
  const sisa1          = hargaAwal - nominalD1;
  const nominalD2      = sisa1 * (d2 / 100);
  const sisa2          = sisa1 - nominalD2;
  const nominalD3      = sisa2 * (d3 / 100);
  const subtotalDiskon = sisa2 - nominalD3;

  const voucherTerpakai      = Math.min(voucher, subtotalDiskon);
  const subtotalSetelahVoucher = subtotalDiskon - voucherTerpakai;

  const bayarCheckout    = subtotalSetelahVoucher + ongkir + biayaLayanan;
  const cashbackNominal  = subtotalSetelahVoucher * (cashbackPct / 100);
  const biayaEfektif     = Math.max(0, bayarCheckout - cashbackNominal);

  const hematEfektif     = (hargaAwal - subtotalDiskon) + voucherTerpakai + cashbackNominal;
  const diskonEfektif    = safeDivide(hematEfektif, hargaAwal) * 100;
  const diskonBertingkat = safeDivide(hargaAwal - subtotalDiskon, hargaAwal) * 100;

  const update = (id: string, value: string) =>
    setVals((prev) => ({ ...prev, [id]: value }));

  const inputClass =
    "flex items-center rounded-2xl border border-line bg-white px-4 py-3 shadow-card focus-within:border-cobalt focus-within:ring-1 focus-within:ring-cobalt/20";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* ── Inputs ── */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="font-primary text-xl font-semibold tracking-[-0.4px] text-ink">
          Parameter Input
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { id: "hargaAwal",    label: "Harga Awal Barang",   prefix: "Rp" },
            { id: "d1",           label: "Diskon Pertama (%)",   suffix: "%", max: 100 },
            { id: "d2",           label: "Diskon Kedua (%)",     suffix: "%", max: 100 },
            { id: "d3",           label: "Diskon Ketiga (%)",    suffix: "%", max: 100 },
            { id: "voucher",      label: "Voucher Potongan",     prefix: "Rp" },
            { id: "cashbackPct",  label: "Cashback (%)",         suffix: "%", max: 100 },
            { id: "ongkir",       label: "Ongkos Kirim",         prefix: "Rp" },
            { id: "biayaLayanan", label: "Biaya Layanan",        prefix: "Rp" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                {f.label}
              </label>
              <div className={inputClass}>
                {(f as { prefix?: string }).prefix && (
                  <span className="mr-2 font-secondary text-sm font-semibold text-muted">
                    {(f as { prefix?: string }).prefix}
                  </span>
                )}
                <input
                  id={f.id}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={(f as { max?: number }).max}
                  value={vals[f.id as keyof typeof vals]}
                  onChange={(e) => update(f.id, e.target.value)}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
                {(f as { suffix?: string }).suffix && (
                  <span className="ml-2 font-secondary text-sm font-semibold text-muted">
                    {(f as { suffix?: string }).suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="Biaya Efektif Akhir"
          value={formatRupiah(biayaEfektif)}
          subtitle={`Hemat: ${formatRupiah(hematEfektif)} (${formatPct(diskonEfektif)})`}
          {...savingsStatus(diskonEfektif)}
        />

        {/* Breakdown */}
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
    </div>
  );
}
