import Link from "next/link";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { LocaleSwitch } from "../../components/locale-switch";
import { MotionEffects } from "../../components/motion-effects";
import { content, skills, type Locale } from "../../lib/content";

const hrefs = { github: "https://github.com/Rafa4538", email: "mailto:rafasalazargarcia@gmail.com", whatsapp: "https://wa.me/528334182855" };

export function generateStaticParams() { return [{ locale: "es" }, { locale: "en" }]; }

export default async function Portfolio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "es" && rawLocale !== "en") notFound();
  const locale = rawLocale as Locale;
  const t = content[locale];
  const labels = locale === "es" ? ["experiencia", "proyectos", "habilidades", "contacto"] : ["experience", "projects", "skills", "contact"];
  return <main><MotionEffects />
    <nav className="nav"><div className="shell nav-inner"><Link href={`/${locale}`} style={{ fontWeight: 800, letterSpacing: "-.04em" }}>RS<span style={{ color: "#72b1ff" }}>.</span></Link><div className="nav-links">{t.nav.map((item, i) => <a href={`#${labels[i]}`} key={item}>{item}</a>)}</div><div style={{ display: "flex", gap: 8 }}><a className="button button-secondary" style={{ padding: ".48rem .7rem", fontSize: ".75rem" }} href="/CV_Rafael_Salazar_2026.pdf" download>{t.cv} ↓</a><LocaleSwitch locale={locale} /></div></div></nav>
    <section className="hero atmosphere"><span className="ambient ambient-one" /><span className="ambient ambient-two" /><div className="shell hero-content"><div className="eyebrow">{t.eyebrow}</div><h1>{t.title}</h1><p className="muted hero-copy">{t.intro}</p><div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}><a className="button button-primary" href={`#${labels[3]}`}>{locale === "es" ? "Hablemos" : "Let’s talk"} <span>↗</span></a><a className="button button-secondary" href={hrefs.github} target="_blank" rel="noreferrer">{t.github} ↗</a></div><div className="hero-meta"><span>● {t.availability}</span><span>↗ Next.js · React · TypeScript</span></div><div className="metrics">{t.metrics.map(([value, label]) => <div className="metric" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div></section>
    <section id={labels[0]} className="section" data-reveal><div className="shell split"><div><div className="eyebrow">{t.experienceLabel}</div><h2>{t.experienceTitle}</h2><p className="muted">{t.experienceIntro}</p></div><div className="timeline">{t.jobs.map(job => <article className="timeline-item" key={job.company}><time>{job.date}</time><h3>{job.role} <span style={{ color: "#8fa2ba", fontWeight: 400 }}>· {job.company}</span></h3><p className="muted" style={{ margin: 0 }}>{job.text}</p></article>)}</div></div></section>
    <section id={labels[1]} className="section" data-reveal><div className="shell"><div className="eyebrow">{t.projectLabel}</div><h2>{t.projectTitle}</h2><div className="project-grid">{t.projects.map((project, index) => <article className="card project" key={project.name} style={{ transitionDelay: `${index * 70}ms` }}><div><span className="number">{project.num}</span><h3>{project.name}</h3><p className="muted">{project.desc}</p>{project.name === "ReservaDesk" && <Link href={`/${locale}/reservadesk`} className="button button-primary" style={{ marginTop: 18, padding: ".62rem .9rem" }}>{locale === "es" ? "Probar demo" : "Try the demo"} ↗</Link>}</div><div>{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></article>)}</div></div></section>
    <section id={labels[2]} className="section" data-reveal><div className="shell split"><div><div className="eyebrow">{t.skillsLabel}</div><h2>{t.skillsTitle}</h2><p className="muted">{t.skillsIntro}</p></div><div className="skills">{skills.map(skill => <span className="skill" key={skill}>{skill}</span>)}</div></div></section>
    <section id={labels[3]} className="contact atmosphere" data-reveal><span className="ambient ambient-three" /><div className="shell"><div className="eyebrow">{t.contactLabel}</div><h2>{t.contactTitle}</h2><p className="muted" style={{ maxWidth: 560, margin: "0 auto 28px" }}>{t.contactText}</p><div className="contact-actions"><a className="button button-primary" href={hrefs.email}>{t.email}</a><a className="button button-secondary" href={hrefs.whatsapp} target="_blank" rel="noreferrer">{t.whatsapp} ↗</a><a className="button button-secondary" href={hrefs.github} target="_blank" rel="noreferrer">{t.github} ↗</a></div></div></section>
    <footer className="shell footer"><span>© {new Date().getFullYear()} Rafael de Jesús Salazar García</span><span>{t.footer}</span></footer><Analytics />
  </main>;
}
