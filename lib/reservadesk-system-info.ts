import { functionCatalog, HOLD_MINUTES, limits, SERVICE_FEE, zones } from "./reservadesk-demo";

export const projectOverview = {
  title: "ReservaDesk — Festival Educativo 2026",
  description:
    "Demo interactiva de un sistema enterprise de reserva de boletos para un festival escolar. Forma parte del portafolio de Rafael Salazar como caso de estudio de UX, reglas de negocio complejas y arquitectura preparada para producción.",
  purpose:
    "Mostrar capacidad para diseñar flujos multi-paso, validaciones familiares, apartados temporales, pasarela de pago simulada y documentación técnica clara para stakeholders.",
};

export const businessRules = [
  {
    title: "Cupo familiar por función",
    detail: `Función 1: ${limits[1]} boletos · Función 2: ${limits[2]} boletos · Función 3: ${limits[3]} boletos por familia.`,
    important: false,
  },
  {
    title: "Apartado temporal de 10 minutos",
    detail: `Toda reserva pendiente de pago dura ${HOLD_MINUTES} minutos. Si no se paga a tiempo, los asientos se liberan automáticamente.`,
    important: true,
  },
  {
    title: "Cancelación manual",
    detail: "Las familias pueden liberar reservas pendientes desde el dashboard antes de pagar.",
    important: false,
  },
  {
    title: "Función asignada por nivel",
    detail: "Niveles 1-2 → Función 1 (Descubre) · Nivel 3 → Función 2 (Imagina) · Nivel 4 → Función 3 (Crea).",
    important: false,
  },
  {
    title: "Zonas y precios",
    detail: `Oro $${zones[0].price} · Plata $${zones[1].price} · Bronce $${zones[2].price} MXN por boleto, más $${SERVICE_FEE} MXN de comisión de servicio.`,
    important: false,
  },
  {
    title: "Boletos pagados",
    detail: "Las compras confirmadas no pueden cancelarse en esta demo.",
    important: false,
  },
  {
    title: "Selección de asientos",
    detail: "Solo asientos de tu función. Ocupados o apartados por otras familias no están disponibles.",
    important: false,
  },
];

export const systemValidations = [
  "Login con email institucional demo y contraseña Festival2026!",
  "Cupo familiar calculado en tiempo real (pendientes + pagados + selección activa).",
  "Expiración automática de reservas a los 10 minutos con liberación de asientos.",
  "Apartado temporal en mapa de asientos con countdown y auto-limpieza al expirar.",
  "Bloqueo de pago en reservas expiradas.",
  "Validación de tarjeta: 16 dígitos, titular, vencimiento MM/AA y CVV.",
  "Prevención de doble ocupación mediante conjunto de asientos bloqueados.",
  "Límite de boletos por familia aplicado antes de confirmar selección.",
];

export const demoFlow = [
  { step: "Login", detail: "Acceso con cuenta demo de alumno y contraseña institucional." },
  { step: "Dashboard", detail: "KPIs, perfil familiar, reservas pendientes y selector de zona." },
  { step: "Zona", detail: "Elección entre Oro, Plata o Bronce según disponibilidad." },
  { step: "Mapa de asientos", detail: "Selección visual con timer de apartado temporal." },
  { step: "Pago simulado", detail: "Pasarela estilo Stripe con procesamiento animado." },
  { step: "Confirmación", detail: "Folio generado y descarga de recibo PDF." },
];

export const techStack = [
  { name: "Next.js 16", role: "App Router, SSR y API routes" },
  { name: "React 19", role: "UI interactiva con estado cliente" },
  { name: "TypeScript", role: "Tipado de dominio y helpers" },
  { name: "CSS Design System", role: "Tokens .rd-* enterprise, animaciones y responsive" },
  { name: "pdf-lib", role: "Generación de recibos PDF en servidor" },
  { name: "InsForge / PostgreSQL", role: "Schema preparado con RLS (insforge/schema.sql)" },
  { name: "Vercel", role: "Despliegue del portafolio y demo en producción" },
];

export const preparedArchitecture = [
  "Tablas: families, students, festival_functions, seats, orders, order_tickets, booking_windows.",
  "RLS-ready con auth_user_id en students y políticas por familia.",
  "Estados de orden: held → paid con hold_expires_at.",
  "La demo actual usa mock en cliente; el schema está listo para integración backend.",
];

export const festivalFunctions = functionCatalog.map((fn) => ({
  ...fn,
  limit: limits[fn.number],
}));

export function scrollToZoneSection() {
  document.getElementById("rd-zone-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
