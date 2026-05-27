"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { formatThousands } from "@/lib/formatInput";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";
import { inputWrap, inputBase, prefixCls } from "./CalcInputPanel";

const SLUG = "kalkulator-bundling";

type BundleItem = {
  id: string;
  nama: string;
  hpp: string;
  hargaNormal: string;
  qty: string;
};

const defaultItems: BundleItem[] = [
  { id: "1", nama: "Produk A", hpp: "30000", hargaNormal: "55000", qty: "1" },
  { id: "2", nama: "Produk B", hpp: "20000", hargaNormal: "35000", qty: "1" },
];

const defaultVals = {
  hargaBundle:   "75000",
  targetMargin:  "20",
  biayaPack:     "3000",
  ongkirSeller:  "0",
};

let nextId = 3;

export function KalkulatorBundling() {
  const [items, setItems]   = useState<BundleItem[]>(defaultItems);
  const { vals, resetKey, reset: baseReset, update } = useCalcTracking(SLUG, defaultVals);

  const reset = () => {
    setItems(defaultItems);
    baseReset();
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: String(nextId++), nama: `Produk ${String.fromCharCode(64 + prev.length + 1)}`, hpp: "0", hargaNormal: "0", qty: "1" },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof BundleItem, value: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const hargaBundle  = Math.max(0, safeNum(vals.hargaBundle));
  const targetMargin = Math.min(99, Math.max(0, safeNum(vals.targetMargin)));
  const biayaPack    = Math.max(0, safeNum(vals.biayaPack));
  const ongkirSeller = Math.max(0, safeNum(vals.ongkirSeller));

  const totalHPP         = items.reduce((sum, i) => sum + safeNum(i.hpp) * Math.max(1, safeNum(i.qty, 1)), 0);
  const totalHargaNormal = items.reduce((sum, i) => sum + safeNum(i.hargaNormal) * Math.max(1, safeNum(i.qty, 1)), 0);
  const totalBiayaOps    = biayaPack + ongkirSeller;
  const totalModal       = totalHPP + totalBiayaOps;

  const profitBundle     = hargaBundle - totalModal;
  const marginPct        = safeDivide(profitBundle, hargaBundle) * 100;
  const diskonVsNormal   = totalHargaNormal > 0 ? safeDivide(totalHargaNormal - hargaBundle, totalHargaNormal) * 100 : 0;
  const hargaMinimum     = targetMargin < 100 ? safeDivide(totalModal, 1 - targetMargin / 100) : 0;
  const savingsPembeli   = Math.max(0, totalHargaNormal - hargaBundle);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">

      {/* ── Input Panel ─────────────────────────────────────────── */}
      <div className="rounded-3xl border border-line bg-white shadow-card">
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">Kalkulator</p>
            <h2 className="mt-0.5 font-primary text-lg font-semibold tracking-[-0.3px] text-ink">Parameter Input</h2>
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

        {/* Produk dalam bundle */}
        <div className="border-b border-line px-6 py-5">
          <p className="mb-4 font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
            Produk dalam Bundle
          </p>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={item.id} className="rounded-2xl border border-line bg-sky/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="font-secondary text-sm font-bold text-ink">Produk {idx + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Hapus produk ${idx + 1}`}
                      className="rounded-full p-1 text-muted transition hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Nama */}
                  <div className="sm:col-span-2">
                    <label className="mb-1 block font-secondary text-xs font-semibold text-ink">Nama Produk</label>
                    <div className={inputWrap}>
                      <input
                        type="text"
                        value={item.nama}
                        onChange={(e) => updateItem(item.id, "nama", e.target.value)}
                        className={inputBase}
                        placeholder="Nama produk"
                      />
                    </div>
                  </div>
                  {/* HPP */}
                  <div>
                    <label className="mb-1 block font-secondary text-xs font-semibold text-ink">HPP / Modal</label>
                    <div className={inputWrap}>
                      <span className={prefixCls} aria-hidden="true">Rp</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={formatThousands(item.hpp)}
                        onChange={(e) => updateItem(item.id, "hpp", e.target.value)}
                        className={inputBase}
                      />
                    </div>
                  </div>
                  {/* Harga Normal */}
                  <div>
                    <label className="mb-1 block font-secondary text-xs font-semibold text-ink">Harga Normal</label>
                    <div className={inputWrap}>
                      <span className={prefixCls} aria-hidden="true">Rp</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={formatThousands(item.hargaNormal)}
                        onChange={(e) => updateItem(item.id, "hargaNormal", e.target.value)}
                        className={inputBase}
                      />
                    </div>
                  </div>
                  {/* Qty */}
                  <div>
                    <label className="mb-1 block font-secondary text-xs font-semibold text-ink">Qty dalam Bundle</label>
                    <div className={inputWrap}>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                        className={inputBase}
                      />
                      <span className={prefixCls} aria-hidden="true">pcs</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-cobalt/40 px-4 py-2 font-secondary text-sm font-semibold text-cobalt transition hover:border-cobalt hover:bg-sky/30"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah produk
          </button>
        </div>

        {/* Harga bundle & biaya */}
        <div key={resetKey} className="grid gap-6 p-6 sm:grid-cols-2">
          {[
            { id: "hargaBundle",  label: "Harga Jual Bundle",    hint: "Harga yang kamu tawarkan untuk paket bundle ini", prefix: "Rp" },
            { id: "targetMargin", label: "Target Margin",         hint: "Margin minimum yang ingin kamu capai",            suffix: "%" },
            { id: "biayaPack",    label: "Packaging Bundle",      hint: "Biaya kemasan khusus untuk bundle",               prefix: "Rp" },
            { id: "ongkirSeller", label: "Subsidi Ongkir",        hint: "Biaya ongkir yang kamu tanggung per transaksi",   prefix: "Rp" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1 block font-secondary text-[15px] font-semibold text-ink">{f.label}</label>
              <p className="mb-2 font-secondary text-sm text-muted/60">{f.hint}</p>
              <div className={inputWrap}>
                {f.prefix && <span className={prefixCls} aria-hidden="true">{f.prefix}</span>}
                <input
                  id={f.id}
                  type="text"
                  inputMode="decimal"
                  value={f.prefix ? formatThousands(vals[f.id as keyof typeof defaultVals] ?? "") : (vals[f.id as keyof typeof defaultVals] ?? "")}
                  onChange={(e) => update(f.id, e.target.value)}
                  className={inputBase}
                />
                {f.suffix && <span className={prefixCls} aria-hidden="true">{f.suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-3xl border-t border-line bg-line">
          <div className="bg-white px-6 py-5">
            <p className="font-secondary text-xs text-muted/60">Total Modal Bundle</p>
            <p className="mt-1 font-secondary text-lg font-semibold text-ink">{formatRupiah(totalModal)}</p>
          </div>
          <div className="bg-white px-6 py-5">
            <p className="font-secondary text-xs text-muted/60">Profit Bundle</p>
            <p className={`mt-1 font-secondary text-lg font-semibold ${profitBundle >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatRupiah(profitBundle)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Margin Bundle"
          value={formatPct(marginPct)}
          subtitle={`Profit: ${formatRupiah(profitBundle)} · Hemat pembeli: ${formatRupiah(savingsPembeli)}`}
          {...marginStatus(marginPct)}
        />

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">Rincian Bundle</p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Total HPP semua produk",    value: formatRupiah(totalHPP) },
              { label: "Total harga normal",        value: formatRupiah(totalHargaNormal) },
              { label: "Harga bundle kamu",         value: formatRupiah(hargaBundle) },
              { label: "Diskon vs harga normal",    value: formatPct(diskonVsNormal) },
              { label: "Harga minimum (BEP)",       value: formatRupiah(hargaMinimum) },
              { label: "Hemat yang dirasakan pembeli", value: formatRupiah(savingsPembeli) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Per produk breakdown */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">HPP per Produk</p>
          </div>
          <ul className="divide-y divide-line">
            {items.map((item, idx) => {
              const qty     = Math.max(1, safeNum(item.qty, 1));
              const hppItem = safeNum(item.hpp) * qty;
              const pct     = safeDivide(hppItem, totalHPP) * 100;
              return (
                <li key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <span className="font-secondary text-sm text-muted">{item.nama || `Produk ${idx + 1}`}</span>
                  <span className="font-secondary text-sm font-semibold text-ink">
                    {formatRupiah(hppItem)} <span className="text-muted/60">({formatPct(pct)})</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <CalcDisclaimer note="Harga bundle yang terlalu murah bisa merusak persepsi nilai produk. Pastikan diskon masih terasa premium." />
      </div>
    </div>
  );
}
