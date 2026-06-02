export type ProductCategory =
  | "Finance"
  | "Sales"
  | "Operasional"
  | "Bundle"
  | "Marketing"
  | "Project";

export type ProductStatus = "active" | "draft";
export type PostStatus = "published" | "draft";

export type PostCategory =
  | "Tips Bisnis"
  | "Keuangan Bisnis"
  | "Jualan Online"
  | "Marketing"
  | "Google Sheets Tips"
  | "Manajemen Bisnis";

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          category: string;
          tags: string[];
          author_name: string;
          author_avatar: string | null;
          status: PostStatus;
          featured: boolean;
          read_time: number;
          related_tool_slug: string | null;
          related_shop_slug: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["posts"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_title: string;
          description: string;
          long_description: string;
          badge: string;
          category: ProductCategory;
          price: string;
          price_raw: number;
          original_price: string | null;
          cta_url: string;
          accent: string;
          is_new: boolean;
          is_best_seller: boolean;
          features: string[];
          whats_included: string[];
          preview_images: string[];
          sort_order: number;
          status: ProductStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: string;
          whatsapp_number: string;
          whatsapp_message: string;
          site_name: string;
          tagline: string;
          contact_url: string;
          announcement_text: string | null;
          is_announcement_active: boolean;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["site_settings"]["Row"],
          "id" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
      custom_orders: {
        Row: {
          id: string;
          name: string;
          whatsapp: string;
          business_name: string | null;
          business_type: string;
          package: string;
          description: string;
          has_old_file: boolean;
          team_size: string | null;
          urgency: string | null;
          status: "baru" | "dihubungi" | "negosiasi" | "deal" | "tidak-jadi";
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["custom_orders"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["custom_orders"]["Insert"]>;
      };
    };
  };
}

// Convenience type aliases
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
export type CustomOrder = Database["public"]["Tables"]["custom_orders"]["Row"];
export type CustomOrderInsert = Database["public"]["Tables"]["custom_orders"]["Insert"];
export type CustomOrderUpdate = Database["public"]["Tables"]["custom_orders"]["Update"];
