import { AdminLoginForm } from "./AdminLoginForm";
import Image from "next/image";

export const metadata = { title: "Admin Login — Pakarsheet" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image src="/logo.png" alt="Pakarsheet logo" width={48} height={48} className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Pakarsheet Admin</h1>
            <p className="mt-1 text-sm text-gray-500">Masuk untuk mengelola konten</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
