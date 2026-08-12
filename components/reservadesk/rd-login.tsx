"use client";

import { useState } from "react";
import { DEMO_PASSWORD } from "../../lib/reservadesk-demo";

type RdLoginProps = {
  email: string;
  notice: string;
  onEmailChange: (value: string) => void;
  onSubmit: (password: string) => void;
};

export function RdLogin({ email, notice, onEmailChange, onSubmit }: RdLoginProps) {
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="rd-login">
      <div className="rd-login-hero">
        <div className="rd-brand">
          <span>RESERVA</span>
          <strong>DESK</strong>
          <small>Festival Educativo 2026</small>
        </div>
        <p className="eyebrow">Plataforma institucional</p>
        <h1>Gestión de boletos para eventos escolares de alto nivel.</h1>
        <p className="rd-login-copy">
          ReservaDesk centraliza cupos familiares, apartados temporales y pagos seguros para funciones del festival.
        </p>
        <div className="rd-login-stats">
          <div>
            <strong>65</strong>
            <span>Alumnos activos</span>
          </div>
          <div>
            <strong>20</strong>
            <span>Familias registradas</span>
          </div>
          <div>
            <strong>180</strong>
            <span>Asientos por función</span>
          </div>
        </div>
        <div className="rd-auditorium-art" aria-hidden>
          <div className="rd-auditorium-stage">ESCENARIO</div>
          <div className="rd-auditorium-rows">
            {Array.from({ length: 6 }).map((_, row) => (
              <div key={row} className="rd-auditorium-row">
                {Array.from({ length: 10 }).map((__, col) => (
                  <span key={col} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form
        className="rd-login-card"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(password);
        }}
      >
        <span className="rd-badge rd-badge-demo">Entorno Demo</span>
        <p className="eyebrow">Acceso de alumno</p>
        <h2>Tu lugar comienza aquí.</h2>
        <p>Ingresa con una cuenta demo para reservar boletos de tu función.</p>

        <label>
          Correo institucional
          <input
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            type="email"
            placeholder="fam001-1@reservadesk.demo"
            autoComplete="username"
          />
        </label>

        <label>
          Contraseña
          <div className="rd-input-wrap">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
            />
            <button type="button" className="rd-input-toggle" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </label>

        {notice && <p className="rd-alert">{notice}</p>}

        <button type="submit" className="rd-btn-primary">
          Iniciar sesión <span aria-hidden>→</span>
        </button>

        <small>
          Ejemplo: <code>fam001-1@reservadesk.demo</code> · Contraseña: <code>{DEMO_PASSWORD}</code>
        </small>
      </form>
    </section>
  );
}
