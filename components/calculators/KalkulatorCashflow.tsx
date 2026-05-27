"use client";

import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef } from "./CalcInputPanel";
import { ResultCard } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";
import { TrendingUp, TrendingDown, AlertTriangle, Minus } from "lucide-react";

const SLUG = "kalkulator-cashflow";

const defaultVals = {
  saldoAwal:        "5000000",
  pemasukanTunai:   "20000000",
  penagihanPiutang: "3000000",
  hppTunai:         "10000000",
  biayaOperasional: "3000000",
  biayaGaji:        "2000000",
  biayaIklan:       "500000",
  biayaLainnya:     "500000",
  pembayaranHutang: "0",
};

const fields: CalcFieldDef[] = [
  { id: "saldoAwal",        label: "Saldo Kas Awal Bulan",       hint: "Uang tunai + saldo rekening di awal periode",          prefix: "Rp" },
  { id: "pemasukanTunai",   label: "Pemasukan Tunai (Omzet)",    hint: "Total uang masuk dari penjualan bulan ini",             prefix: "Rp" },
  { id: "penagihanPiutang", label: "Penagihan Piutang",          hint: "Pembayaran dari pembeli/klien bulan lalu yang masuk",   prefix: "Rp" },
  { id: "hppTunai",         label: "Pembelian Stok / HPP",       hint: "Uang keluar untuk beli barang atau bahan baku",         prefix: "Rp" },
  { id: "biayaOperasional", label: "Biaya Operasional",          hint: "Sewa, listrik, internet, packaging, ongkir",            prefix: "Rp" },
  { id: "biayaGaji",        label: "Gaji & Upah",                hint: "Total gaji karyawan dan upah freelance",                prefix: "Rp" },
  { id: "biayaIklan",       label: "Biaya Iklan & Marketing",    hint: "Total pengeluaran iklan online maupun offline",         prefix: "Rp" },
  { id: "biayaLainnya",     label: "Pengeluaran Lain-lain",      hint: "Pengeluaran tidak terduga atau tidak masuk kategori",   prefix: "Rp" },
  { id: "pembayaranHutang", label: "Cicilan / Pembayaran Hutang",hint: "Angsuran pinjaman atau hutang usaha yang jatuh tempo",  prefix: "Rp" },
];

function cashflowStatus(netCashflow: number, saldoAkhir: number, burnRate: number, runway: number) {
  const gaugeValue = Math.min(100, Math.max(0, runway > 0 ? Math.min(100, (runway / 6) * 100) : 0));
  if (netCashflow > 0 && runway >= 3)
    return { gaugeValue, statusColor: "text-green-700", statusBg: "bg-green-50", statusBarColor: "bg-green-500", statusLabel: "Cashflow positif", statusIcon: TrendingUp };
  if (netCashflow > 0 && runway < 3)
    return { gaugeValue, statusColor: "text-yellow-700", statusBg: "bg-yellow-50", statusBarColor: "bg-yellow-400", statusLabel: "Positif, cadangan tipis", statusIcon: AlertTriangle };
  if (netCashflow < 0 && saldoAkhir > 0)
    return { gaugeValue, statusColor: "text-orange-600", statusBg: "bg-orange-50", statusBarColor: "bg-orange-400", statusLabel: "Negatif, masih ada saldo", statusIcon: AlertTriangle };
  return { gaugeValue: 0, statusColor: "text-red-600", statusBg: "bg-red-50", statusBarColor: "bg-red-500", statusLabel: "Cashflow kritis", statusIcon: TrendingDown };
}

export function KalkulatorCashflow() {
  const { vals, resetKey, reset, update } = useCalcTracking(SLUG, defaultVals);

  const saldoAwal        = Math.max(0, safeNum(vals.saldoAwal));
  const pemasukanTunai   = Math.max(0, safeNum(vals.pemasukanTunai));
  const penagihanPiutang = Math.max(0, safeNum(vals.penagihanPiutang));
  const hppTunai         = Math.max(0, safeNum(vals.hppTunai));
  const biayaOperasional = Math.max(0, safeNum(vals.biayaOperasional));
  const biayaGaji        = Math.max(0, safeNum(vals.biayaGaji));
  const biayaIklan       = Math.max(0, safeNum(vals.biayaIklan));
  const biayaLainnya     = Math.max(0, safeNum(vals.biayaLainnya));
  const pembayaranHutang = Math.max(0, safeNum(vals.pembayaranHutang));

  const totalMasuk    = pemasukanTunai + penagihanPiutang;
  const totalKeluar   = hppTunai + biayaOperasional + biayaGaji + biayaIklan + biayaLainnya + pembayaranHutang;
  const netCashflow   = totalMasuk - totalKeluar;
  const saldoAkhir    = saldoAwal + netCashflow;
  const burnRate      = totalKeluar; // per bulan
  const runway        = burnRate > 0 ? safeDivide(saldoAkhir, burnRate) : 99;
  const cashflowRatio = safeDivide(totalMasuk, totalKeluar);

  const status = cashflowStatus(netCashflow, saldoAkhir, burnRate, runway);

  const breakdown = [
    { label: "Total Pemasukan",    value: formatRupiah(totalMasuk),  positive: true },
    { label: "Total Pengeluaran",  value: formatRupiah(totalKeluar), positive: false },
    { label: "Net Cashflow",       value: formatRupiah(netCashflow), positive: netCashflow >= 0 },
    { label: "Saldo Akhir Bulan",  value: formatRupiah(saldoAkhir),  positive: saldoAkhir >= 0 },
    { label: "Cashflow Ratio",     value: cashflowRatio.toFixed(2).replace(".", ",") + "x", positive: cashflowRatio >= 1 },
    { label: "Runway (bulan)",     value: runway >= 99 ? "Aman" : runway.toFixed(1).replace(".", ",") + " bln", positive: runway >= 3 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={fields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        warning={
          saldoAkhir < 0
            ? { show: true, message: "Saldo akhir negatif — pengeluaran melebihi kas yang tersedia. Segera evaluasi pos pengeluaran terbesar." }
            : undefined
        }
        summary={[
          { label: "Net Cashflow",  value: formatRupiah(netCashflow),  valueColor: netCashflow >= 0 ? "text-green-600" : "text-red-600" },
          { label: "Saldo Akhir",   value: formatRupiah(saldoAkhir),   valueColor: saldoAkhir >= 0  ? "text-ink"       : "text-red-600" },
        ]}
      />

      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Saldo Kas Akhir Bulan"
          value={formatRupiah(saldoAkhir)}
          subtitle={`Runway: ${runway >= 99 ? "aman" : runway.toFixed(1).replace(".", ",") + " bulan"} · Ratio: ${cashflowRatio.toFixed(2).replace(".", ",")}x`}
          {...status}
        />

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Rincian Cashflow
            </p>
          </div>
          <ul className="divide-y divide-line">
            {breakdown.map(({ label, value, positive }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className={`font-secondary text-sm font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Komposisi pengeluaran */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Komposisi Pengeluaran
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "HPP / Stok",       val: hppTunai },
              { label: "Gaji & Upah",      val: biayaGaji },
              { label: "Operasional",      val: biayaOperasional },
              { label: "Iklan",            val: biayaIklan },
              { label: "Lain-lain",        val: biayaLainnya },
              { label: "Cicilan Hutang",   val: pembayaranHutang },
            ]
              .filter((r) => r.val > 0)
              .map(({ label, val }) => {
                const pct = safeDivide(val, totalKeluar) * 100;
                return (
                  <li key={label} className="px-6 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-secondary text-sm text-muted">{label}</span>
                      <span className="font-secondary text-xs font-semibold text-ink">
                        {formatRupiah(val)} · {formatPct(pct)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-cobalt/60 transition-all duration-500"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>

        <CalcDisclaimer note="Cashflow aktual bisa berbeda jika ada piutang yang belum tertagih atau pengeluaran tidak terduga." />
      </div>
    </div>
  );
}
