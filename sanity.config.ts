import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "pakarsheet-studio",
  title: "Pakarsheet Admin",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Pakarsheet")
          .items([
            S.listItem()
              .title("Produk Toko")
              .schemaType("shopTemplate")
              .child(S.documentTypeList("shopTemplate").title("Semua Produk")),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
