# Pakarsheet - Product Requirements Document (PRD) Modul Tools Kalkulator

**Status:** As-built PRD berdasarkan modul kalkulator saat ini  
**Tanggal:** 24 Mei 2026  
**Modul:** Halaman Index `/tools` & Modul Kalkulator Bisnis Gratis  
**Repository:** `/Volumes/JOY/CODING/LP`

Dokumen ini mendefinisikan persyaratan fungsional, spesifikasi kalkulasi, aturan bisnis, serta alur data dari modul **Tools Kalkulator Bisnis Gratis** pada platform Pakarsheet. Modul ini ditujukan sebagai kanal akuisisi organik (SEO) dan jembatan konversi bagi pengguna ke produk berbayar di halaman Shop.

---

## 1. Ringkasan Eksekutif & Tujuan Modul

Modul Tools menyediakan serangkaian kalkulator bisnis interaktif gratis yang dapat diakses langsung oleh pengguna tanpa perlu melakukan pendaftaran, masuk (login), atau instalasi aplikasi tambahan. Modul ini beroperasi secara penuh di sisi klien (client-side) untuk memberikan hasil instan.

### 1.1 Tujuan Bisnis
1. **Akuisisi Organik (SEO):** Menarik lalu lintas pencarian (search traffic) dari pemilik UMKM, pemasar, dan pelaku operasional yang mencari kata kunci terkait perhitungan HPP, harga jual marketplace, margin keuntungan, ROAS, diskon, dan profit bersih.
2. **Funnel Konversi:** Membangun kepercayaan (*trust*) pengguna melalui alat bantu gratis yang bermanfaat dan kemudian mengarahkan mereka ke template Google Sheets premium yang otomatis di halaman Shop.
3. **Validasi Kebutuhan:** Mengamati kalkulator mana yang paling sering digunakan untuk menjadi bahan masukan pembuatan template spreadsheet baru di masa depan.

### 1.2 Tujuan Pengguna
1. Mendapatkan jawaban numerik instan atas masalah keuangan atau pemasaran bisnis mereka tanpa keahlian matematika rumit.
2. Memahami arti angka hasil kalkulasi (seperti klasifikasi margin sehat/tidak sehat, interpretasi efisiensi iklan, atau rincian potongan biaya marketplace).
3. Mengevaluasi keputusan bisnis secara real-time berdasarkan simulasi angka masukan.

### 1.3 Pembatasan Modul (Non-Tujuan)
- Modul ini **tidak menyimpan** input data keuangan bisnis milik pengguna ke server atau database (demi menjaga privasi penuh).
- Modul ini **tidak memerlukan** otentikasi pengguna.
- Modul ini **tidak menyediakan** sinkronisasi data langsung dengan Google Sheets pengguna di halaman kalkulator (otomatisasi penuh hanya ditawarkan oleh produk berbayar).

---

## 2. Product Surface & Navigasi

Modul ini memiliki beberapa halaman aktif yang dapat diindeks oleh mesin pencari:

| Route | Fungsi Utama | Target Pengguna |
|---|---|---|
| `/tools` | Katalog/Index penjelajah seluruh kalkulator gratis dengan filter kategori. | Pengunjung baru yang ingin melihat daftar alat bantu yang tersedia. |
| `/tools/kalkulator-margin` | Menghitung margin profit per unit, total profit, markup, total modal, dan Break-Even Point (BEP) penjualan. | Owner UMKM, Freelancer, & Admin Finansial. |
| `/tools/kalkulator-hpp` | Menghitung Harga Pokok Produksi (HPP) berdasarkan bahan baku, tenaga kerja, overhead, dan menyarankan harga jual minimum. | Produsen barang, pemilik bisnis kuliner/F&B, & manufaktur kecil. |
| `/tools/kalkulator-harga-jual` | Menghitung harga jual minimum yang direkomendasikan di marketplace (Shopee, Tokopedia, TikTok Shop, Lazada) setelah menghitung fee admin dan komisi. | Merchant/Seller Marketplace di Indonesia. |
| `/tools/kalkulator-roas` | Menghitung Return on Ad Spend (ROAS), biaya per akuisisi (CPA), nilai rata-rata order (AOV), serta keuntungan kotor/bersih iklan. | Digital Marketer, Advertiser, & Pemilik Brand. |
| `/tools/kalkulator-diskon-bertingkat` | Menghitung harga akhir barang belanja setelah diskon bertingkat (misal: 20% + 10%), kupon belanja, ongkos kirim, dan biaya penanganan. | Pembelanja online & seller yang sedang merancang skema diskon. |
| `/tools/kalkulator-profit-marketplace` | Menghitung profit bersih menyeluruh setelah HPP, fee platform, voucher toko, subsidi ongkir, biaya packaging, dan biaya iklan. | Seller Marketplace tingkat lanjut (*advanced seller*). |

---

## 3. Persyaratan Fungsional Global

Modul kalkulator harus mematuhi aturan operasional berikut:

1. **Kalkulasi Real-Time:** Semua perhitungan matematika harus dieksekusi secara instan segera setelah pengguna mengubah nilai pada kolom input (menggunakan state reaktif di sisi klien). Tidak boleh ada tombol "Hitung" manual.
2. **Validasi Input:** 
   - Kolom input angka harus diatur menggunakan input numerik (`type="number"` dengan `inputMode="numeric"` atau `inputMode="decimal"`).
   - Mencegah input angka negatif untuk parameter biaya atau harga.
   - Melakukan pembatasan persentase (0% hingga 100% untuk diskon dan margin).
3. **Format Output Standar:**
   - Semua nilai nominal mata uang wajib diformat menggunakan standar Rupiah Indonesia (format: `Rp X.XXX.XXX` dengan pembulatan ke bilangan bulat terdekat).
   - Semua nilai rasio atau persentase diformat ke satu tempat desimal (format: `XX.X%`).
   - Rasio pengali (seperti ROAS) diformat dengan akhiran huruf "x" (format: `X.XXx`).
4. **Resiliensi Data Kosong:** Jika kolom input dikosongkan atau diisi karakter tidak valid, sistem harus memperlakukan nilai tersebut sebagai `0` (atau `1` jika digunakan sebagai pembagi, seperti kuantitas) agar aplikasi tidak mengalami eror pemecahan angka atau pembagian dengan nol (*division by zero*).
5. **CTA Konversi Dinamis:** Setiap halaman kalkulator harus menampilkan tautan rujukan yang relevan ke produk template berbayar di halaman `/shop` sebagai langkah pemecahan masalah jangka panjang bagi pengguna.

---

## 4. Spesifikasi Kalkulator & Rumus Perhitungan

### 4.1 Kalkulator Margin Keuntungan
Kalkulator ini membantu menganalisis kelayakan profit dari struktur harga jual dan struktur biaya per unit produk.

*   **Parameter Input:**
    1.  `Harga Beli / Modal per Unit` ($HargaBeli$) – Nominal Rupiah. Default: `50.000`.
    2.  `Harga Jual per Unit` ($HargaJual$) – Nominal Rupiah. Default: `80.000`.
    3.  `Biaya Operasional per Unit` ($BiayaOps$) – Nominal Rupiah (ongkir, kemasan, biaya admin). Default: `5.000`.
    4.  `Jumlah Unit` ($Qty$) – Kuantitas. Default: `100`.

*   **Logika Kalkulasi & Rumus:**
    1.  **Total Modal per Unit ($TotalModal$):**
        $$TotalModal = HargaBeli + BiayaOps$$
    2.  **Profit per Unit ($ProfitUnit$):**
        $$ProfitUnit = HargaJual - TotalModal$$
    3.  **Margin Keuntungan ($MarginPct$):**
        $$\text{Jika } HargaJual > 0: MarginPct = \left(\frac{ProfitUnit}{HargaJual}\right) \times 100$$
        $$\text{Jika } HargaJual \le 0: MarginPct = 0$$
    4.  **Persentase Markup ($MarkupPct$):**
        $$\text{Jika } TotalModal > 0: MarkupPct = \left(\frac{ProfitUnit}{TotalModal}\right) \times 100$$
        $$\text{Jika } TotalModal \le 0: MarkupPct = 0$$
    5.  **Total Profit ($TotalProfit$):**
        $$TotalProfit = ProfitUnit \times Qty$$
    6.  **Break-Even Point ($BEP$):**
        $$\text{Jika } ProfitUnit > 0: BEP = \lceil\frac{TotalModal}{ProfitUnit}\rceil$$
        $$\text{Jika } ProfitUnit \le 0: BEP = 0 \text{ (atau tidak terdefinisi)}$$

*   **Klasifikasi Kesehatan Margin Bisnis (Aturan Klasifikasi):**
    - $MarginPct \ge 30\%$: "Sangat sehat"
    - $30\% > MarginPct \ge 20\%$: "Sehat"
    - $20\% > MarginPct \ge 10\%$: "Cukup, bisa ditingkatkan"
    - $10\% > MarginPct > 0\%$: "Tipis, perlu evaluasi"
    - $MarginPct \le 0\%$: "Rugi"

---

### 4.2 Kalkulator HPP (Harga Pokok Produksi)
Kalkulator untuk menjabarkan komponen biaya manufaktur/produksi suatu barang dan menentukan harga jual minimum berdasarkan target keuntungan yang diinginkan.

*   **Parameter Input:**
    1.  `Biaya Bahan Baku per Unit` ($BahanBaku$) – Nominal Rupiah. Default: `30.000`.
    2.  `Biaya Tenaga Kerja per Unit` ($TenagaKerja$) – Nominal Rupiah. Default: `10.000`.
    3.  `Biaya Overhead per Unit` ($Overhead$) – Nominal Rupiah. Default: `5.000`.
    4.  `Target Margin (%)` ($TargetMargin$) – Persentase (0-99%). Default: `30`.
    5.  `Jumlah Unit Produksi` ($QtyProduksi$) – Kuantitas untuk total produksi. Default: `1`.

*   **Logika Kalkulasi & Rumus:**
    1.  **HPP per Unit ($HPP$):**
        $$HPP = BahanBaku + TenagaKerja + Overhead$$
    2.  **Harga Jual Minimum ($HargaJualMin$):**
        $$\text{Jika } TargetMargin < 100: HargaJualMin = \frac{HPP}{1 - \left(\frac{TargetMargin}{100}\right)}$$
        $$\text{Jika } TargetMargin \ge 100: HargaJualMin = 0$$
    3.  **Profit per Unit ($ProfitUnit$):**
        $$ProfitUnit = HargaJualMin - HPP$$
    4.  **Total HPP Produksi ($TotalHPP$):**
        $$TotalHPP = HPP \times QtyProduksi$$
    5.  **Komposisi Komponen HPP (Rasio Kontribusi):**
        - Kontribusi Bahan Baku: $BahanBakuPct = (\frac{BahanBaku}{HPP}) \times 100$
        - Kontribusi Tenaga Kerja: $TenagaKerjaPct = (\frac{TenagaKerja}{HPP}) \times 100$
        - Kontribusi Overhead: $OverheadPct = (\frac{Overhead}{HPP}) \times 100$

---

### 4.3 Kalkulator Harga Jual Marketplace
Alat simulasi untuk menentukan harga banderol produk di marketplace agar komisi dan biaya admin platform tidak menggerus target margin keuntungan bersih penjual.

*   **Daftar Biaya Default Platform (Preset Biaya):**
    Modul ini wajib memuat nilai default biaya admin yang umum di Indonesia, namun dapat disesuaikan secara manual oleh seller:
    - **Shopee:** Service Fee `3.0%`, Admin Fee `2.0%` (Total: `5.0%`)
    - **Tokopedia:** Service Fee `1.8%`, Admin Fee `1.0%` (Total: `2.8%`)
    - **TikTok Shop:** Service Fee `1.8%`, Admin Fee `3.0%` (Total: `4.8%`)
    - **Lazada:** Service Fee `2.0%`, Admin Fee `2.0%` (Total: `4.0%`)
    - **Custom:** Input manual service fee dan admin fee oleh pengguna.

*   **Parameter Input:**
    1.  `Modal / HPP per Unit` ($ModalHpp$) – Nominal Rupiah. Default: `50.000`.
    2.  `Target Margin (%)` ($TargetMargin$) – Persentase (0-90%). Default: `20`.
    3.  `Subsidi Ongkir per Unit` ($SubsidiOngkir$) – Nominal ditanggung seller jika ada promo gratis ongkir. Default: `0`.
    4.  `Biaya Packaging per Unit` ($BiayaPack$) – Kardus, bubble wrap, stiker. Default: `2.000`.
    5.  `Platform Pilihan` – Memilih salah satu preset di atas.

*   **Logika Kalkulasi & Rumus:**
    1.  **Total Biaya Tetap per Unit ($TotalModal$):**
        $$TotalModal = ModalHpp + SubsidiOngkir + BiayaPack$$
    2.  **Rasio Total Fee Platform ($FeeRate$):**
        $$FeeRate = \frac{ServiceFeePct + AdminFeePct}{100}$$
    3.  **Harga Jual Minimum yang Direkomendasikan ($HargaJual$):**
        $$Divisor = 1 - FeeRate - \left(\frac{TargetMargin}{100}\right)$$
        $$\text{Jika } Divisor > 0: HargaJual = \frac{TotalModal}{Divisor}$$
        $$\text{Jika } Divisor \le 0: HargaJual = 0 \text{ (atau tidak terdefinisi karena target margin + fee melebihi 100%)}$$
    4.  **Nominal Potongan Fee Marketplace ($FeePlatform$):**
        $$FeePlatform = HargaJual \times FeeRate$$
    5.  **Profit Bersih per Unit ($ProfitUnit$):**
        $$ProfitUnit = HargaJual - TotalModal - FeePlatform$$
    6.  **Margin Aktual ($ActualMargin$):**
        $$\text{Jika } HargaJual > 0: ActualMargin = \left(\frac{ProfitUnit}{HargaJual}\right) \times 100$$

---

### 4.4 Kalkulator ROAS Iklan
Kalkulator khusus pemasaran digital untuk menguji efisiensi biaya iklan (Meta Ads, Google Ads, TikTok Ads) terhadap volume penjualan dan laba bersih.

*   **Parameter Input:**
    1.  `Budget Iklan` ($AdSpend$) – Total modal pengeluaran iklan. Default: `500.000`.
    2.  `Revenue dari Iklan` ($Revenue$) – Total nilai omzet penjualan dari iklan. Default: `2.000.000`.
    3.  `HPP / Modal per Produk` ($HppProduk$) – Biaya pokok barang per unit. Default: `300.000`.
    4.  `Jumlah Order` ($QtyOrder$) – Total jumlah transaksi sukses dari iklan. Default: `10`.

*   **Logika Kalkulasi & Rumus:**
    1.  **ROAS (Return on Ad Spend):**
        $$\text{Jika } AdSpend > 0: ROAS = \frac{Revenue}{AdSpend}$$
        $$\text{Jika } AdSpend \le 0: ROAS = 0$$
    2.  **Cost per Acquisition / CPA ($CPA$):**
        $$\text{Jika } QtyOrder > 0: CPA = \frac{AdSpend}{QtyOrder}$$
        $$\text{Jika } QtyOrder \le 0: CPA = 0$$
    3.  **Average Order Value / AOV ($AOV$):**
        $$\text{Jika } QtyOrder > 0: AOV = \frac{Revenue}{QtyOrder}$$
        $$\text{Jika } QtyOrder \le 0: AOV = 0$$
    4.  **Laba Kotor ($GrossProfit$):**
        $$GrossProfit = Revenue - (HppProduk \times QtyOrder)$$
    5.  **Laba Bersih ($NetProfit$):**
        $$NetProfit = GrossProfit - AdSpend$$
    6.  **Indikator Profitable ($Profitable$):**
        $$Profitable = NetProfit > 0$$

*   **Skala & Klasifikasi ROAS:**
    - $ROAS \ge 4.0\text{x}$: "Sangat profitable"
    - $4.0\text{x} > ROAS \ge 3.0\text{x}$: "Profitable"
    - $3.0\text{x} > ROAS \ge 2.0\text{x}$: "Break-even, perlu optimasi"
    - $2.0\text{x} > ROAS \ge 1.0\text{x}$: "Rugi, segera evaluasi"
    - $ROAS < 1.0\text{x}$: "Rugi besar"

---

### 4.5 Kalkulator Diskon Bertingkat
Kalkulator belanja interaktif untuk mengetahui harga akhir setelah dipotong skema promo kumulatif berurutan, voucher belanja potongan langsung, ditambah ongkos kirim, biaya admin layanan, dan pengembalian dana (*cashback*).

*   **Parameter Input:**
    1.  `Harga Awal Barang` ($HargaAwal$) – Nominal Rupiah. Default: `250.000`.
    2.  `Diskon Pertama` ($D1$) – Persentase diskon pertama (0-100%). Default: `20`.
    3.  `Diskon Kedua` ($D2$) – Persentase diskon kedua (0-100%). Default: `10`.
    4.  `Diskon Ketiga` ($D3$) – Persentase diskon ketiga (0-100%). Default: `0`.
    5.  `Voucher Potongan` ($Voucher$) – Nominal Rupiah potongan tunai langsung. Default: `15.000`.
    6.  `Cashback` ($CashbackPct$) – Persentase pengembalian dana (0-100%). Default: `5`.
    7.  `Ongkir` ($Ongkir$) – Biaya pengiriman barang. Default: `12.000`.
    8.  `Biaya Layanan` ($BiayaLayanan$) – Biaya penanganan, asuransi, aplikasi. Default: `2.000`.

*   **Logika Kalkulasi & Rumus (Urutan Perhitungan yang Benar):**
    Aturan bisnis yang penting adalah **diskon persentase bertingkat dihitung secara berurutan (*compound*)**, bukan dijumlahkan secara langsung. Diskon 20% + 10% tidak sama dengan 30%.
    
    1.  **Tahap Diskon Persen 1:**
        $$NominalD1 = HargaAwal \times \left(\frac{D1}{100}\right)$$
        $$Sisa1 = HargaAwal - NominalD1$$
    2.  **Tahap Diskon Persen 2:**
        $$NominalD2 = Sisa1 \times \left(\frac{D2}{100}\right)$$
        $$Sisa2 = Sisa1 - NominalD2$$
    3.  **Tahap Diskon Persen 3:**
        $$NominalD3 = Sisa2 \times \left(\frac{D3}{100}\right)$$
        $$SubtotalDiskon = Sisa2 - NominalD3$$
    4.  **Penerapan Voucher Nominal:**
        $$VoucherTerpakai = \min(Voucher, SubtotalDiskon)$$
        $$SubtotalSetelahVoucher = SubtotalDiskon - VoucherTerpakai$$
    5.  **Perhitungan Total Pembayaran Checkout ($BayarCheckout$):**
        $$BayarCheckout = SubtotalSetelahVoucher + Ongkir + BiayaLayanan$$
    6.  **Perhitungan Cashback ($CashbackNominal$):**
        $$CashbackNominal = SubtotalSetelahVoucher \times \left(\frac{CashbackPct}{100}\right)$$
    7.  **Biaya Efektif Akhir ($BiayaEfektif$):**
        $$BiayaEfektif = \max(0, BayarCheckout - CashbackNominal)$$
    8.  **Total Kehematan Efektif ($HematEfektif$):**
        $$HematEfektif = (HargaAwal - SubtotalDiskon) + VoucherTerpakai + CashbackNominal$$
    9.  **Persentase Diskon Efektif Total ($DiskonEfektif$):**
        $$\text{Jika } HargaAwal > 0: DiskonEfektif = \left(\frac{HematEfektif}{HargaAwal}\right) \times 100$$
    10. **Persentase Diskon Bertingkat Efektif ($DiskonBertingkatEfektif$):**
        $$\text{Jika } HargaAwal > 0: DiskonBertingkatEfektif = \left(\frac{HargaAwal - SubtotalDiskon}{HargaAwal}\right) \times 100$$

---

### 4.6 Kalkulator Profit Marketplace
Perhitungan komprehensif bagi penjual online untuk menilai laba bersih aktual dari bisnis e-commerce setelah memperhitungkan seluruh variabel pengeluaran, subsidi promo, biaya promosi iklan per order, serta biaya overhead logistik.

*   **Parameter Input:**
    1.  `Harga Jual per Unit` ($HargaJual$) – Nominal Rupiah. Default: `120.000`.
    2.  `HPP / Modal per Unit` ($Hpp$) – Nominal Rupiah. Default: `65.000`.
    3.  `Jumlah Terjual` ($Qty$) – Kuantitas target penjualan. Default: `25`.
    4.  `Fee Marketplace (%)` ($FeePlatformPct$) – Persentase potongan komisi platform. Default: `5` (Shopee).
    5.  `Packaging per Unit` ($Pack$) – Biaya kemasan. Default: `2.500`.
    6.  `Subsidi Ongkir per Unit` ($OngkirSeller$) – Subsidi gratis ongkir ditanggung seller. Default: `5.000`.
    7.  `Voucher / Diskon Seller` ($VoucherSeller$) – Diskon produk ditanggung seller. Default: `10.000`.
    8.  `Biaya Iklan per Order` ($AdSpendPerOrder$) – Rata-rata biaya iklan untuk menghasilkan 1 transaksi (CPA). Default: `8.000`.
    9.  `Biaya Admin Tetap per Order` ($BiayaFixed$) – Biaya penanganan tetap/transaksi. Default: `1.000`.

*   **Logika Kalkulasi & Rumus:**
    1.  **Nominal Komisi Platform per Unit ($PlatformFeeUnit$):**
        $$PlatformFeeUnit = HargaJual \times \left(\frac{\min(100, FeePlatformPct)}{100}\right)$$
    2.  **Total Biaya Operasional per Unit ($OpsCostUnit$):**
        $$OpsCostUnit = Pack + OngkirSeller + VoucherSeller + AdSpendPerOrder + BiayaFixed$$
    3.  **Total Beban Modal per Unit ($TotalBebanPerUnit$):**
        $$TotalBebanPerUnit = Hpp + PlatformFeeUnit + OpsCostUnit$$
    4.  **Profit Bersih per Unit ($ProfitUnit$):**
        $$ProfitUnit = HargaJual - TotalBebanPerUnit$$
    5.  **Margin Bersih (%) ($MarginPct$):**
        $$\text{Jika } HargaJual > 0: MarginPct = \left(\frac{ProfitUnit}{HargaJual}\right) \times 100$$
    6.  **Markup Bersih (%) ($MarkupPct$):**
        $$\text{Jika } TotalBebanPerUnit > 0: MarkupPct = \left(\frac{ProfitUnit}{TotalBebanPerUnit}\right) \times 100$$
    7.  **Total Pendapatan Kotor / Omzet ($OmzetTotal$):**
        $$OmzetTotal = HargaJual \times Qty$$
    8.  **Total Profit Bersih ($TotalProfit$):**
        $$TotalProfit = ProfitUnit \times Qty$$
    9.  **Total Potongan Komisi Platform ($TotalPlatformFee$):**
        $$TotalPlatformFee = PlatformFeeUnit \times Qty$$
    10. **Total Beban Pengeluaran ($TotalBeban$):**
        $$TotalBeban = TotalBebanPerUnit \times Qty$$
    11. **Harga Break-Even Minimum ($HargaBEP$):**
        $$RatePlatform = \frac{FeePlatformPct}{100}$$
        $$\text{Jika } RatePlatform < 1: HargaBEP = \frac{Hpp + OpsCostUnit}{1 - RatePlatform}$$
        $$\text{Jika } RatePlatform \ge 1: HargaBEP = 0$$
    12. **Batas Maksimal Biaya Iklan per Order ($MaxAdSpend$):**
        $$MaxAdSpend = \max(0, HargaJual - Hpp - PlatformFeeUnit - Pack - OngkirSeller - VoucherSeller - BiayaFixed)$$
        *(Ini adalah titik batas CPA iklan agar profit bersih unit tidak berubah menjadi minus/rugi)*

*   **Aturan Klasifikasi Kesehatan Finansial Laba Bersih:**
    - $ProfitUnit \le 0$: "Rugi, cek harga atau biaya" (Status: Bahaya/Merah)
    - $MarginPct \ge 20\%$: "Sehat" (Status: Aman/Hijau)
    - $20\% > MarginPct \ge 10\%$: "Tipis tapi masih jalan" (Status: Waspada/Kuning)
    - $10\% > MarginPct > 0\%$: "Terlalu tipis" (Status: Bahaya/Merah)

---

## 5. Persyaratan Non-Fungsional

### 5.1 Performa & Kecepatan Akses
- **Zero Server Overhead:** Seluruh komputasi dikerjakan langsung di memori peramban pengguna (*client-side execution*). Tidak diperkenankan melakukan panggilan API/jaringan eksternal untuk melakukan operasi matematika sederhana.
- **Instan Render:** Pengguna tidak boleh melihat adanya *delay* visual atau *lagging* komputasi ketika menggeser slider atau mengetik angka pada kolom input.

### 5.2 SEO (Search Engine Optimization)
Kalkulator adalah halaman penarik lalu lintas organik primer. Setiap halaman detail kalkulator harus memuat:
- **Canonical URL:** Mencegah terjadinya duplikasi konten pada parameter query pencarian (misal: `/tools/kalkulator-roas` harus mereferensikan dirinya sendiri sebagai canonical link).
- **Metadata Dinamis:** Judul halaman (`<title>`) dan deskripsi meta (`<meta name="description">`) yang unik, memuat kata kunci berdaya saing tinggi (seperti "Kalkulator HPP gratis online", "Hitung margin keuntungan retail", dsb).
- **Struktur H1-H3 Semantis:** Setiap halaman kalkulator harus memiliki satu elemen `<h1>` yang berisi nama kalkulator secara eksplisit untuk keperluan pembacaan robot pencari.

### 5.3 Keandalan & Penanganan Error
- **Pencegahan Pembagian Nol (NaN/Infinity):** Apabila pembagi bernilai `0` (seperti membagi omzet dengan pengeluaran iklan nol), sistem harus mengalihkan hasil perhitungan menjadi `0` secara otomatis, bukan menampilkan teks `NaN`, `Infinity`, atau merusak tampilan visual.
- **Koreksi Karakter:** Mengabaikan karakter non-numerik yang dimasukkan secara paksa di perangkat seluler melalui fungsi penanganan error input (`parseFloat` fallback ke `0` atau `1`).

---

## 6. Persyaratan Data & Analitik Event

Untuk mengukur efektivitas konversi modul kalkulator terhadap penjualan template premium, tim analis wajib memantau metrik perilaku pengguna melalui instrumentasi event pelacakan berikut:

1.  **`tool_visited`:** Merekam kunjungan pengguna ke halaman kalkulator spesifik.
    - *Atribut:* `tool_slug` (contoh: `kalkulator-roas`), `referrer`
2.  **`tool_calculated`:** Dipicu ketika pengguna melakukan perhitungan (misal setelah mengubah input minimal 3 kali atau bertahan selama 15 detik di halaman interaktif).
    - *Atribut:* `tool_slug`
3.  **`tool_conversion_clicked`:** Pengguna menekan tombol CTA rujukan ke produk template berbayar di bagian bawah kalkulator.
    - *Atribut:* `tool_slug`, `target_destination` (contoh: `/shop`, `/shop/finance-tracker`)

### Target Metrik Sukses Modul Tools (KPIs)
- **Rasio Konversi Halaman (CTR dari Kalkulator ke Shop):** $\ge 4.0\%$ dari seluruh sesi aktif di halaman kalkulator.
- **Rata-rata Waktu Kunjungan Halaman (*Average Engagement Time*):** $\ge 45$ detik per sesi kalkulator untuk membuktikan pengguna benar-benar berinteraksi dengan simulasi angka.
- **Tingkat Bounce Rate Organik:** $< 65\%$ dengan menyediakan artikel rujukan silang (*cross-link*) atau modul kalkulator pelengkap lainnya.
