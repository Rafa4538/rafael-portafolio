"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LocaleSwitch({ locale }: { locale: "es" | "en" }) {
  const pathname = usePathname();
  const other = locale === "es" ? "en" : "es";
  const href = pathname.replace(/^\/(es|en)/, `/${other}`);
  return <Link className="button button-secondary" style={{ padding: ".48rem .7rem", fontSize: ".75rem" }} href={href} onClick={() => { document.cookie = `preferred-locale=${other};path=/;max-age=31536000;samesite=lax`; }} aria-label={`Switch language to ${other.toUpperCase()}`}>{other.toUpperCase()}</Link>;
}
