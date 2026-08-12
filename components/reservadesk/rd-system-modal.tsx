"use client";

import { useEffect, useRef } from "react";
import {
  businessRules,
  demoFlow,
  festivalFunctions,
  preparedArchitecture,
  projectOverview,
  systemValidations,
  techStack,
} from "../../lib/reservadesk-system-info";

type RdSystemModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RdSystemModal({ open, onClose }: RdSystemModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="rd-modal-overlay" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="rd-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rd-system-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="rd-modal-header">
          <div>
            <p className="eyebrow">Portafolio · Caso de estudio</p>
            <h2 id="rd-system-modal-title">{projectOverview.title}</h2>
          </div>
          <button type="button" className="rd-modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>

        <div className="rd-modal-body">
          <section className="rd-modal-section">
            <h3>Proyecto</h3>
            <p>{projectOverview.description}</p>
            <p className="rd-muted">{projectOverview.purpose}</p>
          </section>

          <section className="rd-modal-section">
            <h3>Funciones del festival</h3>
            <div className="rd-modal-fn-grid">
              {festivalFunctions.map((fn) => (
                <article key={fn.number} className="rd-modal-fn-card">
                  <strong>
                    Función {fn.number} · {fn.name}
                  </strong>
                  <span>{fn.date}</span>
                  <span>{fn.time}</span>
                  <small>
                    {fn.venue} · Cupo: {fn.limit} boletos/familia
                  </small>
                </article>
              ))}
            </div>
          </section>

          <section className="rd-modal-section">
            <h3>Reglas de negocio</h3>
            <ul className="rd-modal-list">
              {businessRules.map((rule) => (
                <li key={rule.title} className={rule.important ? "is-important" : ""}>
                  <div className="rd-modal-list-head">
                    <strong>{rule.title}</strong>
                    {rule.important && <span className="rd-badge rd-badge-warning">Importante</span>}
                  </div>
                  <p className="rd-muted">{rule.detail}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rd-modal-section">
            <h3>Validaciones del sistema</h3>
            <ul className="rd-modal-bullets">
              {systemValidations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rd-modal-section">
            <h3>Flujo del demo</h3>
            <ol className="rd-modal-flow">
              {demoFlow.map((item, index) => (
                <li key={item.step}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.step}</strong>
                    <p className="rd-muted">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rd-modal-section">
            <h3>Stack tecnológico</h3>
            <div className="rd-modal-tech-grid">
              {techStack.map((tech) => (
                <article key={tech.name} className="rd-tech-tag">
                  <strong>{tech.name}</strong>
                  <span>{tech.role}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="rd-modal-section">
            <h3>Arquitectura preparada</h3>
            <ul className="rd-modal-bullets">
              {preparedArchitecture.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
