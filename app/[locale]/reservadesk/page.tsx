import Link from "next/link";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { ReservaDeskDemo } from "../../../components/reservadesk-demo";

const inter = Inter({ subsets: ["latin"], variable: "--font-rd" });

export default async function ReservaDeskPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "es" && locale !== "en") notFound();
  return (
    <main className={`rd-page ${inter.variable}`} style={{ fontFamily: "var(--font-rd), Inter, Segoe UI, sans-serif" }}>
      <div className="rd-back">
        <Link href={`/${locale}`}>← Volver al portafolio</Link>
        <span>Demo interactiva · Datos ficticios</span>
      </div>
      <ReservaDeskDemo />
    </main>
  );
}
