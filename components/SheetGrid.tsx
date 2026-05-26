/**
 * SheetGrid — decorative animated spreadsheet grid background.
 * Used in Hero, ToolsHero, and tool detail pages.
 * Accepts optional highlight cell positions so each page can have
 * a slightly different pattern while sharing the same animation logic.
 */

const COLS = 9;
const ROWS = 7;
const CW = 100 / COLS;
const CH = 100 / ROWS;

type HighlightCell = { col: number; row: number; delay: string };

const DEFAULT_CELLS: HighlightCell[] = [
  { col: 0, row: 0, delay: "0s" },
  { col: 3, row: 1, delay: "0.8s" },
  { col: 6, row: 0, delay: "1.6s" },
  { col: 1, row: 3, delay: "2.0s" },
  { col: 5, row: 4, delay: "1.1s" },
  { col: 8, row: 2, delay: "0.4s" },
  { col: 2, row: 5, delay: "1.8s" },
];

type Props = {
  cells?: HighlightCell[];
  /** Extra Tailwind class for the outer wrapper, e.g. "rounded-[32px]" */
  className?: string;
};

export function SheetGrid({ cells = DEFAULT_CELLS, className = "rounded-[32px]" }: Props) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(to right, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CW}%)`,
            `repeating-linear-gradient(to bottom, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CH}%)`,
          ].join(", "),
        }}
      />

      {/* Highlight cells — pulse in/out */}
      {cells.map(({ col, row, delay }, i) => (
        <div
          key={i}
          className="sheet-cell absolute"
          style={{
            left: `${col * CW}%`,
            top: `${row * CH}%`,
            width: `${CW}%`,
            height: `${CH}%`,
            background: "rgba(139,237,2,0.18)",
            animationDelay: delay,
          }}
        />
      ))}

      {/* Row sweep — slides top → bottom */}
      <div
        className="sheet-row-sweep absolute inset-x-0"
        style={{
          height: `${CH}%`,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,237,2,0.12) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
