/**
 * formatInput — numeric formatting utilities for calculator inputs.
 *
 * Manages display of values with Indonesian thousand separators (dots)
 * while keeping the raw numeric string for calculations.
 *
 * Rules:
 * - Only format fields marked as `currency: true` (Rp fields)
 * - Percentage / qty fields are left as-is
 * - Strips all dots before parsing so safeNum() works correctly
 * - Preserves cursor-friendly behaviour: user types digits, dots are injected
 */

/**
 * Format a raw numeric string with dot thousand separators.
 * e.g. "1500000" → "1.500.000"
 */
export function formatThousands(raw: string): string {
  const digits = raw.replace(/\./g, "").replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

/**
 * Strip thousand-separator dots so the value can be parsed as a number.
 * e.g. "1.500.000" → "1500000"
 */
export function stripThousands(formatted: string): string {
  return formatted.replace(/\./g, "");
}
