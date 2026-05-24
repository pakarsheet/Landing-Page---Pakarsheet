import { Suspense } from "react";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-card">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-ink font-primary text-base font-semibold text-white">
            P
          </span>
          <span className="font-primary text-lg font-semibold text-ink">
            Pakarsheet Admin
          </span>
        </div>

        <h1 className="font-primary text-2xl font-semibold tracking-tight text-ink">
          Masuk ke Admin
        </h1>
        <p className="mt-1 font-secondary text-sm text-muted">
          Masukkan password admin untuk melanjutkan.
        </p>

        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
