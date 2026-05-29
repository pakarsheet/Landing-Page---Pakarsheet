"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  /** Optional dot/swatch color class e.g. "bg-cobalt" */
  color?: string;
}

interface Props {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function CustomSelect({
  name,
  options,
  defaultValue,
  value: controlledValue,
  onChange,
  placeholder = "Pilih…",
  required,
}: Props) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value);

  function handleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen((v) => !v);
  }

  function handleSelect(val: string) {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    setOpen(false);
  }

  // Close on scroll
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  return (
    <>
      {/* Hidden native input for form submission */}
      <input type="hidden" name={name} value={value} required={required} />

      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 text-sm shadow-sm outline-none transition ${
          open
            ? "border-cobalt ring-2 ring-cobalt/12"
            : "border-ink/12 hover:border-ink/25"
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.color && (
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${selected.color}`} />
          )}
          <span className={`font-secondary text-sm ${selected ? "text-ink" : "text-ink/35"}`}>
            {selected?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink/35 transition duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 z-[200]" onClick={() => setOpen(false)} />
            <div
              className="absolute z-[201] overflow-hidden rounded-xl border border-ink/10 bg-white py-1 shadow-soft"
              style={{ top: coords.top, left: coords.left, width: coords.width }}
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-ink/4 ${
                      isSelected ? "bg-ink/3" : ""
                    }`}
                  >
                    {opt.color ? (
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${opt.color}`} />
                    ) : (
                      <span className="h-2.5 w-2.5 shrink-0" />
                    )}
                    <span className="flex-1 font-secondary text-sm font-medium text-ink">{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-cobalt" />}
                  </button>
                );
              })}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
