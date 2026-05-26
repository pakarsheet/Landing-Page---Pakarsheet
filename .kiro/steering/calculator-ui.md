---
inclusion: fileMatch
fileMatchPattern: "components/calculators/**,components/ui/ResultCard.tsx,components/ui/CalcDisclaimer.tsx,app/tools/**"
---

# Calculator UI — Design Decisions

Dokumen ini mencatat keputusan visual yang disengaja untuk semua komponen kalkulator.
Jangan ubah nilai-nilai ini tanpa pertimbangan matang — perubahan di sini berdampak ke semua 8 kalkulator sekaligus.

## CalcInputPanel (`components/calculators/CalcInputPanel.tsx`)

### Ukuran & Spacing yang Sudah Dikalibrasi

| Elemen | Nilai | Alasan |
|---|---|---|
| Input padding | `py-4` | Cukup besar untuk nyaman diketik, terutama di mobile |
| Field label | `text-[15px]` | Lebih besar dari `text-sm` (14px) — kalkulator adalah tool kerja aktif, label harus mudah dibaca tanpa squint |
| Hint text | `text-sm text-muted/60` | Hint menjelaskan apa yang harus diisi — kalau terlalu kecil (`text-xs`) user salah input |
| Field gap | `gap-6` | Breathing room antar field, tidak terasa cramped |
| Summary strip label | `text-xs` | Cukup untuk label pendek di strip bawah |
| Summary strip value | `text-lg font-semibold` | Angka ringkasan harus terbaca sekilas |
| Summary strip padding | `py-5` | Konsisten dengan input height |

### Jangan Ubah Ini Saat Redesign Page

- `inputWrap`, `inputBase`, `prefixCls` — konstanta CSS yang di-export dan dipakai oleh kalkulator yang punya custom section (KalkulatorLabaRugi, KalkulatorEfektivitasIklan). Kalau diubah, semua custom section ikut berubah.
- `CalcFieldDef` type — interface field definition. Kalau diubah, semua 8 kalkulator perlu diupdate.

---

## ResultCard (`components/ui/ResultCard.tsx`)

### Ukuran yang Sudah Dikalibrasi

| Elemen | Nilai | Alasan |
|---|---|---|
| Hero value | `text-[36px]` mobile, `sm:text-[52px]` desktop | Angka jawaban utama harus dominan — ini yang user cari |
| Progress bar height | `h-2` | `h-1.5` terlalu tipis, tidak terlihat sebagai elemen UI yang meaningful |
| Status badge | `text-[11px]` | Kecil tapi cukup — badge hanya konteks, bukan konten utama |

### Status Helpers

`marginStatus`, `roasStatus`, `savingsStatus`, `profitStatus`, `adEfficiencyStatus` — semua return `ResultStatus` type. Threshold angka di setiap helper sudah disesuaikan dengan konteks bisnis Indonesia (UMKM, marketplace). Jangan ubah threshold tanpa riset.

---

## Page `tools/[slug]` (`app/tools/[slug]/page.tsx`)

### Layout yang Sudah Dikalibrasi

| Elemen | Nilai | Alasan |
|---|---|---|
| Tool icon di hero | `h-16 w-16` container, `h-8 w-8` icon | Cukup dominan untuk halaman dedicated satu tool |
| Calculator section padding | `py-14 sm:py-20` | Breathing room antara hero dan form — transisi tidak abrupt |

### Yang Boleh Diubah Saat Redesign

- Layout hero (gradient, SheetGrid, posisi elemen)
- Related tools section (card style, jumlah item)
- CTA section (warna, copy, layout)
- Struktur `CalculatorForSlug` switch — boleh diganti dynamic import pattern lain

### Yang Tidak Boleh Diubah Tanpa Update Semua Kalkulator

- `max-w-[1280px]` pada calculator section — semua kalkulator didesain untuk lebar ini
- Dynamic import pattern per slug — setiap kalkulator hanya di-bundle saat page-nya dikunjungi

---

## KalkulatorLabaRugi — Custom Panel

Kalkulator ini **tidak menggunakan `CalcInputPanel`** karena punya layout dua-section (Pemasukan / Pengeluaran) yang tidak cocok dengan flat field grid. Tapi tetap menggunakan:
- `inputWrap`, `inputBase`, `prefixCls` dari `CalcInputPanel`
- `useCalcTracking` hook
- Ukuran yang sama: label `text-[15px]`, hint `text-sm text-muted/60`, summary `text-lg`

Kalau `CalcInputPanel` diupdate, **KalkulatorLabaRugi harus diupdate manual juga**.

---

## KalkulatorEfektivitasIklan — Custom Sections

Kalkulator ini punya dua section tambahan di dalam `CalcInputPanel` via `children` slot:
1. Channel selector (Shopee Ads, Meta Ads, dll)
2. "Biaya Tersembunyi" section dengan 3-column grid

Kedua section ini render field manual menggunakan `inputWrap`/`inputBase`/`prefixCls` yang di-export dari `CalcInputPanel`. Kalau konstanta tersebut diubah, section ini otomatis ikut.
