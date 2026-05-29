import { createAdminClient } from "@/lib/supabase/admin";
import { Inbox, MessageCircle, Handshake, Clock } from "lucide-react";
import { CustomOrdersTable } from "@/components/admin/CustomOrdersTable";

export const metadata = { title: "Custom Orders — Admin Pakarsheet" };

export default async function AdminCustomOrdersPage() {
  const supabase = createAdminClient();
  const { data: orders, error } = await supabase
    .from("custom_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        Gagal memuat orders: {error.message}
      </div>
    );
  }

  const all          = orders ?? [];
  const baruCount      = all.filter((o) => o.status === "baru").length;
  const dihubungiCount = all.filter((o) => o.status === "dihubungi").length;
  const negosiasiCount = all.filter((o) => o.status === "negosiasi").length;
  const dealCount      = all.filter((o) => o.status === "deal").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Custom Orders</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted">
          <span>{all.length} total</span>
          {baruCount > 0 && (
            <>
              <span className="h-1 w-1 rounded-full bg-line" />
              <span className="font-semibold text-cobalt">{baruCount} baru</span>
            </>
          )}
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 shadow-sm">
          <Inbox className="h-3.5 w-3.5 text-cobalt" />
          <span className="text-sm font-semibold text-ink">{baruCount}</span>
          <span className="text-sm text-muted">Baru</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 shadow-sm">
          <MessageCircle className="h-3.5 w-3.5 text-muted" />
          <span className="text-sm font-semibold text-ink">{dihubungiCount}</span>
          <span className="text-sm text-muted">Dihubungi</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 shadow-sm">
          <Clock className="h-3.5 w-3.5 text-muted" />
          <span className="text-sm font-semibold text-ink">{negosiasiCount}</span>
          <span className="text-sm text-muted">Negosiasi</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 shadow-sm">
          <Handshake className="h-3.5 w-3.5 text-muted" />
          <span className="text-sm font-semibold text-ink">{dealCount}</span>
          <span className="text-sm text-muted">Deal</span>
        </div>
      </div>

      {/* Alert — ada order baru */}
      {baruCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-cobalt/20 bg-sky/30 px-5 py-3.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt text-xs font-bold text-white">
            {baruCount}
          </span>
          <p className="text-sm font-semibold text-ink">
            {baruCount === 1
              ? "Ada 1 order baru yang belum dihubungi."
              : `Ada ${baruCount} order baru yang belum dihubungi.`}
          </p>
        </div>
      )}

      <CustomOrdersTable orders={all} />
    </div>
  );
}
