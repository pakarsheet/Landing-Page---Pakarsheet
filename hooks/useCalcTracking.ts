"use client";

import { useEffect, useRef, useState } from "react";
import { trackToolEvent } from "@/lib/tools";
import { stripThousands } from "@/lib/formatInput";

/**
 * useCalcTracking
 *
 * Shared state + analytics tracking logic for all calculator components.
 *
 * Handles:
 * - tool_visited event (fires once on mount)
 * - tool_calculated event (fires after 3+ field interactions)
 * - vals state + update() handler (strips thousand separators before storing)
 * - reset() handler (clears all fields and bumps resetKey for controlled inputs)
 */
export function useCalcTracking<T extends Record<string, string>>(
  slug: string,
  defaultVals: T
) {
  const [vals, setVals] = useState<T>(defaultVals);
  const [resetKey, setResetKey] = useState(0);

  const visitedFired     = useRef(false);
  const interactionCount = useRef(0);
  const calculatedFired  = useRef(false);

  useEffect(() => {
    if (visitedFired.current) return;
    visitedFired.current = true;
    trackToolEvent("tool_visited", slug);
  }, [slug]);

  const emptyVals = Object.fromEntries(
    Object.keys(defaultVals).map((k) => [k, ""])
  ) as T;

  const reset = () => {
    setVals(emptyVals);
    setResetKey((k) => k + 1);
  };

  const update = (id: string, value: string) => {
    const raw = stripThousands(value);
    setVals((prev) => ({ ...prev, [id]: raw }));
    interactionCount.current += 1;
    if (interactionCount.current >= 3 && !calculatedFired.current) {
      calculatedFired.current = true;
      trackToolEvent("tool_calculated", slug);
    }
  };

  return { vals, resetKey, reset, update };
}
