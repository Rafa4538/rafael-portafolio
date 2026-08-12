"use client";

import { useEffect, useRef, useState } from "react";
import type { PendingOrder, Student } from "../../lib/reservadesk-demo";
import {
  DEMO_PASSWORD,
  formatCurrency,
  getFunctionInfo,
  seatTotal,
  SERVICE_FEE,
  seatZone,
} from "../../lib/reservadesk-demo";

type PaymentPhase = "review" | "card" | "processing" | "success";

type RdPaymentGatewayProps = {
  student: Student;
  order: PendingOrder;
  onSuccess: () => void;
  onBack: () => void;
};

const processingMessages = ["Verificando tarjeta…", "Autorizando cargo…", "Generando folio…"];

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function RdPaymentGateway({ student, order, onSuccess, onBack }: RdPaymentGatewayProps) {
  const [phase, setPhase] = useState<PaymentPhase>("review");
  const [method, setMethod] = useState<"card" | "spei">("card");
  const [holder, setHolder] = useState(student.parents.join(" "));
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");
  const [notice, setNotice] = useState("");
  const [processingIndex, setProcessingIndex] = useState(0);
  const functionInfo = getFunctionInfo(student.functionNo);
  const subtotal = seatTotal(order.seats);

  const completedRef = useRef(false);

  useEffect(() => {
    if (phase !== "processing" || completedRef.current) return;
    const timers = [
      window.setTimeout(() => setProcessingIndex(1), 800),
      window.setTimeout(() => setProcessingIndex(2), 1600),
      window.setTimeout(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        setPhase("success");
        onSuccess();
      }, 2500),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase, onSuccess]);

  function validateCard(): boolean {
    const digits = cardNumber.replace(/\s/g, "");
    if (holder.trim().length < 3) {
      setNotice("Ingresa el nombre del titular.");
      return false;
    }
    if (digits.length !== 16) {
      setNotice("El número de tarjeta debe tener 16 dígitos.");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setNotice("Ingresa una fecha de vencimiento válida (MM/AA).");
      return false;
    }
    if (cvv.length < 3) {
      setNotice("Ingresa un CVV válido.");
      return false;
    }
    setNotice("");
    return true;
  }

  function submitPayment() {
    if (method === "spei") {
      setNotice("Transferencia SPEI disponible solo como vista previa en esta demo.");
      return;
    }
    if (!validateCard()) return;
    setPhase("processing");
  }

  if (phase === "processing") {
    return (
      <div className="rd-payment rd-payment-processing">
        <div className="rd-spinner" aria-hidden />
        <h2>Procesando pago seguro</h2>
        <p>{processingMessages[processingIndex]}</p>
        <small>No cierres esta ventana.</small>
      </div>
    );
  }

  return (
    <div className="rd-payment">
      <header className="rd-page-header">
        <div>
          <button type="button" className="rd-btn-ghost rd-btn-sm" onClick={onBack}>
            ← Volver
          </button>
          <p className="eyebrow">Pasarela de pago</p>
          <h1>Finalizar compra</h1>
          <p className="rd-muted">
            Folio {order.folio} · Zona {order.zone}
          </p>
        </div>
      </header>

      <div className="rd-payment-layout">
        <section className="rd-payment-main">
          {phase === "review" && (
            <div className="rd-panel">
              <h2>Resumen de la orden</h2>
              <div className="rd-payment-event">
                <strong>{functionInfo.name}</strong>
                <span>{functionInfo.venue}</span>
                <small>
                  {functionInfo.date} · {functionInfo.time}
                </small>
              </div>
              <ul className="rd-payment-seats">
                {order.seats.map((seat) => (
                  <li key={seat}>
                    <span>
                      Asiento #{seat} · Zona {seatZone(seat).name}
                    </span>
                    <b>{formatCurrency(seatZone(seat).price)}</b>
                  </li>
                ))}
              </ul>
              <button type="button" className="rd-btn-primary" onClick={() => setPhase("card")}>
                Continuar al pago →
              </button>
            </div>
          )}

          {phase === "card" && (
            <div className="rd-panel">
              <div className="rd-payment-methods">
                <button type="button" className={method === "card" ? "is-active" : ""} onClick={() => setMethod("card")}>
                  Tarjeta
                </button>
                <button type="button" className={method === "spei" ? "is-active" : ""} onClick={() => setMethod("spei")}>
                  Transferencia SPEI
                </button>
              </div>

              <div className="rd-card-brands" aria-hidden>
                <span>Visa</span>
                <span>Mastercard</span>
                <span>Amex</span>
              </div>

              {method === "card" ? (
                <form
                  className="rd-payment-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitPayment();
                  }}
                >
                  <label>
                    Titular de la tarjeta
                    <input value={holder} onChange={(event) => setHolder(event.target.value)} />
                  </label>
                  <label>
                    Número de tarjeta
                    <input
                      value={cardNumber}
                      onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                      inputMode="numeric"
                    />
                  </label>
                  <div className="rd-payment-form-row">
                    <label>
                      Vencimiento
                      <input value={expiry} onChange={(event) => setExpiry(formatExpiry(event.target.value))} inputMode="numeric" />
                    </label>
                    <label>
                      CVV
                      <input value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" />
                    </label>
                  </div>
                  {notice && <p className="rd-alert">{notice}</p>}
                  <button type="submit" className="rd-btn-primary">
                    Pagar {formatCurrency(order.total)}
                  </button>
                  <small>Tarjeta demo: 4242 4242 4242 4242 · Contraseña del portal: {DEMO_PASSWORD}</small>
                </form>
              ) : (
                <div className="rd-spei-box">
                  <p>CLABE demo: <code>012180001234567890</code></p>
                  <p className="rd-muted">Referencia: {order.folio}</p>
                  {notice && <p className="rd-alert">{notice}</p>}
                  <button type="button" className="rd-btn-secondary" onClick={submitPayment}>
                    Simular transferencia
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="rd-payment-sidebar">
          <div className="rd-panel">
            <h3>Detalle de pago</h3>
            <div className="rd-payment-line">
              <span>Subtotal ({order.seats.length} boletos)</span>
              <b>{formatCurrency(subtotal)}</b>
            </div>
            <div className="rd-payment-line">
              <span>Comisión de servicio</span>
              <b>{formatCurrency(SERVICE_FEE)}</b>
            </div>
            <div className="rd-payment-line rd-payment-total">
              <span>Total</span>
              <b>{formatCurrency(order.total)}</b>
            </div>
            <div className="rd-payment-secure">
              <span>🔒</span>
              <small>Pago simulado con cifrado TLS · Entorno demo</small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
