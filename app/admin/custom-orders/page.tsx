import { createAdminClient } from "@/lib/supabase/admin";
import { CustomOrdersTable } from "@/components/admin/CustomOrdersTable";
import { ClipboardList, Inbox } from "lucide-react";

export const metadata = { title: "Custom Orders — Admin Pakarsheet" };

export default async function AdminCustomOrdersPage() {
  const supabase = createAdminClient();
  const { data: orders, error } = await supabase
    .from("custom_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        Gagal memuat data: {error.message}
      </div>
    );
  }

  const newCount = (orders ?? []).filter((o) => o.status === "baru").length;
  const dealCount = (orders ?? []).filter((o) => o.status === "deal").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                newCount > 0 ? "bg-sheet" : "bg-sheet/20"
              }`}
            >
              <ClipboardList className="h-4.5 w-4.5 text-ink" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                Custom Orders
              </h1>
              {newCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-sheet px-2.5 py-0.5 text-xs font-bold text-ink">
                  {newCount} baru
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-ink/50">
              {orders?.length ?? 0} inquiry masuk
            </span>
            {dealCount > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-ink/20" />
                <span className="text-sm font-semibold text-ink/70">
                  {dealCount} deal ✓
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {(orders ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-white py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5">
            <Inbox className="h-7 w-7 text-ink/30" />
          </div>
          <h3 className="font-semibold text-ink">Belum ada inquiry</h3>
          <p className="mt-1 max-w-xs text-sm text-ink/50">
            Inquiry dari halaman{" "}
            <a
              href="/custom"
              target="_blank"
              className="text-cobalt underline underline-offset-2"
            >
              /custom
            </a>{" "}
            akan muncul di sini.
          </p>
        </div>
      ) : (
        <CustomOrdersTable orders={orders ?? []} />
      )}
    </div>
  );
}
