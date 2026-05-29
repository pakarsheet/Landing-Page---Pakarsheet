"use client";

import React, { useState, useTransition } from "react";
import ReactDOM from "react-dom";
import { useRouter } from "next/navigation";
import {
  MessageCircle, ChevronDown, Search, X,
  StickyNote, Check, Clock, Handshake, XCircle,
  Inbox, Building2, Users, Zap, Calendar,
  FolderOpen,
} from "lucide-react";
import { updateCustomOrderStatus, saveCustomOrderNotes } from "@/app/admin/custom-orders/actions";
import { toast } from "@/components/admin/Toast";
import type { CustomOrder } from "@/lib/supabase/types";

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  CustomOrder["status"],
  { label: string; bg: string; text: string; dot: string; icon: React.ElementType }
> = {
  baru:         { label: "Baru",       bg: "bg-cobalt/10", text: "text-cobalt",  dot: "bg-cobalt",  icon: Inbox       },
  dihubungi:    { label: "Dihubungi",  bg: "bg-sky",       text: "text-cobalt",  dot: "bg-cobalt",  icon: MessageCircle },
  negosiasi:    { label: "Negosiasi",  bg: "bg-sheet/40",  text: "text-ink",     dot: "bg-sheet",   icon: Clock       },
  deal:         { label: "Deal ✓",     bg: "bg-leaf",      text: "text-cobalt",  dot: "bg-cobalt",  icon: Handshake   },
  "tidak-jadi": { label: "Tidak Jadi", bg: "bg-ink/6",     text: "text-ink/40",  dot: "bg-ink/20",  icon: XCircle     },
};

const STATUS_ORDER: CustomOrder["status"][] = [
  "baru", "dihubungi", "negosiasi", "deal", "tidak-jadi",
];

const PACKAGE_CONFIG: Record<string, { label: string; color: string }> = {
  modifikasi:   { label: "Modifikasi",           color: "bg-sky text-cobalt"    },
  total:        { label: "Custom Total",          color: "bg-sheet text-ink"     },
  "sistem-tim": { label: "Sistem + Otomatisasi",  color: "bg-lilac text-ink"     },
  rekomendasi:  { label: "Minta Rekomendasi",     color: "bg-blush text-cobalt"  },
  "belum-tahu": { label: "Belum tahu",            color: "bg-blush text-cobalt"  },
};

const URGENCY_LABEL: Record<string, string> = {
  santai: "Santai (2–4 minggu)",
  normal: "Normal (1–2 minggu)",
  segera: "Segera (< 1 minggu)",
};

const TEAM_LABEL: Record<string, string> = {
  "1":    "Hanya saya",
  "2-5":  "2–5 orang",
  "6-15": "6–15 orang",
  "15+":  "15+ orang",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CustomOrder["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Status dropdown (portal) ──────────────────────────────────────────────────

function StatusDropdown({
  order,
  onUpdate,
}: {
  order: CustomOrder;
  onUpdate: (id: string, status: CustomOrder["status"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = React.useRef<HTMLButtonElement>(null);

  function handleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    }
    setOpen((v) => !v);
  }

  return (
    <div>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-1 py-1 shadow-sm transition hover:border-ink/20"
      >
        <StatusBadge status={order.status} />
        <ChevronDown className={`mr-1 h-3.5 w-3.5 text-ink/35 transition duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && typeof window !== "undefined" && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div
            className="absolute z-[101] min-w-[170px] overflow-hidden rounded-xl border border-ink/10 bg-white shadow-soft"
            style={{ top: coords.top, left: coords.left }}
          >
            {STATUS_ORDER.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              return (
                <button
                  key={s}
                  onClick={() => { onUpdate(order.id, s); setOpen(false); }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition hover:bg-ink/4 ${
                    order.status === s ? "bg-ink/3" : ""
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${cfg.text}`} />
                  <span className="flex-1 font-semibold text-ink">{cfg.label}</span>
                  {order.status === s && <Check className="h-3.5 w-3.5 text-cobalt" />}
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

// ── Inline notes editor ───────────────────────────────────────────────────────

function NotesEditor({ order }: { order: CustomOrder }) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(order.admin_notes ?? "");
  const [, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    startTransition(async () => {
      const result = await saveCustomOrderNotes(order.id, notes);
      if (result?.error) {
        toast.error("Gagal simpan catatan: " + result.error);
      } else {
        toast.success("Catatan disimpan.");
        router.refresh();
      }
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          autoFocus
          placeholder="Tulis catatan internal…"
          className="w-full resize-none rounded-xl border border-cobalt/30 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-cobalt/15"
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cobalt"
          >
            Simpan
          </button>
          <button
            onClick={() => { setEditing(false); setNotes(order.admin_notes ?? ""); }}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-ink/50 transition hover:bg-ink/5"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group flex w-full items-start gap-2 rounded-xl border border-dashed border-ink/12 bg-ink/2 px-3 py-2.5 text-left transition hover:border-cobalt/30 hover:bg-sky/20"
    >
      <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/25 transition group-hover:text-cobalt" />
      <span className={`text-sm leading-relaxed ${notes ? "text-ink/70" : "italic text-ink/30"}`}>
        {notes || "Tambah catatan…"}
      </span>
    </button>
  );
}

// ── Order card ────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onStatusUpdate,
}: {
  order: CustomOrder;
  onStatusUpdate: (id: string, status: CustomOrder["status"]) => void;
}) {
  const pkg = PACKAGE_CONFIG[order.package] ?? { label: order.package, color: "bg-blush text-cobalt" };
  const isNew = order.status === "baru";

  return (
    <div className={`group rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:shadow-card ${
      isNew ? "border-cobalt/25" : "border-ink/8"
    }`}>
      {/* ── Top row ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Left: name + WA */}
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-primary text-base font-bold ${
            isNew ? "bg-cobalt text-white" : "bg-ink/8 text-ink"
          }`}>
            {order.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-primary text-base font-semibold text-ink">{order.name}</p>
            <p className="font-secondary text-xs text-muted">+{order.whatsapp}</p>
          </div>
        </div>

        {/* Right: status dropdown + WA button */}
        <div className="flex items-center gap-2">
          <StatusDropdown order={order} onUpdate={onStatusUpdate} />
          <a
            href={`https://wa.me/${order.whatsapp}?text=${encodeURIComponent(`Halo ${order.name}, kami dari Pakarsheet ingin menindaklanjuti permintaan custom order kamu.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-leaf px-3.5 py-2 font-secondary text-sm font-semibold text-cobalt transition hover:bg-sheet"
          >
            <MessageCircle className="h-4 w-4" />
            Chat WA
          </a>
        </div>
      </div>

      {/* ── Meta chips ── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {/* Paket */}
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-secondary text-xs font-semibold ${pkg.color}`}>
          {pkg.label}
        </span>
        {/* Bisnis */}
        {(order.business_name || order.business_type) && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2.5 py-1 font-secondary text-xs font-semibold text-ink/60">
            <Building2 className="h-3 w-3" />
            {order.business_name ? `${order.business_name} · ` : ""}{order.business_type}
          </span>
        )}
        {/* Tim */}
        {order.team_size && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2.5 py-1 font-secondary text-xs font-semibold text-ink/60">
            <Users className="h-3 w-3" />
            {TEAM_LABEL[order.team_size] ?? order.team_size}
          </span>
        )}
        {/* Urgensi */}
        {order.urgency && (
          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-secondary text-xs font-semibold ${
            order.urgency === "segera" ? "bg-red-50 text-red-500" :
            order.urgency === "normal" ? "bg-sheet/30 text-ink" :
            "bg-ink/5 text-ink/50"
          }`}>
            <Zap className="h-3 w-3" />
            {URGENCY_LABEL[order.urgency] ?? order.urgency}
          </span>
        )}
        {/* File lama */}
        {order.has_old_file && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/5 px-2.5 py-1 font-secondary text-xs font-semibold text-ink/60">
            <FolderOpen className="h-3 w-3" />
            Ada file lama
          </span>
        )}
        {/* Tanggal */}
        <span className="ml-auto inline-flex items-center gap-1.5 font-secondary text-xs text-muted">
          <Calendar className="h-3 w-3" />
          {formatDate(order.created_at)}
        </span>
      </div>

      {/* ── Deskripsi ── */}
      {order.description && (
        <div className="mt-4 rounded-xl bg-ink/3 px-4 py-3">
          <p className="font-secondary text-sm leading-relaxed text-ink/70 line-clamp-3">
            {order.description}
          </p>
        </div>
      )}

      {/* ── Catatan admin ── */}
      <div className="mt-3">
        <NotesEditor order={order} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  orders: CustomOrder[];
}

export function CustomOrdersTable({ orders }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<CustomOrder["status"] | "all">("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      search === "" ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.whatsapp.includes(search) ||
      (o.business_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      o.business_type.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleStatusUpdate(id: string, status: CustomOrder["status"]) {
    startTransition(async () => {
      const result = await updateCustomOrderStatus(id, status);
      if (result?.error) {
        toast.error("Gagal update status: " + result.error);
      } else {
        toast.success(`Status diubah ke "${STATUS_CONFIG[status].label}".`);
        router.refresh();
      }
    });
  }

  const counts = STATUS_ORDER.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
    {} as Record<string, number>
  );

  const filterTabs = [
    { key: "all" as const, label: "Semua", count: orders.length },
    ...STATUS_ORDER.map((s) => ({ key: s, label: STATUS_CONFIG[s].label, count: counts[s] })),
  ];

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, WA, jenis bisnis…"
            className="h-11 w-full rounded-xl border border-ink/12 bg-white pl-10 pr-9 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink/35 transition hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex h-11 items-center gap-1 overflow-x-auto rounded-xl border border-ink/10 bg-white px-1 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`shrink-0 flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                filterStatus === tab.key
                  ? "bg-ink text-white shadow-sm"
                  : "text-ink/50 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                  filterStatus === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-ink/8 text-ink/50"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-white py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5">
            <Inbox className="h-6 w-6 text-ink/30" />
          </div>
          <p className="text-sm font-medium text-ink/60">
            {search || filterStatus !== "all" ? "Tidak ada order yang cocok." : "Belum ada order masuk."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} />
          ))}
          <p className="px-1 text-xs text-ink/35">
            Menampilkan {filtered.length} dari {orders.length} order
          </p>
        </div>
      )}
    </div>
  );
}
