"use client";

import { useRef, useState, useTransition } from "react";
import {
  CheckCircle2, MessageCircle, ArrowRight, Loader2,
  User, Phone, Building2, Briefcase, FileText,
  FolderOpen, Users, Zap,
} from "lucide-react";
import { submitCustomOrder } from "./actions";

const PACKAGES = [
  { value: "modifikasi", label: "Custom Modifikasi", sub: "Ubah / Tambah dari Template Eksis — Rp249rb" },
  { value: "total",      label: "Custom Total",       sub: "Bikin dari Nol / Dari Excel Berantakan — Rp499rb" },
  { value: "sistem-tim", label: "Custom Sistem + Otomatisasi", sub: "Untuk Tim / Multi-Divisi — Rp999rb" },
  { value: "rekomendasi", label: "Belum tahu, minta rekomendasi", sub: "" },
];

const URGENCY = [
  { value: "santai",   label: "Santai (2–4 minggu)" },
  { value: "normal",   label: "Normal (1–2 minggu)" },
  { value: "segera",   label: "Segera (< 1 minggu)" },
];

const TEAM_SIZE = [
  { value: "1",    label: "Hanya saya" },
  { value: "2-5",  label: "2–5 orang" },
  { value: "6-15", label: "6–15 orang" },
  { value: "15+",  label: "Lebih dari 15 orang" },
];

type SuccessData = {
  whatsapp: string;
  package: string;
  name: string;
};

function SuccessState({ data, waNumber }: { data: SuccessData; waNumber: string }) {
  const pkg = PACKAGES.find((p) => p.value === data.package);
  const waMsg = encodeURIComponent(
    `Halo Pakarsheet, saya ${data.name} baru saja mengisi form custom order untuk paket ${pkg?.label ?? data.package}. Boleh lanjut konsultasi?`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;

  return (
    <div className="flex flex-col items-center gap-6 rounded-3xl border border-line bg-white px-6 py-12 text-center shadow-card sm:px-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sheet/30">
        <CheckCircle2 className="h-8 w-8 text-cobalt" />
      </div>
      <div>
        <h3 className="font-primary text-2xl font-semibold tracking-tight text-ink">
          Order masuk, {data.name}!
        </h3>
        <p className="mt-2 font-secondary text-base leading-relaxed text-muted">
          Data kamu sudah kami terima. Langkah selanjutnya, chat kami di WhatsApp untuk mulai konsultasi — gratis, tanpa komitmen.
        </p>
      </div>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex h-14 items-center gap-2 rounded-full bg-ink px-8 font-secondary text-base font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt"
      >
        <MessageCircle className="h-5 w-5" />
        Lanjut Chat di WhatsApp
        <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
      </a>
      <p className="font-secondary text-xs text-muted/60">
        Kami biasanya membalas dalam 1–2 jam di hari kerja.
      </p>
    </div>
  );
}

export function CustomOrderForm({ waNumber }: { waNumber: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [selectedPackage, setSelectedPackage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitCustomOrder(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.success) {
        setSuccess({
          whatsapp: result.whatsapp!,
          package: result.package!,
          name: result.name!,
        });
        formRef.current?.reset();
        setSelectedPackage("");
      }
    });
  }

  if (success) {
    return <SuccessState data={success} waNumber={waNumber} />;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"
    >
      <div className="mb-7">
        <h3 className="font-primary text-2xl font-semibold tracking-tight text-ink">
          Isi form, kami hubungi kamu
        </h3>
        <p className="mt-1.5 font-secondary text-sm leading-relaxed text-muted">
          Tidak perlu komitmen dulu — cerita kebutuhan kamu, kami bantu carikan solusinya.
        </p>
      </div>

      <div className="space-y-5">

        {/* Row 1 — Nama + Nomor WA */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
              <User className="h-3.5 w-3.5 text-muted" />
              Nama kamu <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              required
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-ink/12 bg-white px-4 py-2.5 font-secondary text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/30 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
              <Phone className="h-3.5 w-3.5 text-muted" />
              Nomor WhatsApp <span className="text-red-400">*</span>
            </label>
            <input
              name="whatsapp"
              required
              type="tel"
              placeholder="08xx atau +628xx"
              className="w-full rounded-xl border border-ink/12 bg-white px-4 py-2.5 font-secondary text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/30 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
            />
          </div>
        </div>

        {/* Row 2 — Nama Bisnis + Jenis Bisnis */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
              <Building2 className="h-3.5 w-3.5 text-muted" />
              Nama bisnis
              <span className="ml-1 font-secondary text-xs font-normal text-muted">(opsional)</span>
            </label>
            <input
              name="business_name"
              placeholder="Contoh: Toko Maju Jaya"
              className="w-full rounded-xl border border-ink/12 bg-white px-4 py-2.5 font-secondary text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/30 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
              <Briefcase className="h-3.5 w-3.5 text-muted" />
              Jenis bisnis <span className="text-red-400">*</span>
            </label>
            <input
              name="business_type"
              required
              placeholder="Contoh: Toko online, kuliner, jasa, dll"
              className="w-full rounded-xl border border-ink/12 bg-white px-4 py-2.5 font-secondary text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/30 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
            />
          </div>
        </div>

        {/* Pilih Paket */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
            <Zap className="h-3.5 w-3.5 text-muted" />
            Paket yang diminati <span className="text-red-400">*</span>
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {PACKAGES.map((pkg) => (
              <label
                key={pkg.value}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition duration-150 ${
                  selectedPackage === pkg.value
                    ? "border-cobalt bg-sky/30 shadow-sm"
                    : "border-ink/10 bg-white hover:border-ink/25"
                }`}
              >
                <input
                  type="radio"
                  name="package"
                  value={pkg.value}
                  required
                  checked={selectedPackage === pkg.value}
                  onChange={() => setSelectedPackage(pkg.value)}
                  className="mt-0.5 accent-cobalt"
                />
                <div>
                  <p className="font-secondary text-sm font-semibold text-ink">{pkg.label}</p>
                  {pkg.sub && (
                    <p className="mt-0.5 font-secondary text-xs text-muted">{pkg.sub}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
          <input type="hidden" name="package" value={selectedPackage} />
        </div>

        {/* Deskripsi kebutuhan */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
            <FileText className="h-3.5 w-3.5 text-muted" />
            Ceritakan kebutuhan kamu <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Contoh: Saya punya toko online dengan 3 admin. Butuh sheet untuk tracking order harian, stok, dan laporan penjualan bulanan otomatis..."
            className="w-full resize-none rounded-xl border border-ink/12 bg-white px-4 py-3 font-secondary text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/30 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
          />
        </div>

        {/* Row — Punya file lama + Ukuran tim */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
              <FolderOpen className="h-3.5 w-3.5 text-muted" />
              Punya file spreadsheet lama?
            </label>
            <div className="flex gap-2">
              {[
                { value: "yes", label: "Ya, ada" },
                { value: "no",  label: "Tidak ada" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2.5 font-secondary text-sm font-semibold text-ink transition hover:border-ink/25 has-[:checked]:border-cobalt has-[:checked]:bg-sky/30"
                >
                  <input type="radio" name="has_old_file" value={opt.value} className="accent-cobalt" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
              <Users className="h-3.5 w-3.5 text-muted" />
              Ukuran tim
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TEAM_SIZE.map((t) => (
                <label
                  key={t.value}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2.5 font-secondary text-sm font-semibold text-ink transition hover:border-ink/25 has-[:checked]:border-cobalt has-[:checked]:bg-sky/30"
                >
                  <input type="radio" name="team_size" value={t.value} className="accent-cobalt" />
                  {t.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Urgensi */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 font-secondary text-sm font-semibold text-ink">
            <Zap className="h-3.5 w-3.5 text-muted" />
            Seberapa cepat dibutuhkan?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {URGENCY.map((u) => (
              <label
                key={u.value}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2.5 font-secondary text-sm font-semibold text-ink transition hover:border-ink/25 has-[:checked]:border-cobalt has-[:checked]:bg-sky/30"
              >
                <input type="radio" name="urgency" value={u.value} className="accent-cobalt" />
                {u.label}
              </label>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-secondary text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-secondary text-base font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <MessageCircle className="h-5 w-5" />
              Kirim & Lanjut ke WhatsApp
              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-center font-secondary text-xs text-muted/60">
          Data kamu aman dan tidak akan dibagikan ke pihak lain.
        </p>
      </div>
    </form>
  );
}
