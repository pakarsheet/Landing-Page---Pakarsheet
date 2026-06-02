import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { site } from "@/lib/site";
import { ScrollProgress } from "@/components/ScrollProgress";
import { GlobalAnnouncement } from "@/components/GlobalAnnouncement";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} - ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
    type: "website",
    url: site.url,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Preload the two most-used InterDisplay weights to avoid FOUT on hero text */}
        <link rel="preload" href="/fonts/InterDisplay-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/InterDisplay-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body
        className={`${GeistSans.variable} font-secondary antialiased`}
        style={{ "--font-inter": "InterDisplay" } as React.CSSProperties}
      >
        <ScrollProgress />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
