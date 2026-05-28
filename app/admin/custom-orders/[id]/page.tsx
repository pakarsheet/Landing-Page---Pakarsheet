import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, User, Briefcase, ClipboardList } from "lucide-react";
import { OrderDetailActions } from "./OrderDetailActions";

export const metadata = { title: "Detail Inquiry — Admin Pakarsheet" };

const PACKAGE_LABELS: Record<string, string> = {
  "rapikan":      "Paket Rapikan",
  "bangun-ulang": "Paket Bangun Ulang",
  "sistem-tim":   "Paket Sistem Tim",
};

const STATUS_CONFIG = {
  baru:          { label: "Baru",        bg: "bg-sheet/20",  text: "text-ink",     dot: "bg-sheet" },
  dihubungi:     { label: "Dihubungi",   bg: "bg-blush",     text: "text-cobalt",  dot: "bg-cobalt" },
  negosiasi:     { label: "Negosiasi",   bg: "bg-blush",     text: "text-cobalt",  dot: "bg-cobalt/60" },
  deal:          { label: "Deal ✓",      bg: "bg-sheet/30",  text: "text-ink",     dot: "bg-sheet" },
  "tidak-jadi":  { label: "Tidak Jadi",  bg: "bg-red-50",    text: "text-red-500", dot: "bg-red-400" },
} as const;

const TEAM_SIZE_LABELS: Record<string, string> = {
  "1":   "Hanya saya (1 orang)",
  "2-5": "2–5 orang",
  "5+":  "Lebih dari 5 orang",
};

const URGENCY_LABELS: Record<string, string> = {
  "santai":      "Tidak mendesak",
  "1-2-minggu":  "1–2 minggu ke depan",
  "segera":      "Segera / ASAP",
};

function buildWaMessage(name: string, whatsapp: string, pkg: string): string {
  const pkgLabel = PACKAGE_LABELS[pkg] ?? pkg;
  const msg = `Halo ${name}, terima kasih sudah menghubungi Pakarsheet!\n\nKami sudah menerima brief kamu untuk *${pkgLabel}*. Boleh kita diskusi lebih lanjut mengenai kebutuhan spreadsheet kamu?`;
  const number = whatsapp.replace(/\D/g, "").replace(/^0/, "62");
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("custom_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) notFound();

  const statusCfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
  const waUrl = buildWaMessage(order.name, order.whatsapp, order.package);

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <Link
          href="/admin/custom-orders"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 transition hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Custom Orders
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sheet/20">
              <User className="h-5 w-5 text-ink" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink">{order.name}</h1>
              <p className="text-sm text-ink/50">{formatDate(order.created_at)}</p>
            </div>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ── Main info ──────────────────────────────────────────── */}
        <div className="space-y-4 lg:col-span-2">
          {/* Identitas */}
          <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-ink/6 bg-ink/1 px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blush">
                <User className="h-4 w-4 text-cobalt" />
              </span>
              <p className="text-sm font-semibold text-ink">Identitas Klien</p>
            </div>
            <dl className="grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold text-ink/40">Nama</dt>
                <dd className="mt-1 font-semibold text-ink">{order.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-ink/40">WhatsApp</dt>
                <dd className="mt-1 font-semibold text-ink">{order.whatsapp}</dd>
              </div>
              {order.business_name && (
                <div>
                  <dt className="text-xs font-semibold text-ink/40">Nama Bisnis</dt>
                  <dd className="mt-1 font-semibold text-ink">{order.business_name}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-semibold text-ink/40">Jenis Bisnis</dt>
                <dd className="mt-1 font-semibold text-ink">{order.business_type}</dd>
              </div>
            </dl>
          </div>

          {/* Kebutuhan */}
          <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-ink/6 bg-ink/1 px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sheet/20">
                <ClipboardList className="h-4 w-4 text-ink" />
              </span>
              <p className="text-sm font-semibold text-ink">Detail Kebutuhan</p>
            </div>
            <dl className="space-y-4 p-5">
              <div>
                <dt className="text-xs font-semibold text-ink/40">Paket Diminati</dt>
                <dd className="mt-1.5">
                  <span className="rounded-xl bg-blush px-3 py-1.5 text-sm font-semibold text-cobalt">
                    {PACKAGE_LABELS[order.package] ?? order.package}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-ink/40">Deskripsi Kebutuhan</dt>
                <dd className="mt-1.5 rounded-xl border border-ink/6 bg-ink/2 p-4 text-sm leading-relaxed text-ink">
                  {order.description}
                </dd>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold text-ink/40">Punya File Lama?</dt>
                  <dd className="mt-1 text-sm font-medium text-ink">
                    {order.has_old_file ? "Ya, punya" : "Tidak / dari nol"}
                  </dd>
                </div>
                {order.team_size && (
                  <div>
                    <dt className="text-xs font-semibold text-ink/40">Jumlah Pengguna</dt>
                    <dd className="mt-1 text-sm font-medium text-ink">
                      {TEAM_SIZE_LABELS[order.team_size] ?? order.team_size}
                    </dd>
                  </div>
                )}
                {order.urgency && (
                  <div>
                    <dt className="text-xs font-semibold text-ink/40">Urgensi</dt>
                    <dd className="mt-1 text-sm font-medium text-ink">
                      {URGENCY_LABELS[order.urgency] ?? order.urgency}
                    </dd>
                  </div>
                )}
              </div>
            </dl>
          </div>
        </div>

        {/* ── Sidebar actions ────────────────────────────────────── */}
        <div className="space-y-4">
          {/* WA shortcut */}
          <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-ink/6 bg-ink/1 px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#25D366]/10">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
              </span>
              <p className="text-sm font-semibold text-ink">Hubungi Klien</p>
            </div>
            <div className="p-5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe5d]"
              >
                <MessageCircle className="h-4 w-4" />
                Buka WhatsApp
              </a>
              <p className="mt-2.5 text-center text-xs text-ink/40">
                Pesan template sudah terisi otomatis
              </p>
            </div>
          </div>

          {/* Status & notes — client component */}
          <OrderDetailActions order={order} />
        </div>
      </div>
    </div>
  );
}
