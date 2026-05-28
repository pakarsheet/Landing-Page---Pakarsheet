# UI Design Rules — Pakarsheet

Aturan desain ini wajib diikuti setiap kali build atau rebuild komponen UI, section, atau halaman.

---

## ❌ Dilarang: Colored top border di dalam card/kolom

Jangan pernah menambahkan colored bar/stripe di bagian atas sebuah card, kolom, atau container — terutama jika elemen tersebut sudah punya border atau background sendiri.

**Contoh yang DILARANG:**
```tsx
{/* JANGAN — colored bar di atas kolom angka */}
<div className="flex flex-col items-center border-r border-line">
  <div className="h-1.5 w-full bg-ink" />   {/* ← ini yang dilarang */}
  <span>01</span>
</div>

{/* JANGAN — top accent bar di dalam card */}
<div className="rounded-3xl border border-line bg-white">
  <div className="h-1.5 w-full bg-cobalt rounded-t-3xl" />  {/* ← ini yang dilarang */}
  <div className="p-6">...</div>
</div>
```

**Kenapa dilarang:**
- Terlihat noisy dan tidak konsisten dengan design system Pakarsheet
- Menambah visual noise tanpa nilai informasi
- Bertabrakan dengan border card yang sudah ada

**Alternatif yang boleh dipakai untuk memberi aksen warna:**
- Warna pada elemen angka/icon itu sendiri (`bg-ink`, `bg-cobalt`, `bg-sheet`)
- Badge/pill berwarna di dalam konten
- Background card yang berbeda (`bg-sky/30`, `bg-leaf`, dll)
- Left border accent: `border-l-4 border-l-ink` (hanya jika konteksnya tepat)

---

## Prinsip Umum UI

- **Breathing room** — padding minimal `p-5` untuk card kecil, `p-6` atau `p-7` untuk card normal
- **Teks tidak boleh kecil** — body text minimal `text-sm` (14px), deskripsi utama `text-base` (16px)
- **5 item dalam satu baris** — hindari layout horizontal untuk 5+ item karena terlalu sempit. Gunakan grid 2 kolom atau full-width rows
- **Konsistensi shadow** — gunakan `shadow-card` untuk card biasa, `shadow-soft` untuk card yang lebih prominent
