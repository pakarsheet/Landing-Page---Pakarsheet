/**
 * Server component — fetch WA settings dari Sanity, lalu render client button.
 * Dipakai hanya di app/page.tsx (landing page).
 * Menerima prop `href` opsional; jika tidak diberikan, fetch sendiri dari Sanity.
 */
import { getSiteSettings, buildWaUrl } from "@/lib/sanity/settings";
import { FloatingWAButtonClient } from "./FloatingWAButtonClient";

interface Props {
  href?: string;
}

export async function FloatingWAButton({ href }: Props = {}) {
  const resolvedHref =
    href ?? buildWaUrl(await getSiteSettings());
  return <FloatingWAButtonClient href={resolvedHref} />;
}
