-- ============================================================
-- Blog Posts Table
-- Run this in Supabase SQL Editor
-- ============================================================

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text not null,
  content       text not null,          -- HTML content (rich text)
  cover_image   text,                   -- URL to cover image
  category      text not null default 'Tips Bisnis',
  tags          text[] not null default '{}',
  author_name   text not null default 'Tim Pakarsheet',
  author_avatar text,
  status        text not null default 'draft' check (status in ('published', 'draft')),
  featured      boolean not null default false,
  read_time     int not null default 5,  -- estimated read time in minutes
  related_tool_slug  text,              -- optional: link to a /tools/[slug]
  related_shop_slug  text,              -- optional: link to a /shop/[slug]
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
  before update on public.posts
  for each row execute procedure public.handle_updated_at();

-- Index for public queries
create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);

create index if not exists posts_category_idx
  on public.posts (category);

create index if not exists posts_slug_idx
  on public.posts (slug);

-- RLS: public can read published posts, admin bypasses via service_role
alter table public.posts enable row level security;

create policy "Public can read published posts"
  on public.posts for select
  using (status = 'published');

-- ============================================================
-- Sample seed data (5 articles to start)
-- ============================================================

insert into public.posts (
  slug, title, excerpt, content, category, tags,
  author_name, status, featured, read_time,
  related_tool_slug, related_shop_slug, published_at
) values

(
  'cara-hitung-hpp-produk-makanan',
  'Cara Hitung HPP Produk Makanan dari Nol (+ Kalkulator Gratis)',
  'HPP yang salah hitung = bisnis kuliner yang pelan-pelan rugi tanpa sadar. Panduan lengkap cara hitung Harga Pokok Produksi untuk bisnis makanan, lengkap dengan contoh nyata.',
  '<h2>Apa itu HPP dan Kenapa Penting?</h2>
<p>HPP (Harga Pokok Produksi) adalah total biaya yang kamu keluarkan untuk memproduksi satu unit produk. Untuk bisnis kuliner, ini mencakup bahan baku, tenaga kerja, dan biaya overhead seperti gas, listrik, dan kemasan.</p>
<p>Banyak pemilik bisnis makanan yang menetapkan harga jual berdasarkan feeling atau ikut-ikutan kompetitor — tanpa tahu apakah harga itu sebenarnya menguntungkan atau tidak. Akibatnya, bisnis bisa jalan bertahun-tahun tapi tidak pernah benar-benar profit.</p>

<h2>Komponen HPP Produk Makanan</h2>
<p>HPP terdiri dari tiga komponen utama:</p>
<h3>1. Biaya Bahan Baku Langsung</h3>
<p>Semua bahan yang langsung masuk ke produk. Untuk nasi goreng misalnya: nasi, telur, bumbu, minyak, kecap. Hitung per porsi dengan cara membagi total pembelian bahan dengan jumlah porsi yang bisa dibuat.</p>
<h3>2. Biaya Tenaga Kerja Langsung</h3>
<p>Upah karyawan yang langsung terlibat dalam produksi. Jika kamu memasak sendiri, hitung nilai waktu kamu per jam dikalikan waktu yang dibutuhkan per porsi.</p>
<h3>3. Biaya Overhead Pabrik</h3>
<p>Biaya tidak langsung: gas, listrik, sewa dapur, kemasan, peralatan. Bagi total overhead bulanan dengan total unit produksi per bulan untuk mendapat overhead per unit.</p>

<h2>Rumus HPP</h2>
<p><strong>HPP per unit = Bahan Baku + Tenaga Kerja + Overhead</strong></p>
<p>Setelah tahu HPP, kamu bisa menentukan harga jual minimum dengan menambahkan target margin keuntungan:</p>
<p><strong>Harga Jual Minimum = HPP ÷ (1 - Target Margin%)</strong></p>

<h2>Contoh Perhitungan: Nasi Goreng Spesial</h2>
<p>Misalkan kamu jual nasi goreng dengan data berikut:</p>
<ul>
<li>Bahan baku per porsi: Rp8.500</li>
<li>Tenaga kerja per porsi: Rp2.000</li>
<li>Overhead per porsi: Rp1.500</li>
</ul>
<p><strong>HPP = Rp8.500 + Rp2.000 + Rp1.500 = Rp12.000</strong></p>
<p>Jika target margin 40%, maka harga jual minimum = Rp12.000 ÷ (1 - 0,4) = <strong>Rp20.000</strong></p>
<p>Artinya, jika kamu jual di bawah Rp20.000, kamu belum mencapai target margin 40%.</p>

<h2>Kesalahan Umum dalam Hitung HPP</h2>
<ul>
<li><strong>Lupa hitung overhead:</strong> Gas dan listrik sering diabaikan karena tidak terasa langsung.</li>
<li><strong>Tidak hitung nilai waktu sendiri:</strong> Kalau kamu masak sendiri, waktu kamu punya nilai ekonomis.</li>
<li><strong>Tidak update saat harga bahan naik:</strong> HPP harus dihitung ulang setiap ada kenaikan harga bahan baku.</li>
<li><strong>Tidak pisahkan biaya produksi dan operasional:</strong> Sewa tempat makan berbeda dengan sewa dapur produksi.</li>
</ul>

<h2>Gunakan Kalkulator HPP Gratis</h2>
<p>Daripada hitung manual, gunakan Kalkulator HPP Pakarsheet yang sudah menyediakan semua kolom yang dibutuhkan — bahan baku, tenaga kerja, overhead — dan langsung menghitung HPP per unit serta harga jual minimum berdasarkan target margin kamu.</p>',
  'Tips Bisnis',
  ARRAY['HPP', 'bisnis kuliner', 'harga jual', 'UMKM', 'kalkulator HPP'],
  'Tim Pakarsheet',
  'published',
  true,
  7,
  'kalkulator-hpp',
  null,
  now() - interval '2 days'
),

(
  'cara-hitung-roas-iklan-facebook-tiktok',
  'Cara Hitung ROAS Iklan Facebook & TikTok Ads yang Benar',
  'ROAS 3x belum tentu untung. Banyak seller salah hitung ROAS karena tidak memasukkan HPP dan fee marketplace. Ini cara hitung ROAS yang benar.',
  '<h2>Apa itu ROAS?</h2>
<p>ROAS (Return on Ad Spend) adalah rasio antara revenue yang dihasilkan dari iklan dibagi dengan biaya iklan yang dikeluarkan. Formula dasarnya:</p>
<p><strong>ROAS = Revenue dari Iklan ÷ Biaya Iklan</strong></p>
<p>Jika kamu keluar Rp1 juta untuk iklan dan menghasilkan Rp4 juta penjualan, ROAS kamu adalah 4x.</p>

<h2>Kenapa ROAS Tinggi Belum Tentu Profit?</h2>
<p>Ini kesalahan paling umum yang dilakukan seller. ROAS hanya mengukur revenue vs biaya iklan — tidak memperhitungkan:</p>
<ul>
<li>HPP (Harga Pokok Produksi/Pembelian)</li>
<li>Fee marketplace (2-8% tergantung platform)</li>
<li>Biaya packaging dan ongkir</li>
<li>Biaya operasional lainnya</li>
</ul>
<p>Contoh: ROAS 3x dengan HPP 60% dari harga jual dan fee marketplace 5% sebenarnya sudah hampir tidak profit.</p>

<h2>Cara Hitung ROAS yang Benar</h2>
<p>Untuk tahu apakah iklan benar-benar menguntungkan, kamu perlu hitung <strong>ROAS Minimum Break-Even</strong>:</p>
<p><strong>ROAS BEP = Harga Jual ÷ (Harga Jual - HPP - Fee - Biaya Lain)</strong></p>
<p>Jika ROAS aktual kamu di atas ROAS BEP, iklan profitable. Jika di bawah, kamu rugi meski ROAS terlihat bagus.</p>

<h2>Contoh Perhitungan Lengkap</h2>
<p>Misalkan kamu jual produk seharga Rp150.000 di Shopee:</p>
<ul>
<li>HPP: Rp60.000 (40% dari harga jual)</li>
<li>Fee Shopee: Rp7.500 (5%)</li>
<li>Packaging: Rp3.000</li>
<li>Subsidi ongkir: Rp5.000</li>
</ul>
<p>Total biaya per unit (selain iklan): Rp75.500</p>
<p>Margin per unit sebelum iklan: Rp150.000 - Rp75.500 = Rp74.500</p>
<p>ROAS BEP = Rp150.000 ÷ Rp74.500 = <strong>2,01x</strong></p>
<p>Artinya, ROAS kamu harus di atas 2x agar iklan profitable. ROAS 3x berarti profit Rp(150.000 × 3 - 150.000 × 2,01) / 3 per unit dari iklan.</p>

<h2>Perbedaan ROAS di Facebook vs TikTok Ads</h2>
<p>Secara formula, ROAS dihitung sama. Yang berbeda adalah cara platform melaporkan konversi:</p>
<ul>
<li><strong>Facebook/Meta Ads:</strong> Menggunakan attribution window (biasanya 7-day click, 1-day view). Revenue yang dilaporkan bisa lebih tinggi dari aktual karena multi-touch attribution.</li>
<li><strong>TikTok Ads:</strong> Attribution window default 7-day click. Sering ada gap antara ROAS yang dilaporkan TikTok dengan revenue aktual di marketplace.</li>
</ul>
<p>Selalu bandingkan ROAS yang dilaporkan platform dengan data aktual dari Seller Centre marketplace kamu.</p>

<h2>Gunakan Kalkulator ROAS Gratis</h2>
<p>Hitung ROAS, CPA, AOV, dan laba bersih iklan kamu secara instan dengan Kalkulator ROAS Pakarsheet. Masukkan budget iklan, revenue, HPP, dan jumlah order — semua angka penting langsung muncul.</p>',
  'Marketing',
  ARRAY['ROAS', 'iklan Facebook', 'TikTok Ads', 'digital marketing', 'seller marketplace'],
  'Tim Pakarsheet',
  'published',
  false,
  6,
  'kalkulator-roas',
  null,
  now() - interval '5 days'
),

(
  'cara-kelola-cashflow-umkm',
  'Cara Kelola Cashflow UMKM agar Tidak Kehabisan Uang di Tengah Jalan',
  'Banyak bisnis yang profit di atas kertas tapi bangkrut karena cashflow. Panduan praktis mengelola arus kas untuk UMKM, lengkap dengan template gratis.',
  '<h2>Mengapa Cashflow Lebih Penting dari Profit?</h2>
<p>Profit adalah angka di laporan keuangan. Cashflow adalah uang yang benar-benar ada di rekening kamu. Bisnis bisa profit tapi bangkrut jika cashflow negatif — misalnya karena piutang belum dibayar, stok menumpuk, atau pengeluaran besar di awal bulan sebelum pemasukan masuk.</p>
<p>Ini yang disebut "profitable but cash-poor" — kondisi yang sangat umum di UMKM Indonesia.</p>

<h2>Komponen Cashflow yang Harus Dipantau</h2>
<h3>Cash Inflow (Pemasukan)</h3>
<ul>
<li>Penjualan tunai dan transfer langsung</li>
<li>Pembayaran piutang dari pelanggan</li>
<li>Pinjaman atau modal masuk</li>
<li>Pendapatan lain-lain</li>
</ul>
<h3>Cash Outflow (Pengeluaran)</h3>
<ul>
<li>Pembelian stok/bahan baku</li>
<li>Gaji karyawan</li>
<li>Sewa tempat dan utilitas</li>
<li>Biaya iklan dan marketing</li>
<li>Cicilan pinjaman</li>
<li>Pengeluaran operasional lainnya</li>
</ul>

<h2>Cara Buat Proyeksi Cashflow Sederhana</h2>
<p>Proyeksi cashflow tidak harus rumit. Cukup ikuti langkah ini:</p>
<ol>
<li><strong>Catat saldo awal bulan</strong> — berapa uang yang ada di rekening bisnis sekarang</li>
<li><strong>Proyeksikan semua pemasukan</strong> — kapan uang masuk dan berapa jumlahnya</li>
<li><strong>Proyeksikan semua pengeluaran</strong> — kapan uang keluar dan berapa jumlahnya</li>
<li><strong>Hitung net cashflow</strong> — total pemasukan dikurangi total pengeluaran</li>
<li><strong>Hitung saldo akhir</strong> — saldo awal + net cashflow</li>
</ol>

<h2>Tanda-tanda Cashflow Bermasalah</h2>
<ul>
<li>Sering telat bayar supplier karena menunggu pembayaran dari pelanggan</li>
<li>Harus pinjam uang pribadi untuk operasional bisnis</li>
<li>Tidak bisa ambil gaji sendiri meski bisnis "ramai"</li>
<li>Stok menumpuk tapi uang kas menipis</li>
<li>Runway (berapa bulan kas bisa bertahan) kurang dari 3 bulan</li>
</ul>

<h2>Tips Menjaga Cashflow Tetap Sehat</h2>
<ul>
<li><strong>Pisahkan rekening bisnis dan pribadi</strong> — ini langkah pertama yang paling penting</li>
<li><strong>Percepat collection piutang</strong> — berikan insentif untuk pembayaran cepat</li>
<li><strong>Negosiasi terms dengan supplier</strong> — minta tempo pembayaran lebih panjang</li>
<li><strong>Jaga stok minimum</strong> — jangan terlalu banyak modal yang "terkunci" di stok</li>
<li><strong>Buat cash reserve</strong> — simpan minimal 3 bulan biaya operasional sebagai buffer</li>
</ul>

<h2>Hitung Cashflow Bisnis Kamu Sekarang</h2>
<p>Gunakan Kalkulator Cashflow Pakarsheet untuk memproyeksikan arus kas bulanan bisnis kamu. Masukkan semua pemasukan dan pengeluaran, dan langsung dapatkan net cashflow, saldo akhir, dan runway bisnis kamu.</p>',
  'Keuangan Bisnis',
  ARRAY['cashflow', 'arus kas', 'UMKM', 'keuangan bisnis', 'manajemen keuangan'],
  'Tim Pakarsheet',
  'published',
  false,
  8,
  'kalkulator-cashflow',
  null,
  now() - interval '8 days'
),

(
  'strategi-harga-jual-marketplace-agar-tetap-profit',
  'Strategi Harga Jual di Marketplace agar Tetap Profit Setelah Kena Fee',
  'Fee marketplace bisa menggerus margin tanpa kamu sadari. Panduan lengkap cara menentukan harga jual di Shopee, Tokopedia, dan TikTok Shop agar tetap profit.',
  '<h2>Realita Fee Marketplace yang Sering Diabaikan</h2>
<p>Banyak seller baru yang kaget ketika melihat laporan keuangan pertama mereka — margin yang terlihat bagus di atas kertas ternyata jauh lebih kecil setelah dipotong berbagai fee marketplace.</p>
<p>Fee marketplace Indonesia bisa mencapai 8-15% dari harga jual jika kamu ikut program promo, subsidi ongkir, dan voucher toko. Ini angka yang signifikan dan harus diperhitungkan sejak awal.</p>

<h2>Komponen Fee yang Harus Diperhitungkan</h2>
<h3>Fee Tetap per Transaksi</h3>
<ul>
<li><strong>Shopee:</strong> Service fee 2% + admin fee 2% (estimasi seller reguler, bervariasi per kategori)</li>
<li><strong>Tokopedia:</strong> Service fee 1,8% + admin fee 1% (estimasi, bervariasi per kategori)</li>
<li><strong>TikTok Shop:</strong> Service fee 1,8% + admin fee 3% (estimasi, bervariasi per kategori)</li>
</ul>
<h3>Biaya Variabel</h3>
<ul>
<li>Subsidi ongkir (jika ikut program gratis ongkir)</li>
<li>Voucher toko (diskon yang kamu tanggung)</li>
<li>Biaya iklan (Shopee Ads, Tokopedia Ads, TikTok Ads)</li>
<li>Packaging dan packing material</li>
</ul>

<h2>Formula Harga Jual Minimum yang Aman</h2>
<p>Untuk menentukan harga jual minimum yang masih profit, gunakan formula ini:</p>
<p><strong>Harga Jual Min = HPP ÷ (1 - Total Fee% - Target Margin%)</strong></p>
<p>Contoh: HPP Rp50.000, total fee 8%, target margin 20%</p>
<p>Harga Jual Min = Rp50.000 ÷ (1 - 0,08 - 0,20) = Rp50.000 ÷ 0,72 = <strong>Rp69.444</strong></p>
<p>Bulatkan ke Rp70.000 atau Rp69.900 untuk harga yang lebih menarik secara psikologis.</p>

<h2>Strategi Harga untuk Kompetitif tapi Tetap Profit</h2>
<h3>1. Harga Anchor + Diskon</h3>
<p>Set harga normal lebih tinggi, lalu berikan diskon reguler. Pembeli merasa dapat deal bagus, kamu tetap profit karena harga "diskon" sudah memperhitungkan semua biaya.</p>
<h3>2. Bundling Produk</h3>
<p>Jual beberapa produk dalam satu paket dengan harga yang terlihat lebih murah per unit, tapi total margin lebih tinggi karena volume lebih besar.</p>
<h3>3. Tier Harga Berdasarkan Kuantitas</h3>
<p>Berikan harga lebih murah untuk pembelian lebih banyak. Ini meningkatkan AOV (Average Order Value) dan mengurangi biaya per transaksi.</p>

<h2>Simulasikan Harga Jual Kamu</h2>
<p>Gunakan Kalkulator Harga Jual Marketplace Pakarsheet untuk simulasi harga di berbagai platform. Preset fee untuk Shopee, Tokopedia, TikTok Shop, dan Lazada sudah tersedia — tinggal masukkan HPP dan target margin kamu.</p>',
  'Jualan Online',
  ARRAY['harga jual', 'marketplace', 'Shopee', 'Tokopedia', 'TikTok Shop', 'fee marketplace'],
  'Tim Pakarsheet',
  'published',
  false,
  7,
  'kalkulator-harga-jual',
  null,
  now() - interval '12 days'
),

(
  'google-sheets-untuk-laporan-keuangan-umkm',
  'Google Sheets untuk Laporan Keuangan UMKM: Panduan Lengkap 2025',
  'Google Sheets bisa jadi sistem keuangan yang powerful untuk UMKM — jika diatur dengan benar. Panduan lengkap membuat laporan keuangan sederhana yang bisa dipantau setiap hari.',
  '<h2>Kenapa Google Sheets Cocok untuk Keuangan UMKM?</h2>
<p>Software akuntansi seperti Accurate atau Jurnal memang powerful, tapi untuk UMKM yang baru mulai, biayanya bisa memberatkan dan kurva belajarnya cukup curam. Google Sheets menawarkan alternatif yang:</p>
<ul>
<li>Gratis dan bisa diakses dari mana saja</li>
<li>Familiar — hampir semua orang sudah tahu cara pakai spreadsheet</li>
<li>Fleksibel — bisa disesuaikan dengan alur bisnis spesifik kamu</li>
<li>Bisa diakses tim secara bersamaan (real-time collaboration)</li>
</ul>

<h2>Struktur Laporan Keuangan Sederhana di Google Sheets</h2>
<p>Untuk UMKM, kamu butuh minimal 3 sheet utama:</p>
<h3>1. Sheet Transaksi Harian</h3>
<p>Catat setiap transaksi dengan kolom: Tanggal, Keterangan, Kategori, Pemasukan, Pengeluaran, Saldo. Ini adalah "buku kas" digital kamu.</p>
<h3>2. Sheet Laporan Bulanan</h3>
<p>Ringkasan otomatis dari sheet transaksi menggunakan SUMIF atau pivot table. Tampilkan total pemasukan, pengeluaran per kategori, dan laba bersih per bulan.</p>
<h3>3. Dashboard</h3>
<p>Visualisasi data dengan chart sederhana: tren penjualan bulanan, breakdown pengeluaran, dan metrik kunci seperti margin dan cashflow.</p>

<h2>Formula Google Sheets yang Wajib Dikuasai</h2>
<ul>
<li><strong>SUMIF</strong> — menjumlahkan data berdasarkan kriteria tertentu (misal: total pengeluaran kategori "Marketing")</li>
<li><strong>SUMIFS</strong> — SUMIF dengan multiple kriteria (misal: total penjualan bulan Januari kategori "Produk A")</li>
<li><strong>VLOOKUP / XLOOKUP</strong> — mencari data dari sheet lain</li>
<li><strong>IF</strong> — logika kondisional untuk status atau kategori otomatis</li>
<li><strong>ARRAYFORMULA</strong> — menerapkan formula ke seluruh kolom sekaligus</li>
</ul>

<h2>Tips Membuat Laporan Keuangan yang Konsisten</h2>
<ul>
<li><strong>Input harian, bukan mingguan:</strong> Semakin sering input, semakin akurat datanya dan semakin mudah menemukan kesalahan.</li>
<li><strong>Gunakan dropdown untuk kategori:</strong> Hindari typo dengan Data Validation → List. Ini membuat SUMIF bekerja dengan benar.</li>
<li><strong>Pisahkan sheet per bulan atau per tahun:</strong> Jangan taruh semua data di satu sheet — akan lambat dan susah dikelola.</li>
<li><strong>Backup rutin:</strong> Download sebagai Excel atau PDF setiap akhir bulan.</li>
<li><strong>Protect sheet penting:</strong> Gunakan fitur Protect Sheet untuk mencegah formula tidak sengaja terhapus.</li>
</ul>

<h2>Mulai dengan Template yang Sudah Jadi</h2>
<p>Membuat sistem keuangan dari nol membutuhkan waktu dan keahlian formula yang cukup. Template Google Sheets Pakarsheet sudah menyediakan struktur yang siap pakai — tinggal isi data, laporan langsung terbentuk otomatis.</p>',
  'Google Sheets Tips',
  ARRAY['Google Sheets', 'laporan keuangan', 'UMKM', 'template spreadsheet', 'akuntansi sederhana'],
  'Tim Pakarsheet',
  'published',
  false,
  9,
  null,
  null,
  now() - interval '15 days'
);
