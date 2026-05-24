import { defineField, defineType } from "sanity";

export const shopTemplateType = defineType({
  name: "shopTemplate",
  title: "Shop Template",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul Template",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortTitle",
      title: "Judul Pendek",
      type: "string",
      description: "Dipakai di card kecil / mobile",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge / Label",
      type: "string",
      description: "Contoh: Marketing, Finance, Bundle",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Finance",      value: "Finance" },
          { title: "Sales",        value: "Sales" },
          { title: "Operasional",  value: "Operasional" },
          { title: "Marketing",    value: "Marketing" },
          { title: "Project",      value: "Project" },
          { title: "Bundle",       value: "Bundle" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi Singkat",
      type: "text",
      rows: 2,
      description: "Tampil di card toko",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "longDescription",
      title: "Deskripsi Panjang",
      type: "text",
      rows: 4,
      description: "Tampil di halaman detail produk",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Harga (tampilan)",
      type: "string",
      description: 'Contoh: "Rp99rb"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "priceRaw",
      title: "Harga (angka)",
      type: "number",
      description: "Contoh: 99000",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "originalPrice",
      title: "Harga Asli (sebelum diskon)",
      type: "string",
      description: 'Opsional. Contoh: "Rp149rb"',
    }),
    defineField({
      name: "ctaUrl",
      title: "URL Beli / CTA",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "accent",
      title: "Accent Color Class",
      type: "string",
      description: 'Tailwind class. Contoh: "bg-sky text-cobalt"',
      initialValue: "bg-sky text-cobalt",
    }),
    defineField({
      name: "isNew",
      title: "Badge Baru?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isBestSeller",
      title: "Badge Best Seller?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "features",
      title: "Fitur Utama",
      type: "array",
      of: [{ type: "string" }],
      description: "Tampil di card toko (maks 4)",
    }),
    defineField({
      name: "whatsIncluded",
      title: "Yang Kamu Dapat",
      type: "array",
      of: [{ type: "string" }],
      description: "Checklist di halaman detail",
    }),
    defineField({
      name: "previewImages",
      title: "Gambar Preview",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        },
      ],
      description: "Upload gambar preview produk (maks 6)",
      validation: (r) => r.max(6),
    }),
    defineField({
      name: "order",
      title: "Urutan Tampil",
      type: "number",
      description: "Angka kecil tampil lebih dulu",
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "price",
      media: "previewImages.0",
    },
  },
  orderings: [
    {
      title: "Urutan Tampil",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
