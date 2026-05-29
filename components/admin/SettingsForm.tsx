"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/supabase/types";
import { Loader2, AlertTriangle, Save, MessageSquare, Palette, ExternalLink } from "lucide-react";
import { toast } from "@/components/admin/Toast";

interface Props { settings: SiteSettings | null }

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* WhatsApp */}
      <FormSection
        icon={<MessageSquare className="h-4 w-4 text-[#25D366]" />}
        iconBg="bg-[#25D366]/10"
        title="WhatsApp"
        desc="Nomor dan pesan default untuk tombol WA di website."
      >
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
            className={textareaCls}
            placeholder="Halo Pakarsheet, saya ingin tahu lebih lanjut..."
          />
        </Field>
        {settings?.contact_url && (
          <div className="flex items-start gap-2.5 rounded-xl border border-ink/8 bg-ink/[0.02] px-4 py-3">
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/35" />
            <div>
              <p className="text-xs font-semibold text-ink/45">Preview URL WA</p>
              <p className="mt-0.5 break-all text-xs text-ink/70">{settings.contact_url}</p>
            </div>
          </div>
        )}
      </FormSection>

      {/* Brand */}
      <FormSection
        icon={<Palette className="h-4 w-4 text-cobalt" />}
        iconBg="bg-blush"
        title="Brand"
        desc="Nama situs dan tagline yang tampil di website."
      >
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
      </FormSection>

      {/* Submit */}
      <div className="flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cobalt disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isPending ? "Menyimpan…" : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "h-11 w-full rounded-xl border border-ink/12 bg-white px-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12";

const textareaCls =
  "w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12";

// ── Sub-components ────────────────────────────────────────────────────────────

function FormSection({
  icon, iconBg, title, desc, children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-ink/6 bg-ink/[0.02] px-5 py-4">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="text-xs text-ink/45">{desc}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink/40">{hint}</p>}
    </div>
  );
}
