/**
 * Server-side HTML sanitizer for blog content.
 *
 * Strips all tags and attributes not in the allowlist.
 * This is intentionally conservative — only the tags produced by
 * RichTextEditor are allowed.
 *
 * No external dependencies required.
 */

const ALLOWED_TAGS = new Set([
  "h2", "h3", "p", "ul", "ol", "li",
  "strong", "em", "a", "blockquote",
  "code", "pre", "hr", "br",
]);

const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ["href", "target", "rel"],
};

/**
 * Sanitize an HTML string, keeping only allowed tags and attributes.
 * Runs server-side only (uses regex — safe because we're stripping, not parsing).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // 1. Strip all script/style/iframe/object/embed/form tags and their content
  let clean = html.replace(
    /<(script|style|iframe|object|embed|form|input|button|select|textarea|link|meta|base)[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );
  // Also strip self-closing dangerous tags
  clean = clean.replace(
    /<(script|style|iframe|object|embed|form|input|button|select|textarea|link|meta|base)[^>]*\/?>/gi,
    ""
  );

  // 2. Strip event handler attributes (on*)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");

  // 3. Strip javascript: and data: URIs in href/src
  clean = clean.replace(
    /\s+(href|src|action)\s*=\s*(?:"(javascript:|data:)[^"]*"|'(javascript:|data:)[^']*')/gi,
    ""
  );

  // 4. Strip any remaining tags not in the allowlist
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tag: string) => {
    const lower = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(lower)) return "";

    // For closing tags, just return the clean closing tag
    if (match.startsWith("</")) return `</${lower}>`;

    // For self-closing tags like <hr />
    if (match.endsWith("/>") || lower === "hr" || lower === "br") {
      return `<${lower} />`;
    }

    // For opening tags, only keep allowed attributes
    const allowed = ALLOWED_ATTRS[lower] ?? [];
    if (allowed.length === 0) return `<${lower}>`;

    // Extract allowed attributes
    const attrParts: string[] = [];
    for (const attr of allowed) {
      const attrMatch = match.match(
        new RegExp(`\\s+${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]*))`, "i")
      );
      if (attrMatch) {
        const val = attrMatch[1] ?? attrMatch[2] ?? attrMatch[3] ?? "";
        // Extra safety: strip javascript: from href
        if (attr === "href" && /^javascript:/i.test(val.trim())) continue;
        // Force target="_blank" links to also have rel="noopener noreferrer"
        if (attr === "target" && val === "_blank") {
          attrParts.push(`target="_blank"`);
          attrParts.push(`rel="noopener noreferrer"`);
          continue;
        }
        if (attr === "rel") continue; // handled above
        attrParts.push(`${attr}="${val}"`);
      }
    }

    return `<${lower}${attrParts.length ? " " + attrParts.join(" ") : ""}>`;
  });

  return clean;
}
