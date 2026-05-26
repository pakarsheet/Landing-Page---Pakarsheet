export type ProductCategory =
  | "Finance"
  | "Sales"
  | "Operasional"
  | "Bundle"
  | "Marketing"
  | "Project";

export type ProductStatus = "active" | "draft";

export interface Database {
  public: {
    Tables: {
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
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["site_settings"]["Row"],
          "id" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
    };
  };
}

// Convenience type aliases
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
