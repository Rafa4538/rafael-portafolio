import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Rafael Salazar | Full Stack Developer", template: "%s | Rafael Salazar" },
  description: "Full Stack Developer especializado en modernización de sistemas, automatización y aplicaciones con Next.js, React y Supabase.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rafael-salazar.vercel.app"),
  openGraph: { type: "website", title: "Rafael Salazar | Full Stack Developer", description: "Sistemas que conectan personas, procesos y datos." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
