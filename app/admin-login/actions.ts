"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
// Cookie hidup 7 hari
const MAX_AGE = 60 * 60 * 24 * 7;

export async function loginAction(
  formData: FormData,
  from: string
): Promise<{ error: string } | never> {
  const password = formData.get("password")?.toString() ?? "";
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return { error: "Admin belum dikonfigurasi." };
  }

  if (password !== secret) {
    return { error: "Password salah. Coba lagi." };
  }

  // Set cookie httpOnly — tidak bisa dibaca JS di browser
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  // Redirect ke halaman admin (atau halaman asal)
  const destination = from.startsWith("/admin") ? from : "/admin";
  redirect(destination);
}
