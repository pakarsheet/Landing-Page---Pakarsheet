import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/lib/data";
import { site } from "@/lib/site";

const legalLinks = [
  { label: "Kebijakan Privasi", href: "/privacy-policy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Kebijakan Refund",   href: "/refund-policy" },
];

export function Footer() {
  return (
    <footer className="bg-white px-4 py-10 sm:px-5 lg:px-10">
      <div className="mx-auto max-w-[1068px] border-t border-line pt-10">

        {/* Top row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Pakarsheet logo" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="font-primary text-xl font-semibold text-ink">{site.name}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{site.description}</p>

            {/* Social links */}
            <div className="mt-4 flex items-center gap-3">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links — use Next Link for internal routes */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {navItems.map((item) =>
              item.href.startsWith("/") ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-bold text-muted transition hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-bold text-muted transition hover:text-ink"
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* Bottom row — legal + copyright */}
        <div className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {site.name}. Hak cipta dilindungi.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold text-muted transition hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
