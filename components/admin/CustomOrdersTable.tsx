"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Search, X, MessageCircle, ChevronDown } from "lucide-react";
import {
  deleteOrder,
  updateOrderStatus,
  type OrderStatus,
} from "@/app/admin/custom-orders/actions";
import { toast } from "@/components/admin/Toast";
import type { CustomOrder } from "@/lib/supabase/types";

interface Props {
  orders: CustomOrder[];
}

const STATUS_CONFIG: Record<
  CustomOrder["status"],
  { label: string; bg: string; text: string; dot: string }
> = {
  baru:          { label: "Baru",        bg: "bg-sheet/20",   text: "text-ink",      dot: "bg-sheet" },
  dihubungi:     { label: "Dihubungi",   bg: "bg-blush",      text: "text-cobalt",   dot: "bg-cobalt" },
  negosiasi:     { label: "Negosiasi",   bg: "bg-blush",      text: "text-cobalt",   dot: "bg-cobalt/60" },
  deal:          { label: "Deal ✓",      bg: "bg-sheet/30",   text: "text-ink",      dot: "bg-sheet" },
  "tidak-jadi":  { label: "Tidak Jadi",  bg: "bg-red-50",     text: "text-red-500",  dot: "bg-red-400" },
};

const PACKAGE_LABELS: Record<string, string> = {
  "rapikan":       "Paket Rapikan",
  "bangun-ulang":  "Paket Bangun Ulang",
  "sistem-tim":    "Paket Sistem Tim",
};

function buildWaMessage(order: CustomOrder): string {
  const pkg = PACKAGE_LABELS[order.package] ?? order.package;
  const msg = `Halo ${order.name}, terima kasih sudah menghubungi Pakarsheet!\n\nKami sudah menerima brief kamu untuk *${pkg}*. Boleh kita diskusi lebih lanjut mengenai kebutuhan spreadsheet kamu?`;
  const number = order.whatsapp.replace(/\D/g, "").replace(/^0/, "62");
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export function CustomOrdersTable({ orders }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | CustomOrder["status"]>("all");
  const [filterPackage, setFilterPackage] = useState<"all" | string>("all");

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      search === "" ||
      o.name.toLowerCase().includes(q) ||
      o.whatsapp.includes(q) ||
      (o.business_name ?? "").toLowerCase().includes(q) ||
      o.business_type.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchPackage = filterPackage === "all" || o.package === filterPackage;
    return matchSearch && matchStatus && matchPackage;
  });

  const counts = {
    baru:         orders.filter((o) => o.status === "baru").length,
    dihubungi:    orders.filter((o) => o.status === "dihubungi").length,
    negosiasi:    orders.filter((o) => o.status === "negosiasi").length,
    deal:         orders.filter((o) => o.status === "deal").length,
    "tidak-jadi": orders.filter((o) => o.status === "tidak-jadi").length,
  };

  function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus inquiry dari "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteOrder(id);
      setDeletingId(null);
      if (result?.error) {
        toast.error("Gagal menghapus: " + result.error);
      } else {
        toast.success(`Inquiry dari "${name}" berhasil dihapus.`);
        router.refresh();
      }
    });
  }

  function handleStatusChange(id: string, status: OrderStatus) {
    setUpdatingId(id);
    startTransition(async () => {
      const result = await updateOrderStatus(id, status);
      setUpdatingId(null);
      if (result?.error) {
        toast.error("Gagal update status: " + result.error);
      } else {
        toast.success("Status berhasil diperbarui.");
        router.refresh();
      }
    });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const statusTabs = [
    { key: "all" as const, label: "Semua", count: orders.length },
    ...Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
      key: key as CustomOrder["status"],
      label: cfg.label,
      count: counts[key as CustomOrder["status"]],
    })),
  ];

  return (
    <div className="space-y-4">
      {/* ── Status tabs ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {statusTabs.map((tab) => {
          const isActive = filterStatus === tab.key;
          const cfg = tab.key !== "all" ? STATUS_CONFIG[tab.key] : null;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-ink text-white shadow-sm"
                  : "border border-ink/10 bg-white text-ink/55 hover:border-ink/20 hover:text-ink"
              }`}
            >
              {cfg && !isActive && (
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              )}
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-ink/8 text-ink/50"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search & package filter ───────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, WA, bisnis…"
            className="w-full rounded-xl border border-ink/12 bg-white py-2.5 pl-10 pr-9 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
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
        <div className="relative">
          <select
            value={filterPackage}
            onChange={(e) => setFilterPackage(e.target.value)}
            className="appearance-none rounded-xl border border-ink/12 bg-white py-2.5 pl-4 pr-9 text-sm text-ink shadow-sm outline-none transition focus:border-cobalt"
          >
            <option value="all">Semua Paket</option>
            <option value="rapikan">Paket Rapikan</option>
            <option value="bangun-ulang">Paket Bangun Ulang</option>
            <option value="sistem-tim">Paket Sistem Tim</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
        </div>
      </div>

      {/* ── Table / Empty ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white py-16 text-center">
          <p className="text-sm font-medium text-ink/50">
            {search || filterStatus !== "all" || filterPackage !== "all"
              ? "Tidak ada inquiry yang cocok."
              : "Belum ada inquiry masuk."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/6 bg-ink/2">
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Klien
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Paket
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Bisnis
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Masuk
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-ink/40">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((o) => {
                  const statusCfg = STATUS_CONFIG[o.status];
                  return (
                    <tr key={o.id} className="group transition hover:bg-ink/2">
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-semibold text-ink">{o.name}</p>
                          <p className="text-xs text-ink/45">{o.whatsapp}</p>
                          {o.business_name && (
                            <p className="text-xs text-ink/30">{o.business_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-lg bg-blush px-2.5 py-1 text-xs font-semibold text-cobalt">
                          {PACKAGE_LABELS[o.package] ?? o.package}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-ink/50">
                        {o.business_type}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="relative">
                          <select
                            value={o.status}
                            disabled={updatingId === o.id || deletingId === o.id}
                            onChange={(e) =>
                              handleStatusChange(o.id, e.target.value as OrderStatus)
                            }
                            className={`cursor-pointer appearance-none rounded-lg border-0 py-1 pl-2.5 pr-7 text-xs font-semibold outline-none transition disabled:opacity-50 ${statusCfg.bg} ${statusCfg.text}`}
                          >
                            <option value="baru">Baru</option>
                            <option value="dihubungi">Dihubungi</option>
                            <option value="negosiasi">Negosiasi</option>
                            <option value="deal">Deal ✓</option>
                            <option value="tidak-jadi">Tidak Jadi</option>
                          </select>
                          <ChevronDown className={`pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 ${statusCfg.text}`} />
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-ink/45">
                        {formatDate(o.created_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-0.5 opacity-60 transition group-hover:opacity-100">
                          <a
                            href={buildWaMessage(o)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-ink/50 transition hover:bg-[#25D366]/10 hover:text-[#25D366]"
                            title="Buka WA dengan template pesan"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                          <Link
                            href={`/admin/custom-orders/${o.id}`}
                            className="rounded-lg p-1.5 text-ink/50 transition hover:bg-blush hover:text-cobalt"
                            title="Lihat detail"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(o.id, o.name)}
                            disabled={deletingId === o.id || updatingId === o.id}
                            className="rounded-lg p-1.5 text-ink/50 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-ink/6 bg-ink/1 px-5 py-3">
            <p className="text-xs text-ink/40">
              Menampilkan {filtered.length} dari {orders.length} inquiry
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
