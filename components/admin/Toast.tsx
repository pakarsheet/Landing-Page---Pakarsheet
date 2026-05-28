"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

// ── Global event bus ──────────────────────────────────────────────────────────

type Listener = (toast: ToastItem) => void;
const listeners: Listener[] = [];

export function toast(type: ToastType, message: string) {
  const item: ToastItem = { id: Math.random().toString(36).slice(2), type, message };
  listeners.forEach((fn) => fn(item));
}

toast.success = (message: string) => toast("success", message);
toast.error = (message: string) => toast("error", message);
toast.warning = (message: string) => toast("warning", message);

// ── Provider component ────────────────────────────────────────────────────────

export function ToastProvider() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler: Listener = (item) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => remove(item.id), 4000);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [remove]);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} onClose={() => remove(item.id)} />
      ))}
    </div>
  );
}

// ── Single toast card ─────────────────────────────────────────────────────────

const config = {
  success: {
    icon: CheckCircle2,
    bg: "bg-leaf border-leaf",
    text: "text-cobalt",
    iconColor: "text-cobalt",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-blush border-line",
    text: "text-ink",
    iconColor: "text-muted",
  },
};

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const { icon: Icon, bg, text, iconColor } = config[item.type];

  return (
    <div
      className={`flex min-w-[280px] max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-soft ${bg} animate-in slide-in-from-bottom-2 fade-in duration-200`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${text}`}>{item.message}</p>
      <button
        onClick={onClose}
        className={`shrink-0 rounded-lg p-0.5 transition hover:opacity-60 ${text}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
