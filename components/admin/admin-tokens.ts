/**
 * Admin Design Tokens — Pakarsheet
 * Single source of truth untuk semua class yang dipakai di admin UI.
 * Import dari sini, jangan hardcode class berulang di komponen.
 */

// ── Surface & Background ──────────────────────────────────────────────────────
export const surface = {
  page:    "bg-[#f4f6fb]",          // halaman background
  card:    "bg-white",              // card / panel
  subtle:  "bg-ink/[0.02]",         // header section dalam card
  hover:   "hover:bg-[#f4f6fb]",    // row hover
  input:   "bg-white",
} as const;

// ── Border ────────────────────────────────────────────────────────────────────
export const border = {
  base:    "border border-ink/8",
  subtle:  "border border-ink/6",
  strong:  "border border-ink/12",
  dashed:  "border border-dashed border-ink/15",
  focus:   "focus:border-cobalt focus:ring-2 focus:ring-cobalt/12",
  divider: "border-t border-ink/6",
} as const;

// ── Shadow ────────────────────────────────────────────────────────────────────
export const shadow = {
  card:     "shadow-sm",
  elevated: "shadow-card",
  soft:     "shadow-soft",
} as const;

// ── Radius ────────────────────────────────────────────────────────────────────
export const radius = {
  sm:   "rounded-lg",       // badge, chip kecil
  md:   "rounded-xl",       // button, input, pill
  lg:   "rounded-2xl",      // card, panel
  xl:   "rounded-3xl",      // modal
} as const;

// ── Typography ────────────────────────────────────────────────────────────────
export const text = {
  // Page-level
  pageTitle:   "text-2xl font-bold tracking-tight text-ink",
  pageSubtitle: "text-sm text-muted mt-1",

  // Section
  sectionTitle: "text-sm font-semibold text-ink",
  sectionDesc:  "text-xs text-ink/45",

  // Card
  cardTitle:   "text-base font-bold text-ink",
  cardMeta:    "text-xs text-muted",

  // Table
  tableHead:   "text-[11px] font-bold uppercase tracking-wider text-ink/40",
  tableCell:   "text-sm text-ink",
  tableMeta:   "text-xs text-ink/45",

  // Label / hint
  label:       "text-sm font-medium text-ink",
  hint:        "text-xs text-ink/40",

  // Stat
  statLabel:   "text-xs font-semibold uppercase tracking-wider text-muted",
  statValue:   "text-4xl font-bold tracking-tight text-ink",
  statSub:     "text-sm text-muted",

  // Misc
  muted:       "text-sm text-muted",
  tiny:        "text-[11px] text-ink/40",
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────────
export const spacing = {
  cardPad:     "p-6",       // dashboard stat cards
  panelPad:    "p-5",       // list cards, form sections body
  sectionHead: "px-5 py-4", // FormSection header
  tableCell:   "px-5 py-3.5",
  tableHead:   "px-5 py-3",
  pageGap:     "space-y-6",
} as const;

// ── Icon Badge ────────────────────────────────────────────────────────────────
export const iconBadge = {
  sm:  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
  md:  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
  lg:  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
} as const;

// ── Button ────────────────────────────────────────────────────────────────────
export const btn = {
  primary:   "flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cobalt disabled:opacity-60",
  secondary: "flex items-center gap-2 rounded-xl border border-ink/12 px-5 py-2.5 text-sm font-semibold text-ink/60 transition hover:border-ink/25 hover:text-ink disabled:opacity-60",
  danger:    "flex items-center gap-2 rounded-xl border border-ink/12 px-4 py-2.5 text-sm font-semibold text-ink/45 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60",
  icon:      "flex h-8 w-8 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink/40 shadow-sm transition hover:border-ink/20 hover:text-ink disabled:opacity-30",
  iconSm:    "flex h-7 w-7 items-center justify-center rounded-lg text-ink/40 transition hover:bg-ink/6 hover:text-ink",
} as const;

// ── Input ─────────────────────────────────────────────────────────────────────
export const input = {
  base:     "h-11 w-full rounded-xl border border-ink/12 bg-white px-4 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12",
  textarea: "w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12",
} as const;

// ── Badge / Chip ──────────────────────────────────────────────────────────────
export const badge = {
  base:      "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
  green:     "bg-sheet/25 text-ink",
  blue:      "bg-blush text-cobalt",
  gray:      "bg-ink/6 text-ink/45",
  red:       "bg-red-50 text-red-500",
  amber:     "bg-amber-50 text-amber-700",
} as const;

// ── Stat Pill (halaman list) ──────────────────────────────────────────────────
export const statPill = "flex items-center gap-2.5 rounded-xl border border-line bg-white px-5 py-3 shadow-sm";

// ── Empty State ───────────────────────────────────────────────────────────────
export const emptyState = {
  wrap:  "flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-white py-16 text-center",
  icon:  "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5",
  label: "text-sm font-medium text-ink/60",
} as const;

// ── Table ─────────────────────────────────────────────────────────────────────
export const table = {
  wrap:   "overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-sm",
  head:   "border-b border-ink/6 bg-ink/[0.02]",
  row:    "group transition hover:bg-[#f4f6fb]",
  footer: "border-t border-ink/6 bg-ink/[0.02] px-5 py-3",
} as const;

// ── Toolbar (search + filter) ─────────────────────────────────────────────────
export const toolbar = {
  wrap:        "flex flex-col gap-3 sm:flex-row sm:items-center",
  searchWrap:  "relative flex-1",
  searchInput: "h-11 w-full rounded-xl border border-ink/12 bg-white pl-10 pr-9 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 focus:border-cobalt focus:ring-2 focus:ring-cobalt/12",
  filterWrap:  "flex flex-wrap gap-1.5",
  filterBtn:   (active: boolean) =>
    `flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
      active
        ? "bg-ink text-white shadow-sm"
        : "border border-ink/10 bg-white text-ink/50 hover:bg-ink/5 hover:text-ink"
    }`,
  filterCount: (active: boolean) =>
    `rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
      active ? "bg-white/20 text-white" : "bg-ink/8 text-ink/50"
    }`,
} as const;
