import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Pengaturan Situs",
  type: "document",
  icon: Settings,
  fields: [
    defineField({
      name: "whatsappNumber",
      title: "Nomor WhatsApp",
      type: "string",
      description:
        'Format internasional tanpa + atau spasi. Contoh: 6281234567890',
      validation: (r) =>
        r
          .required()
          .regex(/^\d{10,15}$/, {
            name: "format nomor",
            invert: false,
          })
          .error("Masukkan nomor valid, contoh: 6281234567890"),
    }),
    defineField({
      name: "whatsappMessage",
      title: "Pesan Default WhatsApp",
      type: "text",
      rows: 3,
      description: "Pesan yang otomatis terisi saat pengunjung klik tombol WA",
      initialValue:
        "Halo Pakarsheet, saya ingin tahu lebih lanjut tentang produknya 😊",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "whatsappNumber" },
    prepare({ title }) {
      return { title: "Pengaturan Situs", subtitle: `WA: ${title ?? "-"}` };
    },
  },
});
