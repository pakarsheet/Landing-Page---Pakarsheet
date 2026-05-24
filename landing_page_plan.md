# Plan Landing Page Pakarsheet

Referensi utama: https://sellor-eco.webflow.io/
Sumber brand: `pakarsheet_brand_foundation.md`

## Arah Utama

Landing page Pakarsheet akan membawa rasa SaaS premium seperti Sellor: layout bersih, hero besar, visual dashboard, cards rapi, CTA kuat, animasi scroll halus.

Namun isi, warna, dan copy tetap milik Pakarsheet: Google Sheets naik level menjadi sistem kerja yang rapi, otomatis, dan mudah dipantau.

## V2 Visual Alignment Dengan Sellor

Update implementasi:

- Navbar dibuat floating, dark, rounded, dan absolute di atas hero seperti Sellor.
- Hero dibuat centered, bukan split layout.
- Hero memakai large rounded gradient panel `#ebf2f8 -> #fdf2ec`.
- Dashboard mockup dibuat besar, full-width, turun keluar hero area.
- Bottom fade ditambahkan di hero supaya dashboard terasa blend seperti referensi.
- Section utama memakai rounded pastel/dark panels dengan spacing besar.
- Product/template section memakai dark panel seperti SaaS showcase.
- Pricing section memakai pastel rounded panel.
- Width utama mengikuti rasa Sellor: max content sekitar `1068px`, outer panel sekitar `1380px`.

## Design System

- Background utama putih bersih.
- Section pendukung memakai pastel lembut.
- Warna utama: spreadsheet green.
- Warna aksen: coral/orange untuk CTA.
- Warna pendukung: soft blue dan neutral gray.
- Border tipis, shadow halus, radius kecil-menengah.
- Typography besar, tegas, tapi tetap friendly.
- Button mengikuti feel Sellor: solid CTA, secondary outline, hover motion.

## Struktur Halaman

1. Navbar
   - Logo Pakarsheet.
   - Menu: Fitur, Template, Cara Kerja, Harga, FAQ.
   - CTA: Lihat Template.

2. Hero
   - Headline: "Bikin Google Sheets kamu naik level."
   - Subcopy: Pakarsheet bantu spreadsheet bisnis jadi lebih rapi, otomatis, dan mudah dipantau.
   - CTA utama: Lihat Template.
   - CTA kedua: Konsultasi Kebutuhan.
   - Visual: mockup dashboard Google Sheets rasa mini software.

3. Stat Strip
   - Hemat waktu admin.
   - Laporan lebih cepat siap.
   - Template siap pakai.
   - Cocok untuk UMKM dan tim kecil.

4. Problem Section
   - Data tersebar di banyak file.
   - Input data berulang.
   - Laporan dihitung manual.
   - Owner susah pantau bisnis.

5. Feature Section
   - Struktur data rapi.
   - Dashboard siap pantau.
   - Laporan otomatis.
   - Format mudah dipakai tim.
   - Mini software tanpa bangun app dari nol.

6. Template/Product Section
   - Template finance.
   - Template sales.
   - Template operasional.
   - Template project/admin.
   - Bundle bisnis.

7. How It Works
   - Pilih template.
   - Isi data bisnis.
   - Pantau lewat dashboard.

8. Pricing Section
   - Basic Template.
   - Pro Template.
   - Bundle Pakarsheet.
   - Highlight paket paling populer.

9. Testimonial/Social Proof
   - Fokus pada owner/admin yang merasa kerja lebih rapi dan laporan lebih mudah.

10. FAQ
   - Apakah ini Google Sheets biasa?
   - Bisa dipakai tim?
   - Bisa custom?
   - Cocok untuk bisnis apa?
   - Butuh skill teknis?

11. Final CTA
   - Headline: "Spreadsheet kamu bisa lebih rapi mulai hari ini."
   - CTA: Lihat Template.
   - CTA kedua: Tanya Dulu.

## Animasi

- Scroll reveal per section.
- Card stagger animation.
- Hero dashboard floating subtle.
- Button hover slide text.
- FAQ accordion.
- Mobile nav slide/dropdown.

## Tech Stack

- Next.js
- React
- Tailwind CSS
- GSAP
- Lucide React
- next/font
- Vercel-ready deployment

Alasan stack:

- Next.js cocok untuk landing page SEO-ready dan mudah dikembangkan jadi katalog template, blog, atau checkout.
- React bikin section landing page modular dan mudah dirawat.
- Tailwind CSS mempercepat styling responsive dan menjaga design system konsisten.
- GSAP dipakai untuk animasi premium mirip Webflow: hero timeline, scroll reveal, stagger cards, dan motion dashboard.
- Lucide React dipakai untuk icon clean di fitur, CTA, FAQ, dan pricing.
- next/font menjaga performa font lebih baik.

## Struktur App

```txt
app/
  page.tsx
  layout.tsx
  globals.css
components/
  ui/
    Button.tsx
    SectionHeader.tsx
    FeatureCard.tsx
    PricingCard.tsx
    StatCard.tsx
  Navbar.tsx
  Hero.tsx
  Stats.tsx
  Problems.tsx
  Features.tsx
  Templates.tsx
  HowItWorks.tsx
  Pricing.tsx
  Testimonials.tsx
  FAQ.tsx
  CTA.tsx
  Footer.tsx
hooks/
  useGsapReveal.ts
  usePrefersReducedMotion.ts
lib/
  data.ts
  site.ts
```

## Arsitektur Reusable

Build harus modular, data-driven, dan mudah dikembangkan.

### UI Primitives

- `Button.tsx`
  - Variant: primary, secondary, ghost.
  - Size: sm, md, lg.
  - Support icon kiri/kanan.

- `SectionHeader.tsx`
  - Dipakai ulang untuk label kecil, heading, dan description.
  - Alignment: left atau center.

- `FeatureCard.tsx`
  - Dipakai di problem, feature, template, dan benefit section.
  - Props: icon, title, description, accent.

- `PricingCard.tsx`
  - Props: name, price, description, features, highlighted, cta.
  - Highlight card paling populer.

- `StatCard.tsx`
  - Props: value, label, description, icon.

### Data-Driven Content

Konten utama disimpan di `lib/data.ts`, bukan hardcode menyebar di semua komponen.

Yang masuk `lib/data.ts`:

- Navigation items.
- Stats.
- Problems.
- Features.
- Template categories.
- How it works steps.
- Pricing packages.
- Testimonials.
- FAQ items.

`lib/site.ts` dipakai untuk metadata:

- Brand name.
- Tagline.
- Description SEO.
- CTA text.
- Contact/WhatsApp link.
- Social links.

### Reusable Animation

- `useGsapReveal.ts`
  - Reusable scroll reveal untuk section dan cards.
  - Support stagger.
  - Support delay.
  - Support selector target.

- `usePrefersReducedMotion.ts`
  - Jika user reduce motion aktif, animasi dimatikan/diringankan.

Animasi GSAP tidak boleh hardcode penuh di setiap komponen. Komponen cukup kasih ref/class, hook yang handle reveal.

### Maintainability Rules

- Copy bisnis di `lib/data.ts`.
- Visual style global di `app/globals.css` dan Tailwind config.
- Komponen section fokus layout.
- Komponen `ui` fokus elemen kecil reusable.
- Hindari duplicate card markup.
- Setiap section mobile-first dan responsive.
- Semua CTA pakai data dari `lib/site.ts` supaya mudah diganti.

## File Yang Akan Dibuat

- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/*.tsx`
- `components/ui/*.tsx`
- `hooks/useGsapReveal.ts`
- `hooks/usePrefersReducedMotion.ts`
- `lib/data.ts`
- `lib/site.ts`

Karena targetnya landing page premium dengan animasi Webflow-like, pakai Next.js + React + Tailwind + GSAP.

## Quality Check

- Desktop dan mobile responsive.
- Text tidak overlap.
- CTA jelas.
- Mockup dashboard terlihat nyata, bukan dekorasi kosong.
- Style terasa seperti Sellor tapi tetap cocok untuk Pakarsheet.
