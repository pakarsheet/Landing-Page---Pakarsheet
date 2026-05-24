# Pakarsheet — Design System

Dokumentasi token, komponen, dan pola yang dipakai di landing page Pakarsheet. Dibuat dari source code aktual (`tailwind.config.ts`, `globals.css`, dan semua komponen).

---

## 1. Warna

Semua warna didefinisikan di `tailwind.config.ts` dan bisa dipakai langsung sebagai Tailwind class.

| Token       | Hex       | Tailwind class          | Kegunaan                                      |
|-------------|-----------|-------------------------|-----------------------------------------------|
| `ink`       | `#01112b` | `bg-ink` / `text-ink`   | Warna teks utama, background dark, logo       |
| `muted`     | `#4c5a73` | `text-muted`            | Teks sekunder, caption, label                 |
| `line`      | `#d9e2f4` | `border-line`           | Border card, divider, garis halus             |
| `sheet`     | `#8bed02` | `bg-sheet` / `text-sheet` | Aksen brand utama (hijau neon), CTA highlight |
| `cobalt`    | `#023ffc` | `text-cobalt`           | Link hover, icon aksen biru                   |
| `leaf`      | `#efffda` | `bg-leaf`               | Background icon aksen hijau muda              |
| `blush`/`sky` | `#eaf0ff` | `bg-sky` / `bg-blush`  | Background section terang, dropdown, tag      |
| `lilac`     | `#f2ffe0` | `bg-lilac`              | Background section hijau muda                 |

### Gradient

```
Hero panel & Pricing panel:
linear-gradient(180deg, #eaf0ff 0%, #f2ffe0 100%)
→ Tailwind: bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)]

Navbar CTA & Button dark:
linear-gradient(180deg, #0c061b, #210d53)
→ Tailwind: bg-[linear-gradient(180deg,#0c061b,#210d53)]
```

### Selection color

```css
::selection {
  background: #8bed02; /* sheet */
  color: #01112b;      /* ink */
}
```

---

## 2. Tipografi

### Font families

| Role        | Font stack                                    | CSS var            | Tailwind class      |
|-------------|-----------------------------------------------|--------------------|---------------------|
| `primary`   | Geist Sans → InterDisplay → sans-serif        | `--font-geist-sans` | `font-primary`     |
| `secondary` | InterDisplay → Verdana → sans-serif           | `--font-inter`      | `font-secondary`   |

`font-primary` dipakai untuk heading, logo, dan angka besar.  
`font-secondary` dipakai untuk body text, deskripsi, dan label.

### Skala heading

| Element | Mobile          | Tablet (sm)     | Desktop (lg)    | Tracking          |
|---------|-----------------|-----------------|-----------------|-------------------|
| `h1`    | `36px` / lh 1.1 | `48px`          | `62px`          | `-0.5px` → `-3.5px` |
| `h2`    | `30px` / lh 1.2 | `40px`          | `48px`          | `-0.2px` → `-1.8px` |
| `h3`    | `24px` / lh 1.25 | —              | —               | `-0.6px`          |

### Body text

| Ukuran  | Line height | Kegunaan                        |
|---------|-------------|---------------------------------|
| `18px`  | `1.56`      | Body utama, deskripsi section   |
| `15px`  | —           | Nav link                        |
| `14px`  | —           | Button, badge, label kecil      |
| `13px`  | —           | Caption, tag kecil              |
| `12px`  | —           | Eyebrow uppercase               |

---

## 3. Spacing & Layout

### Max-width containers

| Token              | Nilai      | Kegunaan                              |
|--------------------|------------|---------------------------------------|
| `max-w-[1380px]`   | 1380px     | Hero panel, Pricing panel (full bleed)|
| `max-w-[1068px]`   | 1068px     | Konten section standar                |
| `max-w-[890px]`    | 890px      | Hero copy (teks + CTA)                |
| `max-w-[1120px]`   | 1120px     | Dashboard mockup                      |

### Section padding

```
Horizontal: px-5 (mobile) → lg:px-10 (desktop)
Vertical:   py-20 (standar) → lg:py-24 (panel besar)
```

### Border radius

| Token    | Nilai    | Tailwind class | Kegunaan                        |
|----------|----------|----------------|---------------------------------|
| `2xl`    | `1rem`   | `rounded-2xl`  | Card kecil, dropdown item       |
| `3xl`    | `1.35rem`| `rounded-3xl`  | Card utama (FeatureCard, PricingCard, StatCard) |
| `[32px]` | `32px`   | `rounded-[32px]` | Panel besar (Hero, Pricing)   |
| `[2rem]` | `32px`   | `rounded-[2rem]` | Dashboard mockup shell        |
| `full`   | `9999px` | `rounded-full` | Badge, tag, button, pill        |

---

## 4. Shadow

| Token       | Value                                    | Tailwind class  | Kegunaan              |
|-------------|------------------------------------------|-----------------|-----------------------|
| `card`      | `0 12px 34px rgba(1,17,43,0.07)`         | `shadow-card`   | Card default          |
| `soft`      | `0 18px 55px rgba(1,17,43,0.1)`          | `shadow-soft`   | Card hover state      |
| Navbar      | `0 16px 48px rgba(1,17,43,0.12)`         | inline          | Navbar, dropdown      |
| Dashboard   | `0 34px 100px rgba(1,17,43,0.2)`         | inline          | Dashboard mockup      |

---

## 5. Komponen UI

### `Button`

```tsx
<Button href="..." variant="primary" size="lg">
  Label
</Button>
```

**Props:**

| Prop      | Type                              | Default     |
|-----------|-----------------------------------|-------------|
| `href`    | `string`                          | required    |
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` |
| `size`    | `"sm" \| "md" \| "lg"`            | `"md"`      |
| `icon`    | `LucideIcon`                      | `ArrowRight`|

**Variants:**

| Variant     | Style                                                    |
|-------------|----------------------------------------------------------|
| `primary`   | `bg-ink text-white`, hover: `bg-cobalt`, lift `-0.5`    |
| `secondary` | `border-line bg-white text-ink`, hover: `border-ink`    |
| `ghost`     | `text-ink`, hover: `text-cobalt`                        |

**Sizes:**

| Size | Height | Padding | Font  |
|------|--------|---------|-------|
| `sm` | `h-10` | `px-4`  | `text-sm` |
| `md` | `h-12` | `px-5`  | `text-sm` |
| `lg` | `h-14` | `px-6`  | `text-base` |

Semua button pakai `rounded-full` dan efek teks slide-up on hover.

---

### `SectionHeader`

```tsx
<SectionHeader
  eyebrow="Label section"
  icon={SomeIcon}
  title="Judul section yang panjang."
  description="Deskripsi pendukung."
  align="left"   // "left" | "center"
  theme="light"  // "light" | "dark"
/>
```

**Props:**

| Prop          | Type                    | Default      |
|---------------|-------------------------|--------------|
| `eyebrow`     | `string`                | required     |
| `title`       | `string`                | required     |
| `description` | `string`                | required     |
| `align`       | `"left" \| "center"`   | `"left"`     |
| `theme`       | `"light" \| "dark"`    | `"light"`    |
| `icon`        | `LucideIcon`            | `Sparkles`   |

Eyebrow pill: `border border-line bg-white text-cobalt` (light) atau `bg-white text-ink` (dark).

---

### `FeatureCard`

```tsx
<FeatureCard
  icon={SomeIcon}
  title="Judul fitur"
  description="Deskripsi singkat."
  accent="bg-sheet text-ink"
/>
```

**Props:**

| Prop          | Type          | Keterangan                              |
|---------------|---------------|-----------------------------------------|
| `icon`        | `LucideIcon`  | Icon di dalam accent box                |
| `title`       | `string`      | `font-primary`, `text-2xl`, `font-semibold` |
| `description` | `string`      | `font-secondary`, `text-base`, `text-muted` |
| `accent`      | `string`      | Tailwind class untuk warna icon box     |

**Accent combinations yang dipakai:**

| Accent class            | Konteks         |
|-------------------------|-----------------|
| `bg-sheet text-ink`     | Hijau brand     |
| `bg-sky text-cobalt`    | Biru muda       |
| `bg-lilac text-ink`     | Hijau muda      |
| `bg-leaf text-cobalt`   | Hijau pastel    |

Hover: lift `-translate-y-1`, `shadow-soft`, glow `bg-sheet/35` di pojok kanan atas.

---

### `PricingCard`

```tsx
<PricingCard
  name="Pro Template"
  price="Rp299rb"
  description="..."
  features={["...", "..."]}
  cta="Pilih Pro"
  highlighted={true}
/>
```

**Props:**

| Prop          | Type       | Default   |
|---------------|------------|-----------|
| `name`        | `string`   | required  |
| `price`       | `string`   | required  |
| `description` | `string`   | required  |
| `features`    | `string[]` | required  |
| `cta`         | `string`   | required  |
| `highlighted` | `boolean`  | `false`   |

`highlighted=true`: `bg-ink text-white`, badge "Paling populer" (`bg-sheet`), check icon `bg-white text-ink`.  
`highlighted=false`: `bg-white text-ink`, check icon `bg-leaf text-cobalt`.

---

### `StatCard`

```tsx
<StatCard
  value="40%"
  label="lebih hemat waktu admin"
  description="Deskripsi pendukung."
  icon={SomeIcon}
/>
```

Icon box: `bg-leaf text-cobalt`, `rounded-2xl`, `h-11 w-11`.  
Value: `font-primary text-3xl font-semibold tracking-[-1px] text-ink`.

---

## 6. Animasi

### GSAP — Hero entrance

Urutan timeline saat halaman load:

| Target           | Animasi                                    | Durasi  |
|------------------|--------------------------------------------|---------|
| `.hero-panel`    | fade + `y: 18` + `scale: 0.985`            | 0.7s    |
| `.hero-reveal`   | fade + `y: 24`, stagger `0.08s`            | 0.72s   |
| `.hero-word`     | fade + `yPercent: 88` + `rotateX: -18`     | 0.7s, stagger `0.035s` |
| `.dashboard-shell` | fade + `y: 72` + `scale: 0.96` + `rotateX: 8` | 0.95s |

Ease default: `power3.out`.

### GSAP — Dashboard float

```js
gsap.to(".dashboard-float", { y: -12, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" })
```

### GSAP — Dashboard parallax scroll

```js
gsap.to(".dashboard-image", {
  y: -28, scale: 1.035,
  scrollTrigger: { trigger: ".dashboard-shell", start: "top bottom", end: "bottom top", scrub: 0.8 }
})
```

### GSAP — Section reveal (`useGsapReveal`)

Semua section selain Hero pakai hook `useGsapReveal`. Target class: `.reveal-item`.  
Animasi: fade + `y: 32`, stagger `0.07s`, trigger saat elemen masuk viewport.

### CSS — Sheet Grid (Hero background)

| Class              | Animasi                                      | Durasi |
|--------------------|----------------------------------------------|--------|
| `.sheet-cell`      | `opacity: 0 → 1 → 0` (pulse), stagger per sel | 3.6s infinite |
| `.sheet-row-sweep` | `top: -15% → 105%` (sweep vertikal)          | 7s infinite   |

Grid lines: `repeating-linear-gradient` 9 kolom × 7 baris, warna `rgba(99,120,200,0.13)`.  
Highlight cells: `rgba(139,237,2,0.18)`.  
Row sweep: `rgba(139,237,2,0.12)`.

Semua animasi dimatikan otomatis via `@media (prefers-reduced-motion: reduce)`.

---

## 7. Pola Layout Section

Semua section mengikuti pola yang konsisten:

```tsx
<section id="..." ref={ref} className="bg-white px-5 py-20 lg:px-10">
  <div className="mx-auto max-w-[1068px]">
    <SectionHeader ... />
    {/* konten */}
  </div>
</section>
```

Section dengan panel gradient (Hero, Pricing):

```tsx
<div className="mx-auto max-w-[1380px] rounded-[32px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
```

---

## 8. Navbar

- Posisi: `absolute top-0`, `z-50`, full width
- Container: `max-w-[1068px]`, `rounded-[18px]`, `border border-white/80`, `bg-white`, `shadow-[0_16px_48px_rgba(1,17,43,0.12)]`
- Logo: kotak `h-9 w-9 rounded-[10px] bg-ink` + teks `font-primary font-semibold text-ink`
- Nav link: `text-[15px] font-medium text-ink`, hover: `text-cobalt`
- Dropdown "Produk": hover-triggered, `w-[560px]`, grid 2 kolom, item hover: `bg-sky text-cobalt`
- CTA desktop: `h-9 rounded-[10px] bg-[linear-gradient(180deg,#0c061b,#210d53)] text-white`
- Mobile toggle: `h-10 w-10 rounded-[12px] bg-ink text-white`
- Mobile menu: slide-down dengan `max-h` transition, `rounded-[18px]`

---

## 9. Footer

- Border top: `border-t border-line`
- Layout: `flex-col` (mobile) → `flex-row items-center justify-between` (md+)
- Logo icon: `h-10 w-10 rounded-2xl bg-sheet text-white` (berbeda dari Navbar yang pakai `bg-ink`)
- Nav links: `text-sm font-bold text-muted`, hover: `text-ink`

---

## 10. Aksesibilitas

- Semua animasi GSAP dan CSS diperiksa via `usePrefersReducedMotion()` — jika aktif, animasi dilewati
- `@media (prefers-reduced-motion: reduce)` mematikan semua CSS animation dan transition
- Elemen dekoratif (grid, overlay) pakai `aria-hidden="true"` dan `pointer-events-none`
- Mobile nav pakai `aria-expanded` dan `aria-controls`
- Gambar dashboard punya `alt` text deskriptif
- `::selection` menggunakan kontras yang cukup (`#8bed02` on `#01112b`)
