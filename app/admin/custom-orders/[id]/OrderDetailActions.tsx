"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2, StickyNote, Activity } from "lucide-react";
import {
  updateOrderStatus,
  updateOrderNotes,
  deleteOrder,
  type OrderStatus,
} from "@/app/admin/custom-orders/actions";
import { toast } from "@/components/admin/Toast";
import type { CustomOrder } from "@/lib/supabase/types";

interface Props {
  order: CustomOrder;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string; desc: string; dot: string }[] = [
  { value: "baru",        label: "Baru",        desc: "Belum difollow up",           dot: "bg-sheet" },
  { value: "dihubungi",   label: "Dihubungi",   desc: "Sudah WA, menunggu respons",  dot: "bg-cobalt" },
  { value: "negosiasi",   label: "Negosiasi",   desc: "Sedang diskusi scope/harga",  dot: "bg-cobalt/60" },
  { value: "deal",        label: "Deal ✓",      desc: "Jadi order",                  dot: "bg-sheet" },
  { value: "tidak-jadi",  label: "Tidak Jadi",  desc: "Batal / tidak respons",       dot: "bg-red-400" },
];

export function OrderDetailActions({ order }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [notes, setNotes] = useState(order.admin_notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleStatusChange(newStatus: OrderStatus) {
    setStatus(newStatus);
    setUpdatingStatus(true);
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, newStatus);
      setUpdatingStatus(false);
      if (result?.error) {
        toast.error("Gagal update status: " + result.error);
        setStatus(order.status as OrderStatus);
      } else {
        toast.success("Status diperbarui.");
        router.refresh();
      }
    });
  }

  function handleSaveNotes() {
    setSavingNotes(true);
    startTransition(async () => {
      const result = await updateOrderNotes(order.id, notes);
      setSavingNotes(false);
      if (result?.error) {
        toast.error("Gagal menyimpan catatan: " + result.error);
      } else {
        toast.success("Catatan disimpan.");
      }
    });
  }

  function handleDelete() {
    if (
      !confirm(
        `Hapus inquiry dari "${order.name}"? Tindakan ini tidak bisa dibatalkan.`
      )
    )
      return;
    setDeleting(true);
    startTransition(async () => {
      const result = await deleteOrder(order.id);
      if (result?.error) {
        setDeleting(false);
        toast.error("Gagal menghapus: " + result.error);
      } else {
        toast.success("Inquiry berhasil dihapus.");
        router.push("/admin/custom-orders");
      }
    });
  }

  return (
    <>
      {/* Status */}
      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-ink/6 bg-ink/1 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sheet/20">
            <Activity className="h-4 w-4 text-ink" />
          </span>
          <p className="text-sm font-semibold text-ink">Status Lead</p>
        </div>
        <div className="space-y-1.5 p-4">
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                status === opt.value
                  ? "border-ink/20 bg-ink/4"
                  : "border-transparent hover:border-ink/10 hover:bg-ink/2"
              } ${updatingStatus ? "pointer-events-none opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={status === opt.value}
                onChange={() => handleStatusChange(opt.value)}
                className="accent-cobalt"
              />
              <span className={`h-2 w-2 shrink-0 rounded-full ${opt.dot}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{opt.label}</p>
                <p className="text-xs text-ink/45">{opt.desc}</p>
              </div>
              {updatingStatus && status === opt.value && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cobalt" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Admin notes */}
      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-ink/6 bg-ink/1 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blush">
            <StickyNote className="h-4 w-4 text-cobalt" />
          </span>
          <p className="text-sm font-semibold text-ink">Catatan Admin</p>
        </div>
        <div className="p-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Catatan internal, hasil diskusi, harga yang disepakati, dll…"
            className="w-full resize-none rounded-xl border border-ink/12 bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12"
          />
          <button
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cobalt disabled:opacity-60"
          >
            {savingNotes ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {savingNotes ? "Menyimpan…" : "Simpan Catatan"}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-red-50/50 px-5 py-3.5">
          <p className="text-xs font-bold uppercase tracking-wider text-red-400">
            Zona Berbahaya
          </p>
        </div>
        <div className="p-4">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            {deleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {deleting ? "Menghapus…" : "Hapus Inquiry Ini"}
          </button>
        </div>
      </div>
    </>
  );
}
