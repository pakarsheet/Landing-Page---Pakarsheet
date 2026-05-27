"use client";

import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef } from "./CalcInputPanel";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-komisi-reseller";

const defaultVals = {
  hargaJual:       "150000",
  hpp:             "60000",
  biayaOps:        "5000",
  targetMarginOwn: "20",
  targetOmzet:     "10000000",
};

const fields: CalcFieldDef[] = [
  { id: "hargaJual",       label: "Harga Jual ke Konsumen",      hint: "Harga yang dibayar konsumen akhir",                    prefix: "Rp" },
  { id: "hpp",             label: "HPP / Modal per Unit",        hint: "Biaya pokok barang per unit",                          prefix: "Rp" },
  { id: "biayaOps",        label: "Biaya Operasional per Unit",  hint: "Packaging, ongkir, dan biaya lain yang kamu tanggung", prefix: "Rp" },
  { id: "targetMarginOwn", label: "Target Margin Kamu (%)",      hint: "Margin minimum yang ingin kamu pertahankan setelah komisi diberikan", suffix: "%" },
  { id: "targetOmzet",     label: "Target Omzet Reseller/Bulan", hint: "Estimasi omzet yang dihasilkan satu reseller per bulan", prefix: "Rp" },
];

export function KalkulatorKomisiReseller() {
  const { vals, resetKey, reset, update } = useCalcTracking(SLUG, defaultVals);

  const hargaJual       = Math.max(0, safeNum(vals.hargaJual));
  const hpp             = Math.max(0, safeNum(vals.hpp));
  const biayaOps        = Math.max(0, safeNum(vals.biayaOps));
  const targetMarginOwn = Math.min(99, Math.max(0, safeNum(vals.targetMarginOwn)));
  const targetOmzet     = Math.max(0, safeNum(vals.targetOmzet));

  const totalModal      = hpp + biayaOps;
  // Profit yang tersedia setelah modal dan target margin owner
  const profitTersedia  = hargaJual - totalModal;
  const marginOwner     = hargaJual * (targetMarginOwn / 100);
  const komisiMaksimal  = Math.max(0, profitTersedia - marginOwner);
  const komisiPctMax    = safeDivide(komisiMaksimal, hargaJual) * 100;

  // Harga beli reseller = harga jual - komisi
  const hargaBeliReseller = hargaJual - komisiMaksimal;
  const marginOwnerAktual = safeDivide(hargaJual - totalModal - komisiMaksimal, hargaJual) * 100;

  // Estimasi unit terjual per bulan per reseller
  const unitPerBulan    = hargaJual > 0 ? Math.floor(safeDivide(targetOmzet, hargaJual)) : 0;
  const komisiPerBulan  = komisiMaksimal * unitPerBulan;
  const profitOwnerBulan = (hargaJual - totalModal - komisiMaksimal) * unitPerBulan;

  // Tiers komisi yang disarankan
  const tiers = [
    { label: "Tier 1 (Pemula)",    pct: Math.min(komisiPctMax, komisiPctMax * 0.5) },
    { label: "Tier 2 (Aktif)",     pct: Math.min(komisiPctMax, komisiPctMax * 0.75) },
    { label: "Tier 3 (Top Seller)",pct: komisiPctMax },
  ].map((t) => ({
    ...t,
    nominal: hargaJual * (t.pct / 100),
    hargaBeli: hargaJual * (1 - t.pct / 100),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={fields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        warning={
          komisiMaksimal <= 0
            ? { show: true, message: "Tidak ada ruang untuk komisi — HPP + biaya ops + target margin sudah melebihi harga jual. Naikkan harga jual atau turunkan target margin." }
            : undefined
        }
        summary={[
          { label: "Komisi Maks.",    value: formatRupiah(komisiMaksimal),  valueColor: "text-cobalt" },
          { label: "Margin Owner",    value: formatPct(marginOwnerAktual),  valueColor: marginOwnerAktual >= targetMarginOwn ? "text-green-600" : "text-red-600" },
        ]}
      />

      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Komisi Maksimal Aman"
          value={formatPct(komisiPctMax)}
          subtitle={`Nominal: ${formatRupiah(komisiMaksimal)} · Harga beli reseller: ${formatRupiah(hargaBeliReseller)}`}
          {...marginStatus(marginOwnerAktual)}
        />

        {/* Tier komisi */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Saran Struktur Tier Komisi
            </p>
          </div>
          <ul className="divide-y divide-line">
            {tiers.map(({ label, pct, nominal, hargaBeli }) => (
              <li key={label} className="px-6 py-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-secondary text-sm font-semibold text-ink">{label}</span>
                  <span className="font-secondary text-sm font-bold text-cobalt">{formatPct(pct)}</span>
                </div>
                <div className="mt-1 flex gap-4">
                  <span className="font-secondary text-xs text-muted">Komisi: {formatRupiah(nominal)}</span>
                  <span className="font-secondary text-xs text-muted">Harga beli: {formatRupiah(hargaBeli)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Proyeksi per reseller */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Proyeksi per Reseller / Bulan
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Estimasi unit terjual",     value: `${unitPerBulan.toLocaleString("id-ID")} unit` },
              { label: "Komisi yang dibayar",       value: formatRupiah(komisiPerBulan) },
              { label: "Profit owner dari reseller",value: formatRupiah(profitOwnerBulan) },
              { label: "Harga beli reseller",       value: formatRupiah(hargaBeliReseller) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer note="Komisi yang terlalu tinggi bisa membuat reseller jual di bawah harga pasaran dan merusak brand. Tetapkan harga jual minimum untuk reseller." />
      </div>
    </div>
  );
}
