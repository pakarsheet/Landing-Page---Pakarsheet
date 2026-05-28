import {
  WalletCards,
  FileSpreadsheet, LayoutDashboard, BookOpen, MessageCircle, Shield,
} from "lucide-react";
import { getActiveProducts } from "@/lib/supabase/queries";
import { PricingClient } from "./PricingClient";
import type { Product } from "@/lib/supabase/types";

const included = [
  { icon: FileSpreadsheet, label: "Template siap pakai",          accent: "bg-sheet text-ink"   },
  { icon: LayoutDashboard, label: "Dashboard & formula otomatis", accent: "bg-sky text-cobalt"  },
  { icon: BookOpen,        label: "Panduan penggunaan lengkap",   accent: "bg-lilac text-ink"   },
  { icon: MessageCircle,   label: "Support setup via WhatsApp",   accent: "bg-leaf text-cobalt" },
  { icon: Shield,          label: "Lisensi 1 akun, lifetime",     accent: "bg-sky text-cobalt"  },
];

// Fallback values if Supabase is unavailable
const FALLBACK_PRICE = "Rp149rb";
const FALLBACK_CTA_URL = "/shop";

export async function Pricing() {
  const products = await getActiveProducts();
  // Use the first active product as the featured pricing item
  const featured: Product | undefined = products[0];

  const price = featured?.price ?? FALLBACK_PRICE;
  const ctaUrl = featured?.cta_url ?? FALLBACK_CTA_URL;
  const productSlug = featured?.slug;

  return (
    <section id="pricing" className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* Header */}
        <div className="price-header mb-10 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
            <WalletCards className="h-4 w-4" />
            Harga
          </p>
          <h2 className="text-balance font-primary text-[32px] font-semibold leading-[1.1] tracking-[-0.8px] text-ink sm:text-[44px] sm:tracking-[-1.5px] lg:text-[52px] lg:tracking-[-2.5px]">
            Satu harga. Sekali bayar.<br className="hidden sm:block" /> Selamanya.
          </h2>
          <p className="mx-auto mt-4 max-w-sm font-secondary text-[16px] leading-[1.65] text-muted">
            Tidak ada langganan, tidak ada biaya tersembunyi.
          </p>
        </div>

        {/* Main card — animations handled client-side */}
        <PricingClient
          price={price}
          ctaUrl={ctaUrl}
          productSlug={productSlug}
          included={included.map((i) => ({ label: i.label, accent: i.accent, iconName: i.icon.displayName ?? i.icon.name }))}
        />

      </div>
    </section>
  );
}
