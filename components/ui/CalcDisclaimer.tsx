import { Info } from "lucide-react";

type Props = {
  note?: string;
};

export function CalcDisclaimer({ note }: Props) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-line/60 bg-white/60 px-4 py-3">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted/50" aria-hidden="true" />
      <p className="font-secondary text-[11px] leading-[1.6] text-muted/60">
        <span className="font-semibold text-muted/80">Estimasi.</span>{" "}
        Hasil menggunakan rumus standar sebagai gambaran awal. Angka aktual dapat berbeda tergantung kondisi bisnis dan kebijakan platform.
        {note && <> {note}</>}
      </p>
    </div>
  );
}
