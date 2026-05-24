import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  DatabaseZap,
  FileSpreadsheet,
  LayoutDashboard,
  LineChart,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards
} from "lucide-react";

export const navItems = [
  { label: "Fitur", href: "#features" },
  { label: "Template", href: "#templates" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Harga", href: "#pricing" },
  { label: "FAQ", href: "#faq" }
];

export const stats = [
  {
    value: "40%",
    label: "lebih hemat waktu admin",
    description: "Input dan rekap kerja harian bisa jauh lebih ringkas.",
    icon: RefreshCw
  },
  {
    value: "3x",
    label: "lebih cepat pantau laporan",
    description: "Dashboard siap bantu owner ambil keputusan.",
    icon: BarChart3
  },
  {
    value: "1 hari",
    label: "sudah bisa dipakai",
    description: "Mulai dari template, bukan sistem kosong dari nol.",
    icon: PackageCheck
  },
  {
    value: "0 app",
    label: "tambahan rumit",
    description: "Tetap nyaman di Google Sheets yang tim sudah kenal.",
    icon: FileSpreadsheet
  }
];

export const problems = [
  {
    title: "Data ada, tapi berantakan",
    description: "File terlalu banyak, format beda-beda, dan susah tahu mana yang paling update.",
    icon: ClipboardList,
    accent: "bg-sky text-cobalt"
  },
  {
    title: "Input sering diulang",
    description: "Admin isi data berkali-kali karena sheet belum punya alur kerja yang jelas.",
    icon: RefreshCw,
    accent: "bg-sheet text-ink"
  },
  {
    title: "Laporan manual terus",
    description: "Setiap bulan harus bikin ulang, hitung ulang, dan cek ulang satu per satu.",
    icon: LineChart,
    accent: "bg-lilac text-cobalt"
  }
];

export const features = [
  {
    title: "Struktur data rapi",
    description: "Tabel, kolom, dan alur input dibuat jelas supaya tim tidak bingung mulai dari mana.",
    icon: DatabaseZap,
    accent: "bg-sheet text-ink"
  },
  {
    title: "Dashboard siap pantau",
    description: "Angka penting langsung kebaca tanpa harus bongkar banyak tab.",
    icon: LayoutDashboard,
    accent: "bg-sky text-cobalt"
  },
  {
    title: "Laporan lebih otomatis",
    description: "Formula dan summary sudah disiapkan agar rekap kerja tidak selalu mulai dari nol.",
    icon: Sparkles,
    accent: "bg-lilac text-ink"
  },
  {
    title: "Mudah dipakai tim",
    description: "Bahasa sheet dibuat dekat dengan kerja harian owner, admin, sales, dan finance.",
    icon: UsersRound,
    accent: "bg-sky text-cobalt"
  },
  {
    title: "Rasa mini software",
    description: "Tetap Google Sheets, tapi terasa lebih terarah seperti sistem kerja siap pakai.",
    icon: ShieldCheck,
    accent: "bg-sheet text-ink"
  },
  {
    title: "Siap dikembangkan",
    description: "Cocok jadi pondasi sebelum bisnis butuh software custom yang lebih besar.",
    icon: CheckCircle2,
    accent: "bg-sky text-cobalt"
  }
];

export const templates = [
  {
    title: "Finance Tracker",
    description: "Catat pemasukan, pengeluaran, cashflow, dan ringkasan laporan bulanan.",
    badge: "Finance"
  },
  {
    title: "Sales Pipeline",
    description: "Pantau lead, follow-up, deal, dan performa sales dalam satu dashboard.",
    badge: "Sales"
  },
  {
    title: "Operasional Harian",
    description: "Kelola order, pekerjaan tim, status proses, dan aktivitas harian.",
    badge: "Ops"
  },
  {
    title: "Bundle UMKM",
    description: "Paket template untuk owner yang butuh kontrol bisnis lebih rapi.",
    badge: "Bundle"
  }
];

export const steps = [
  {
    title: "Pilih template",
    description: "Ambil template yang paling dekat dengan alur bisnis kamu."
  },
  {
    title: "Isi data bisnis",
    description: "Masukkan data harian di format yang sudah disusun rapi."
  },
  {
    title: "Pantau dashboard",
    description: "Lihat ringkasan kerja tanpa bikin laporan dari nol lagi."
  }
];

export const pricing = [
  {
    name: "Basic Template",
    price: "Rp149rb",
    description: "Untuk mulai merapikan satu area kerja bisnis.",
    features: ["1 template siap pakai", "Dashboard dasar", "Panduan penggunaan", "Update minor"],
    cta: "Mulai Basic",
    highlighted: false
  },
  {
    name: "Pro Template",
    price: "Rp299rb",
    description: "Untuk tim kecil yang butuh laporan dan workflow lebih lengkap.",
    features: ["Template lengkap", "Dashboard premium", "Formula otomatis", "Support setup awal"],
    cta: "Pilih Pro",
    highlighted: true
  },
  {
    name: "Bundle Bisnis",
    price: "Rp599rb",
    description: "Untuk owner yang ingin beberapa area kerja langsung rapi.",
    features: ["3-5 template pilihan", "Dashboard gabungan", "Prioritas update", "Konsultasi alur"],
    cta: "Ambil Bundle",
    highlighted: false
  }
];

export const testimonials = [
  {
    quote:
      "Dulu laporan bulanan selalu mepet. Sekarang angka penting sudah kelihatan dari dashboard, jadi enak buat cek bisnis.",
    name: "Raka Pratama",
    role: "Owner toko online"
  },
  {
    quote:
      "Admin baru lebih cepat paham karena format sheet-nya jelas. Tidak banyak tanya kolom ini buat apa.",
    name: "Dina Laras",
    role: "Finance admin"
  }
];

export const faqs = [
  {
    question: "Apakah ini Google Sheets biasa?",
    answer:
      "Tetap Google Sheets, tapi sudah disusun seperti sistem kerja: ada struktur data, dashboard, laporan, dan formula otomatis."
  },
  {
    question: "Bisa dipakai tim?",
    answer:
      "Bisa. Template dibuat supaya owner, admin, finance, sales, dan tim operasional mudah membaca alurnya."
  },
  {
    question: "Butuh skill teknis?",
    answer:
      "Tidak. Kamu cukup paham input data dasar di Google Sheets. Panduan penggunaan juga disiapkan."
  },
  {
    question: "Bisa custom sesuai bisnis?",
    answer:
      "Bisa diarahkan lewat konsultasi kebutuhan. Struktur dasar template bisa jadi pondasi custom yang lebih spesifik."
  }
];

export const audience = ["Toko online", "Agency kecil", "Bisnis jasa", "Kuliner", "Reseller", "Freelancer"];

export const trustedBy = [
  "Owner bisnis",
  "Admin operasional",
  "Finance",
  "Sales",
  "Project manager"
];

export const revenueRows = [
  ["Pemasukan", "Rp42,8jt", "+18%"],
  ["Order selesai", "318", "+27%"],
  ["Piutang aktif", "Rp8,2jt", "-12%"],
  ["Cashflow bersih", "Rp15,7jt", "+9%"]
];

export const pipelineRows = [
  { label: "Input harian", value: 78 },
  { label: "Laporan otomatis", value: 92 },
  { label: "Follow-up sales", value: 64 }
];

export const quickMetrics = [
  { label: "Profit", value: "36%" },
  { label: "Stok aman", value: "91%" },
  { label: "Invoice", value: "24" }
];
