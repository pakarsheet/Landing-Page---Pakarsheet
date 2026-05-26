"use client";

import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef } from "./CalcInputPanel";
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

const fields: CalcFieldDef[] = [
  { id: "hargaAwal",    label: "Harga Awal Barang",  hint: "Harga sebelum diskon apapun",                     prefix: "Rp" },
  { id: "d1",           label: "Diskon Pertama",     hint: "Dihitung compound dari harga awal",               suffix: "%", max: 100 },
  { id: "d2",           label: "Diskon Kedua",       hint: "Dihitung dari sisa setelah diskon pertama",       suffix: "%", max: 100 },
  { id: "d3",           label: "Diskon Ketiga",      hint: "Dihitung dari sisa setelah diskon kedua",         suffix: "%", max: 100 },
  { id: "voucher",      label: "Voucher Potongan",   hint: "Potongan nominal langsung dari subtotal",         prefix: "Rp" },
  { id: "cashbackPct",  label: "Cashback",           hint: "Dihitung dari subtotal setelah voucher",          suffix: "%", max: 100 },
  { id: "ongkir",       label: "Ongkos Kirim",       hint: "Biaya pengiriman yang ditanggung pembeli",        prefix: "Rp" },
  { id: "biayaLayanan", label: "Biaya Layanan",      hint: "Biaya penanganan, asuransi, atau biaya aplikasi", prefix: "Rp" },
];

export function KalkulatorDiskon() {
  const { vals, resetKey, reset, update } = useCalcTracking(SLUG, defaultVals);

  const hargaAwal    = Math.max(0, safeNum(vals.hargaAwal));
  const d1           = Math.min(100, Math.max(0, safeNum(vals.d1)));
  const d2           = Math.min(100, Math.max(0, safeNum(vals.d2)));
  const d3           = Math.min(100, Math.max(0, safeNum(vals.d3)));
  const voucher      = Math.max(0, safeNum(vals.voucher));
  const cashbackPct  = Math.min(100, Math.max(0, safeNum(vals.cashbackPct)));
  const ongkir       = Math.max(0, safeNum(vals.ongkir));
  const biayaLayanan = Math.max(0, safeNum(vals.biayaLayanan));

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

  const hematEfektif     = (hargaAwal - subtotalDiskon) + voucherTerpakai + cashbackNominal;
  const netLoss          = biayaEfektif > hargaAwal;
  const diskonEfektif    = safeDivide(hematEfektif, hargaAwal) * 100;
  const diskonBertingkat = safeDivide(hargaAwal - subtotalDiskon, hargaAwal) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={fields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        warning={
          netLoss
            ? {
                show: true,
                message:
                  "Total biaya efektif melebihi harga awal. Ongkir + biaya layanan lebih besar dari semua diskon yang didapat.",
              }
            : undefined
        }
        summary={[
          { label: "Bayar Checkout", value: formatRupiah(bayarCheckout) },
          { label: "Cashback",       value: formatRupiah(cashbackNominal), valueColor: "text-green-600" },
        ]}
      />

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
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

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Rincian Perhitungan
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Harga setelah diskon bertingkat", value: formatRupiah(subtotalDiskon) },
              { label: "Diskon bertingkat efektif",       value: formatPct(diskonBertingkat) },
              { label: "Voucher terpakai",                value: formatRupiah(voucherTerpakai) },
              { label: "Subtotal setelah voucher",        value: formatRupiah(subtotalSetelahVoucher) },
              { label: "Total bayar checkout",            value: formatRupiah(bayarCheckout) },
              { label: "Cashback",                        value: formatRupiah(cashbackNominal) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer note="Cashback dan voucher aktual tergantung syarat & ketentuan platform." />
      </div>
    </div>
  );
}
