"use client";

import type { DemoStep, Student } from "../../lib/reservadesk-demo";

type FlowStep = "dashboard" | "zones" | "seats" | "payment";

const stepLabels: Record<FlowStep, string> = {
  dashboard: "Inicio",
  zones: "Zona",
  seats: "Asientos",
  payment: "Pago",
};

const navItems: { step: DemoStep; label: string; icon: string }[] = [
  { step: "dashboard", label: "Inicio", icon: "⌂" },
  { step: "zones", label: "Reservar", icon: "◫" },
  { step: "payment", label: "Pagos", icon: "◈" },
];

type RdAppShellProps = {
  student: Student;
  step: DemoStep;
  hasSelectedZone: boolean;
  hasPendingPayment: boolean;
  onNavigate: (step: DemoStep) => void;
  onScrollToZones: () => void;
  onLogout: () => void;
  children: React.ReactNode;
};

export function RdAppShell({
  student,
  step,
  hasSelectedZone,
  hasPendingPayment,
  onNavigate,
  onScrollToZones,
  onLogout,
  children,
}: RdAppShellProps) {
  const flowSteps: FlowStep[] = ["dashboard", "zones", "seats", "payment"];

  function canNavigateTo(flowStep: FlowStep): boolean {
    if (flowStep === "dashboard" || flowStep === "zones") return true;
    if (flowStep === "seats") return hasSelectedZone || step === "seats";
    if (flowStep === "payment") return hasPendingPayment || step === "payment";
    return false;
  }

  return (
    <section className="rd-app">
      <header className="rd-header">
        <div className="rd-header-left">
          <div className="rd-brand">
            <span>RESERVA</span>
            <strong>DESK</strong>
          </div>
          {step !== "confirmation" && (
            <nav className="rd-stepper" aria-label="Progreso de reserva">
              {flowSteps.map((flowStep, index) => {
                const isActive = step === flowStep || (flowStep === "zones" && step === "seats");
                const isComplete =
                  (flowStep === "dashboard" && step !== "dashboard" && step !== "login") ||
                  (flowStep === "zones" && (step === "seats" || step === "payment")) ||
                  (flowStep === "seats" && step === "payment");
                const disabled = !canNavigateTo(flowStep);
                return (
                  <button
                    key={flowStep}
                    type="button"
                    className={`rd-stepper-item ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
                    onClick={() => {
                      if (flowStep === "zones") onScrollToZones();
                      else if (!disabled) onNavigate(flowStep);
                    }}
                    disabled={disabled}
                  >
                    <span>{index + 1}</span>
                    {stepLabels[flowStep]}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
        <div className="rd-header-user">
          <div>
            <b>{student.name}</b>
            <small>
              {student.family} · Nivel {student.level}
            </small>
          </div>
          <button type="button" className="rd-btn-ghost" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="rd-layout">
        <aside className="rd-sidebar">
          <p className="eyebrow">Panel de control</p>
          <nav className="rd-nav">
            {navItems.map((item) => (
              <button
                key={item.step}
                type="button"
                className={`rd-nav-item ${
                  step === item.step ||
                  (item.step === "zones" && (step === "seats" || step === "zones")) ||
                  (item.step === "payment" && step === "payment")
                    ? "is-active"
                    : ""
                }`}
                onClick={() => (item.step === "zones" ? onScrollToZones() : onNavigate(item.step))}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="rd-sidebar-card">
            <span className="rd-badge rd-badge-demo">Entorno Demo</span>
            <p>Festival Educativo 2026</p>
            <small>Datos ficticios para demostración del portafolio.</small>
          </div>
        </aside>
        <main className="rd-main">{children}</main>
      </div>
    </section>
  );
}
