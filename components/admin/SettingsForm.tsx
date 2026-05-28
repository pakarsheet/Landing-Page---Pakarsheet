"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/supabase/types";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "@/components/admin/Toast";

interface Props {
  settings: SiteSettings | null;
}

export function SettingsForm({ settings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (!settings?.id) {
        setError("Settings tidak ditemukan. Jalankan SQL schema terlebih dahulu.");
        return;
      }
      const result = await updateSiteSettings(settings.id, formData);
      if (result?.error) {
        setError(result.error);
        toast.error("Gagal menyimpan: " + result.error);
      } else {
        toast.success("Pengaturan berhasil disimpan.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* WhatsApp */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted">WhatsApp</h2>
        <div className="space-y-4">
          <Field label="Nomor WhatsApp" hint="Format internasional tanpa + (contoh: 6281234567890)">
            <input
              name="whatsapp_number"
              required
              defaultValue={settings?.whatsapp_number ?? ""}
              className={inputCls}
              placeholder="6281234567890"
            />
          </Field>
          <Field label="Pesan Default WA">
            <textarea
              name="whatsapp_message"
              required
              rows={3}
              defaultValue={settings?.whatsapp_message ?? ""}
              className={inputCls}
              placeholder="Halo Pakarsheet, saya ingin tahu lebih lanjut..."
            />
          </Field>
          {settings && (
            <div className="rounded-xl border border-line bg-blush/30 px-4 py-3">
              <p className="text-xs font-medium text-muted">Preview URL WA:</p>
              <p className="mt-1 break-all text-xs text-ink">{settings.contact_url}</p>
            </div>
          )}
        </div>
      </div>

      {/* Brand */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted">Brand</h2>
        <div className="space-y-4">
          <Field label="Nama Situs">
            <input
              name="site_name"
              required
              defaultValue={settings?.site_name ?? "Pakarsheet"}
              className={inputCls}
            />
          </Field>
          <Field label="Tagline">
            <input
              name="tagline"
              required
              defaultValue={settings?.tagline ?? ""}
              className={inputCls}
              placeholder="Bikin Google Sheets kamu naik level."
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cobalt disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/15";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted/70">{hint}</p>}
    </div>
  );
}
