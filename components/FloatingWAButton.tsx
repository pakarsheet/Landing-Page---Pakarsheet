import { FloatingWAButtonClient } from "./FloatingWAButtonClient";
import { getSiteSettings, buildWaUrl } from "@/lib/supabase/queries";
import { site } from "@/lib/site";

interface Props {
  href?: string;
}

export async function FloatingWAButton({ href }: Props = {}) {
  const resolvedHref = href ?? buildWaUrl(await getSiteSettings()) ?? site.contactUrl;
  return <FloatingWAButtonClient href={resolvedHref} />;
}
