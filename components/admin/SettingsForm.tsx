"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/supabase/types";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  settings: SiteSettings | null;
}

export function SettingsForm({ settings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (!settings?.id) {
        setError("Settings tidak ditemukan. Jalankan SQL schema terlebih dahulu.");
        return;
      }
      const result = await updateSiteSettings(settings.id, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          Pengaturan berhasil disimpan.
        </div>
      )}

      {/* WhatsApp */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-900">WhatsApp</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nomor WhatsApp</label>
            <input
              name="whatsapp_number"
              required
              defaultValue={settings?.whatsapp_number ?? ""}
              className={inputCls}
              placeholder="6281234567890"
            />
            <p className="mt-1 text-xs text-gray-400">
              Format internasional tanpa + (contoh: 6281234567890)
            </p>
          </div>
          <div>
            <label className={labelCls}>Pesan Default WA</label>
            <textarea
              name="whatsapp_message"
              required
              rows={3}
              defaultValue={settings?.whatsapp_message ?? ""}
              className={inputCls}
              placeholder="Halo Pakarsheet, saya ingin tahu lebih lanjut..."
            />
          </div>
          {settings && (
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-500">Preview URL WA:</p>
              <p className="mt-1 break-all text-xs text-gray-700">{settings.contact_url}</p>
            </div>
          )}
        </div>
      </div>

      {/* Brand */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-gray-900">Brand</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nama Situs</label>
            <input
              name="site_name"
              required
              defaultValue={settings?.site_name ?? "Pakarsheet"}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Tagline</label>
            <input
              name="tagline"
              required
              defaultValue={settings?.tagline ?? ""}
              className={inputCls}
              placeholder="Bikin Google Sheets kamu naik level."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
