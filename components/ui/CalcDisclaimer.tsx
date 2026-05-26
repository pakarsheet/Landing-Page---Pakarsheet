import { Info } from "lucide-react";

type Props = {
  /** Extra note specific to this calculator, e.g. about marketplace fee variability */
  note?: string;
};

/**
 * Disclaimer estimasi yang ditampilkan di bawah setiap kalkulator.
 * Penting untuk liability dan membangun trust yang realistis.
 */
export function CalcDisclaimer({ note }: Props) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-line bg-sky/40 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" aria-hidden="true" />
      <p className="font-secondary text-xs leading-[1.6] text-muted">
        <span className="font-semibold text-ink">Hasil bersifat estimasi.</span>{" "}
        Kalkulator ini menggunakan rumus standar untuk memberikan gambaran awal.
        Angka aktual dapat berbeda tergantung kondisi bisnis, kebijakan platform, dan faktor lain yang tidak tercakup di sini.
        {note && (
          <>
            {" "}
            <span className="text-ink">{note}</span>
          </>
        )}
      </p>
    </div>
  );
}
