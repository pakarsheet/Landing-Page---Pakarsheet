import { ChevronDown, BookOpen } from "lucide-react";
import type { ToolContent } from "@/lib/tool-content";

interface Props {
  content: ToolContent;
  toolTitle: string;
}

export function ToolSEOContent({ content, toolTitle }: Props) {
  return (
    <div className="mt-16 space-y-12">

      {/* ── Formula callout ──────────────────────────────────── */}
      {content.formula && (
        <div className="rounded-3xl border border-line bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-6 py-6 sm:px-8">
          <p className="font-secondary text-xs font-bold uppercase tracking-[0.1em] text-cobalt">
            Rumus Dasar
          </p>
          <p className="mt-2 font-primary text-[18px] font-semibold leading-[1.4] tracking-[-0.3px] text-ink sm:text-[22px]">
            {content.formula}
          </p>
        </div>
      )}

      {/* ── How to use ───────────────────────────────────────── */}
      <div>
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky text-cobalt">
            <BookOpen className="h-4 w-4" />
          </span>
          <h2 className="font-primary text-[22px] font-semibold leading-[1.2] tracking-[-0.4px] text-ink">
            Cara menggunakan {toolTitle}
          </h2>
        </div>
        <ol className="space-y-3">
          {content.howToUse.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sheet font-secondary text-sm font-bold text-ink">
                {i + 1}
              </span>
              <p className="pt-0.5 font-secondary text-base leading-[1.56] text-muted">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {content.faqs.length > 0 && (
        <div>
          <h2 className="mb-5 font-primary text-[22px] font-semibold leading-[1.2] tracking-[-0.4px] text-ink">
            Pertanyaan yang sering ditanya
          </h2>
          <div className="space-y-3">
            {content.faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-[28px] border border-line bg-white shadow-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                  <span className="font-primary text-[17px] font-semibold leading-[1.25] tracking-[-0.3px] text-ink">
                    {faq.q}
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-cobalt transition duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5">
                  <p className="font-secondary text-base leading-[1.56] text-muted">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
