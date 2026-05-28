"use client";

import type { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";

interface Props {
  user: User;
}

export function AdminHeader({ user }: Props) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-white px-6">
      <div className="text-sm text-muted">
        {/* Breadcrumb placeholder — filled by page */}
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-xl border border-line px-3 py-2">
          <UserIcon className="h-4 w-4 text-muted" />
          <span className="text-sm font-medium text-ink">{user.email}</span>
        </div>
        <form action="/admin-logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </form>
      </div>
    </header>
  );
}
