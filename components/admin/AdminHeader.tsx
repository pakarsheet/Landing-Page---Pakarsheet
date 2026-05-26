"use client";

import type { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  user: User;
}

export function AdminHeader({ user }: Props) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="text-sm text-gray-500">
        {/* Breadcrumb placeholder — filled by page */}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
          <UserIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{user.email}</span>
        </div>
        <Link
          href="/admin-logout"
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Link>
      </div>
    </header>
  );
}
