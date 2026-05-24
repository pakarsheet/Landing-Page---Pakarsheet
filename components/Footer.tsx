import { navItems } from "@/lib/data";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-white px-4 py-10 sm:px-5 lg:px-10">
      <div className="mx-auto flex max-w-[1068px] flex-col gap-8 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink font-primary text-lg font-semibold text-white">P</span>
            <span className="font-primary text-lg font-semibold text-ink">{site.name}</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">{site.description}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-bold text-muted transition hover:text-ink">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
