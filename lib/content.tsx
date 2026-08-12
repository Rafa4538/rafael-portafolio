export type Locale = "es" | "en";

const common = {
  github: "GitHub",
  email: "Email",
  cv: "CV",
  whatsapp: "WhatsApp",
};

export const content = {
  es: {
    nav: ["Experiencia", "Proyectos", "Habilidades", "Contacto"],
    eyebrow: "Full Stack Developer · Tampico, México",
    title: <>Construyo sistemas que convierten <em>procesos complejos</em> en experiencias claras.</>,
    intro: "Ingeniero en Sistemas Computacionales especializado en modernización, automatización e integración de sistemas. Conecto interfaces útiles con APIs, bases de datos y procesos de negocio que sí necesitan funcionar.",
    availability: "Disponible para oportunidades full-time",
    metrics: [["4+ años", "software empresarial"], ["Full Stack", "del dato a la interfaz"], ["B2", "inglés profesional"]],
    experienceLabel: "Trayectoria", experienceTitle: "Software que sostiene la operación diaria.",
    experienceIntro: "Mi trabajo vive entre usuarios, reglas de negocio, bases de datos heredadas y nuevas plataformas web. Ese contexto es el que guía cada decisión técnica.",
    jobs: [
      { company: "Instituto Winston Churchill", role: "Desarrollador Full Stack", date: "Mayo 2024 - Julio 2026", text: "Modernicé sistemas PHP con Next.js, React, TypeScript, Tailwind y Supabase. Automaticé becas, pagos, contratos, reservaciones, calificaciones y procesos administrativos que antes eran mayormente manuales, aumentando la eficacia del tiempo de trabajo en aproximadamente 110%. También desarrollé un sistema de gestión de incidencias para CONTPAQi, que redujo en cerca de 90% el tiempo dedicado al proceso manual." },
      { company: "MG Sistemas", role: "Desarrollador de Software", date: "Enero 2022 - Enero 2024", text: "Desarrollé una aplicación móvil de comandería con Java y Flutter; integré APIs REST, tareas asíncronas e impresión por red y Bluetooth." }
    ],
    projectLabel: "Casos de estudio", projectTitle: "Interfaces cuidadas. Backends que responden.",
    projects: [
      { num: "01 / EXPERIENCIA", name: "Control operativo y asistencia", desc: "Caso anonimizado de una plataforma con roles, horarios, incidencias, reportes e integración entre MySQL, Firebird, biométricos y exportación para nómina.", tags: ["Next.js", "MySQL", "Firebird", "APIs", "Roles"] },
      { num: "02 / PRODUCTO", name: "ReservaDesk", desc: "SaaS de reservas para pequeños negocios con agenda, disponibilidad, cuentas por rol, comprobantes y reportes. Diseñado con Supabase Auth, Storage y RLS.", tags: ["Next.js", "Supabase", "PostgreSQL", "RLS"] },
      { num: "03 / PRODUCTO", name: "Mercado Local", desc: "Comercio electrónico de punta a punta: catálogo, inventario, carrito, pedidos, panel administrativo, Stripe Checkout y webhooks idempotentes.", tags: ["Stripe", "Supabase", "Webhooks", "Vercel"] },
      { num: "04 / ENFOQUE", name: "Integraciones que evolucionan", desc: "Experiencia conectando CRM y procesos existentes, resolviendo incidencias y llevando plataformas de WordPress a aplicaciones modernas y mantenibles.", tags: ["REST", "CRM", "Migración", "Soporte"] }
    ],
    skillsLabel: "Stack", skillsTitle: "Tecnologías al servicio del problema.",
    skillsIntro: "Selecciono herramientas que permitan entregar, mantener y escalar. Sin complejidad innecesaria.",
    contactLabel: "Contacto", contactTitle: "¿Construimos algo que realmente mueva la operación?", contactText: "Estoy disponible para equipos que necesiten convertir procesos y datos en productos claros, confiables y útiles.",
    footer: "Diseñado y desarrollado por Rafael Salazar.",
    ...common
  },
  en: {
    nav: ["Experience", "Projects", "Skills", "Contact"],
    eyebrow: "Full Stack Developer · Tampico, Mexico",
    title: <>I build systems that turn <em>complex processes</em> into clear experiences.</>,
    intro: "Computer Systems Engineer specializing in modernization, automation, and system integration. I connect useful interfaces with APIs, databases, and business processes that need to work reliably.",
    availability: "Open to full-time opportunities",
    metrics: [["4+ years", "enterprise software"], ["Full Stack", "from data to interface"], ["B2", "professional English"]],
    experienceLabel: "Experience", experienceTitle: "Software that supports daily operations.",
    experienceIntro: "My work sits between users, business rules, legacy databases, and modern web platforms. That context guides every technical decision.",
    jobs: [
      { company: "Instituto Winston Churchill", role: "Full Stack Developer", date: "May 2024 - July 2026", text: "Modernized PHP systems with Next.js, React, TypeScript, Tailwind, and Supabase. Automated scholarships, payments, contracts, reservations, grades, and administrative workflows that had been largely manual, improving time efficiency by approximately 110%. Also developed a CONTPAQi incident-management system that reduced time spent on the manual process by about 90%." },
      { company: "MG Sistemas", role: "Software Developer", date: "January 2022 - January 2024", text: "Built a restaurant ordering mobile app using Java and Flutter; integrated REST APIs, asynchronous tasks, and network and Bluetooth printing." }
    ],
    projectLabel: "Case studies", projectTitle: "Thoughtful interfaces. Backends that deliver.",
    projects: [
      { num: "01 / EXPERIENCE", name: "Operations & attendance control", desc: "An anonymized case study of a platform with roles, schedules, incidents, reporting, and integrations between MySQL, Firebird, biometric devices, and payroll exports.", tags: ["Next.js", "MySQL", "Firebird", "APIs", "Roles"] },
      { num: "02 / PRODUCT", name: "ReservaDesk", desc: "A booking SaaS for small businesses with schedules, availability, role-based accounts, receipts, and reports. Designed with Supabase Auth, Storage, and RLS.", tags: ["Next.js", "Supabase", "PostgreSQL", "RLS"] },
      { num: "03 / PRODUCT", name: "Mercado Local", desc: "End-to-end e-commerce: catalog, inventory, cart, orders, admin panel, Stripe Checkout, and idempotent webhooks.", tags: ["Stripe", "Supabase", "Webhooks", "Vercel"] },
      { num: "04 / FOCUS", name: "Integrations that evolve", desc: "Experience connecting CRMs and existing workflows, resolving incidents, and moving WordPress platforms to maintainable modern applications.", tags: ["REST", "CRM", "Migration", "Support"] }
    ],
    skillsLabel: "Stack", skillsTitle: "Technology in service of the problem.",
    skillsIntro: "I choose tools that make delivery, maintenance, and growth possible - without unnecessary complexity.",
    contactLabel: "Contact", contactTitle: "Shall we build something that moves operations forward?", contactText: "I am available for teams that need to turn processes and data into clear, reliable, and useful products.",
    footer: "Designed and built by Rafael Salazar.",
    ...common
  }
} as const;

export const skills = ["Next.js", "React", "TypeScript", "Tailwind CSS", "JavaScript", "PHP", "Java", "Flutter", "Supabase", "MySQL", "Firebird", "SQL", "REST APIs", "Git & GitHub", "Vercel", "Linux", "Office 365"];
