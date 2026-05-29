"use client";

import { useRef, useCallback, useState } from "react";
import {
  Bold, Italic, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon,
  Quote, Code, Minus, Eye,
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

interface Props {
  name: string;
  defaultValue?: string;
  required?: boolean;
}

type ToolbarAction =
  | "bold" | "italic" | "h2" | "h3"
  | "ul" | "ol" | "link" | "blockquote" | "code" | "hr";

// Grouped toolbar — null = separator
const TOOLBAR_GROUPS: ({ action: ToolbarAction; icon: React.ElementType; title: string } | null)[] = [
  { action: "bold",       icon: Bold,        title: "Bold"           },
  { action: "italic",     icon: Italic,      title: "Italic"         },
  null,
  { action: "h2",         icon: Heading2,    title: "Heading 2"      },
  { action: "h3",         icon: Heading3,    title: "Heading 3"      },
  null,
  { action: "ul",         icon: List,        title: "Unordered List" },
  { action: "ol",         icon: ListOrdered, title: "Ordered List"   },
  null,
  { action: "link",       icon: LinkIcon,    title: "Link"           },
  { action: "blockquote", icon: Quote,       title: "Blockquote"     },
  { action: "code",       icon: Code,        title: "Inline Code"    },
  { action: "hr",         icon: Minus,       title: "Divider"        },
];

export function RichTextEditor({ name, defaultValue = "", required }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const insertAround = useCallback(
    (before: string, after: string, placeholder: string) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = el.value.slice(start, end) || placeholder;
      const newVal =
        el.value.slice(0, start) + before + selected + after + el.value.slice(end);
      setValue(newVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 0);
    },
    []
  );

  const insertBlock = useCallback((template: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const before = el.value.slice(0, start);
    const after = el.value.slice(start);
    const prefix = before.length > 0 && !before.endsWith("\n") ? "\n" : "";
    const newVal = before + prefix + template + "\n" + after;
    setValue(newVal);
    setTimeout(() => {
      el.focus();
      const pos = before.length + prefix.length + template.length + 1;
      el.setSelectionRange(pos, pos);
    }, 0);
  }, []);

  function handleAction(action: ToolbarAction) {
    switch (action) {
      case "bold":       return insertAround("<strong>", "</strong>", "teks tebal");
      case "italic":     return insertAround("<em>", "</em>", "teks miring");
      case "h2":         return insertBlock("<h2>Judul Section</h2>");
      case "h3":         return insertBlock("<h3>Sub Judul</h3>");
      case "ul":         return insertBlock("<ul>\n  <li>Item pertama</li>\n  <li>Item kedua</li>\n</ul>");
      case "ol":         return insertBlock("<ol>\n  <li>Langkah pertama</li>\n  <li>Langkah kedua</li>\n</ol>");
      case "link": {
        const el = textareaRef.current;
        if (!el) return;
        const selected = el.value.slice(el.selectionStart, el.selectionEnd) || "teks link";
        const url = prompt("Masukkan URL:", "https://");
        if (!url) return;
        insertAround(`<a href="${url}">`, "</a>", selected);
        break;
      }
      case "blockquote": return insertBlock("<blockquote>Kutipan atau highlight penting di sini.</blockquote>");
      case "code":       return insertAround("<code>", "</code>", "kode");
      case "hr":         return insertBlock("<hr />");
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink/12 bg-white transition focus-within:border-cobalt focus-within:ring-2 focus-within:ring-cobalt/12">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-ink/8 bg-ink/[0.02] px-2 py-1.5">
        <div className="flex flex-1 flex-wrap items-center gap-0.5">
          {TOOLBAR_GROUPS.map((item, i) =>
            item === null ? (
              <span key={`sep-${i}`} className="mx-1 h-4 w-px bg-ink/10" />
            ) : (
              <button
                key={item.action}
                type="button"
                title={item.title}
                onClick={() => handleAction(item.action)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-white hover:text-ink"
              >
                <item.icon className="h-3.5 w-3.5" />
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            preview ? "bg-ink text-white" : "text-muted hover:bg-white hover:text-ink"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div
          className="prose-blog min-h-[400px] px-4 py-3"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(value) || "<p style='color:#4c5a73;font-style:italic'>Belum ada konten.</p>",
          }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          name={name}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={20}
          className="w-full resize-y bg-transparent px-4 py-3 font-mono text-sm text-ink outline-none"
          placeholder="<h2>Judul Section</h2><p>Isi artikel...</p>"
          spellCheck={false}
        />
      )}

      {/* Footer */}
      <div className="border-t border-ink/8 px-4 py-2">
        <p className="text-xs text-ink/35">
          HTML · Gunakan toolbar atau ketik langsung · Klik Preview untuk melihat hasil
        </p>
      </div>
    </div>
  );
}
