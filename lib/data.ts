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
  { label: "FAQ", href: "#faq" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
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

// ─── HowItWorks panels ────────────────────────────────────────────────────────

export type HowItWorksPanel = {
  kicker: string;
  title: string;
  description: string;
  points: string[];
  /** Determines which mockup visual to render: "sheet" | "flow" | "chart" */
  visual: "sheet" | "flow" | "chart";
};

export const howItWorksPanels: HowItWorksPanel[] = [
  {
    kicker: "01",
    title: "Template siap pakai, bukan sheet kosong.",
    description: "Mulai dari struktur data yang sudah disusun untuk pekerjaan harian bisnis.",
    points: [
      "Kolom dan tab sudah tertata",
      "Format input mudah diikuti tim",
      "Bisa langsung dipakai hari pertama",
    ],
    visual: "sheet",
  },
  {
    kicker: "02",
    title: "Workflow lebih otomatis tanpa pindah aplikasi.",
    description: "Formula, status, dan ringkasan dibuat supaya rekap kerja tidak selalu manual.",
    points: [
      "Update status lebih jelas",
      "Rekap otomatis dari data input",
      "Minim input ulang dan salah hitung",
    ],
    visual: "flow",
  },
  {
    kicker: "03",
    title: "Dashboard bikin angka penting cepat kebaca.",
    description: "Owner bisa pantau performa tanpa bongkar banyak tab atau bikin laporan dari nol.",
    points: [
      "Ringkasan penjualan dan biaya",
      "Grafik siap untuk evaluasi",
      "Laporan lebih enak dibagikan",
    ],
    visual: "chart",
  },
];

export const pricing = [
  {
    name: "Basic Template",
    price: "Rp149rb",
    description: "Untuk mulai merapikan satu area kerja bisnis.",
    features: ["1 template siap pakai", "Dashboard dasar", "Panduan penggunaan", "Update minor"],
    cta: "Mulai Basic",
    ctaUrl: "#pricing",
    highlighted: false
  },
  {
    name: "Pro Template",
    price: "Rp299rb",
    description: "Untuk tim kecil yang butuh laporan dan workflow lebih lengkap.",
    features: ["Template lengkap", "Dashboard premium", "Formula otomatis", "Support setup awal"],
    cta: "Pilih Pro",
    ctaUrl: "#pricing",
    highlighted: true
  },
  {
    name: "Bundle Bisnis",
    price: "Rp599rb",
    description: "Untuk owner yang ingin beberapa area kerja langsung rapi.",
    features: ["3-5 template pilihan", "Dashboard gabungan", "Prioritas update", "Konsultasi alur"],
    cta: "Ambil Bundle",
    ctaUrl: "https://wa.me/6280000000000",
    highlighted: false
  }
];

export const testimonials = [
  {
    quote:
      "Dulu laporan bulanan selalu mepet. Sekarang angka penting sudah kelihatan dari dashboard, jadi enak buat cek bisnis.",
    name: "Raka Pratama",
    role: "Owner toko online",
    accent: "bg-leaf"
  },
  {
    quote:
      "Admin baru lebih cepat paham karena format sheet-nya jelas. Tidak banyak tanya kolom ini buat apa.",
    name: "Dina Laras",
    role: "Finance admin",
    accent: "bg-sky"
  },
  {
    quote:
      "Sales pipeline-nya bantu banget. Sekarang bisa lihat mana lead yang udah lama nggak di-follow up tanpa harus buka banyak file.",
    name: "Bimo Santoso",
    role: "Sales manager, agency digital",
    accent: "bg-lilac"
  },
  {
    quote:
      "Sebelumnya cashflow dicatat manual di notes HP. Sekarang pakai Finance Tracker, semua langsung keliatan di satu tempat.",
    name: "Sari Wulandari",
    role: "Owner bisnis kuliner",
    accent: "bg-leaf"
  },
  {
    quote:
      "Tim operasional kami jadi lebih tertib. Setiap orang tahu harus isi apa dan kapan, nggak perlu diingatkan terus.",
    name: "Hendra Kusuma",
    role: "Manajer operasional, toko retail",
    accent: "bg-sky"
  },
  {
    quote:
      "Saya freelancer yang handle beberapa klien sekaligus. Template project-nya bantu saya pantau progress tanpa ribet.",
    name: "Ayu Permata",
    role: "Freelance project manager",
    accent: "bg-lilac"
  },
  {
    quote:
      "Awalnya ragu karena masih Google Sheets. Tapi setelah pakai, rasanya beda — lebih niat, lebih enak dibaca, dan tim nggak bingung.",
    name: "Fajar Nugroho",
    role: "Co-founder startup UMKM",
    accent: "bg-leaf"
  },
  {
    quote:
      "Bundle Bisnis worth it banget. Langsung rapi dari finance, ops, sampai sales. Nggak perlu bikin sistem dari nol.",
    name: "Rina Marlina",
    role: "Owner reseller fashion",
    accent: "bg-sky"
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

// ─── Shop Templates ───────────────────────────────────────────────────────────

export type ShopTemplate = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  badge: string;
  category: "Finance" | "Sales" | "Operasional" | "Bundle" | "Marketing" | "Project";
  price: string;
  priceRaw: number;
  originalPrice?: string;
  icon: typeof WalletCards;
  accent: string;
  features: string[];
  whatsIncluded: string[];
  previewImages: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  ctaUrl: string;
};

export const shopTemplates: ShopTemplate[] = [
  {
    slug: "content-planner-instagram-pro",
    title: "Content Planner Instagram Pro",
    shortTitle: "Content Planner IG",
    description: "Rencanakan, jadwalkan, dan pantau konten Instagram bisnis kamu dalam satu spreadsheet yang rapi.",
    longDescription:
      "Buat konten Instagram jadi lebih terencana dan konsisten. Template ini membantu kamu menyusun kalender konten, mencatat ide, memantau performa posting, dan memastikan jadwal upload tidak berantakan — semua dari Google Sheets.",
    badge: "Marketing",
    category: "Marketing",
    price: "Rp99rb",
    priceRaw: 99000,
    originalPrice: "Rp149rb",
    icon: LayoutDashboard,
    accent: "bg-sky text-cobalt",
    features: [
      "Kalender konten bulanan",
      "Tracker ide & caption",
      "Jadwal posting otomatis",
      "Pantau engagement per post",
    ],
    whatsIncluded: [
      "1 file Google Sheets siap pakai",
      "Kalender konten 12 bulan",
      "Tracker ide konten & caption",
      "Dashboard performa konten",
      "Panduan penggunaan lengkap",
      "Update minor gratis",
    ],
    previewImages: [
      "/previews/content-planner-instagram-pro/preview-1.jpg",
      "/previews/content-planner-instagram-pro/preview-2.jpg",
      "/previews/content-planner-instagram-pro/preview-3.jpg",
      "/previews/content-planner-instagram-pro/preview-4.jpg",
    ],
    isNew: true,
    isBestSeller: false,
    ctaUrl: "https://lynkd.id/pakarsheet",
  },
];

// Re-export from lib/types to keep a single source of truth
export { shopCategories, type ShopCategory } from "@/lib/types";
