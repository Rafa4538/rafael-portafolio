import Link from "next/link";
import { notFound } from "next/navigation";
import { ReservaDeskDemo } from "../../../components/reservadesk-demo";

export default async function ReservaDeskPage({ params }: { params: Promise<{ locale: string }> }) {
 const { locale } = await params; if (locale !== "es" && locale !== "en") notFound();
 return <main className="rd-page"><div className="rd-back"><Link href={`/${locale}`}>← Volver al portafolio</Link><span>Demo interactiva · Datos ficticios</span></div><ReservaDeskDemo /></main>;
}
