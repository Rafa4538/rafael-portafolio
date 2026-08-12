"use client";

import { useState } from "react";
import type { PendingOrder, PaidOrder, Student } from "../../lib/reservadesk-demo";
import {
  formatCurrency,
  getActivePendingOrders,
  getAvailableQuota,
  getFamilyPendingOrders,
  getFamilyPaidOrders,
  getFunctionInfo,
  HOLD_MINUTES,
  limits,
  students,
} from "../../lib/reservadesk-demo";
import { scrollToZoneSection } from "../../lib/reservadesk-system-info";
import { RdAvailableTickets } from "./rd-available-tickets";
import { RdPendingReservations } from "./rd-pending-reservations";
import { RdSystemModal } from "./rd-system-modal";
import { RdZonePicker } from "./rd-zone-picker";
import type { Zone } from "../../lib/reservadesk-demo";

type RdDashboardProps = {
  student: Student;
  pendingOrders: PendingOrder[];
  paidOrders: PaidOrder[];
  notice?: string;
  onPayOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onDismissExpired: (orderId: string) => void;
  onSelectZone: (zone: Zone) => void;
};

export function RdDashboard({
  student,
  pendingOrders,
  paidOrders,
  notice,
  onPayOrder,
  onCancelOrder,
  onDismissExpired,
  onSelectZone,
}: RdDashboardProps) {
  const [systemModalOpen, setSystemModalOpen] = useState(false);
  const siblings = students.filter((item) => item.family === student.family && item.id !== student.id);
  const familyPending = getFamilyPendingOrders(student.family, pendingOrders);
  const familyActivePending = getActivePendingOrders(familyPending);
  const familyPaid = getFamilyPaidOrders(student.family, paidOrders);
  const available = getAvailableQuota(student.family, student.functionNo, pendingOrders, paidOrders);
  const limit = limits[student.functionNo as 1 | 2 | 3];
  const functionInfo = getFunctionInfo(student.functionNo);
  const pendingTotal = familyActivePending.reduce((sum, order) => sum + order.total, 0);
  const paidSeats = familyPaid.reduce((sum, order) => sum + order.seats.length, 0);

  return (
    <div className="rd-dashboard rd-page-enter">
      <header className="rd-page-header">
        <div>
          <p className="eyebrow">Bienvenido de vuelta</p>
          <h1>{student.name}</h1>
          <p className="rd-muted">
            {functionInfo.name} · {functionInfo.date} · {functionInfo.time}
          </p>
        </div>
        <div className="rd-header-actions">
          <button type="button" className="rd-btn-secondary rd-btn-sm" onClick={() => setSystemModalOpen(true)}>
            Acerca del sistema
          </button>
          <button type="button" className="rd-btn-primary rd-btn-sm" onClick={scrollToZoneSection} disabled={available <= 0}>
            Reservar →
          </button>
        </div>
      </header>

      <div className="rd-expire-banner rd-reveal">
        <span className="rd-badge rd-badge-warning">Importante</span>
        <p>
          Las reservas pendientes expiran en <strong>{HOLD_MINUTES} minutos</strong>. Después de ese tiempo, los asientos
          se liberan automáticamente. También puedes liberar una reserva manualmente desde la tabla de pendientes.
        </p>
      </div>

      {notice && <p className="rd-alert rd-reveal">{notice}</p>}

      <div className="rd-kpi-grid">
        <article className="rd-kpi-card rd-reveal">
          <span>Boletos disponibles</span>
          <strong>{available}</strong>
          <small>de {limit} por familia</small>
        </article>
        <article className="rd-kpi-card rd-kpi-warning rd-reveal">
          <span>Pendientes de pago</span>
          <strong>{familyActivePending.length}</strong>
          <small>{familyActivePending.reduce((sum, order) => sum + order.seats.length, 0)} asientos apartados</small>
        </article>
        <article className="rd-kpi-card rd-kpi-success rd-reveal">
          <span>Boletos pagados</span>
          <strong>{paidSeats}</strong>
          <small>
            {familyPaid.length} orden{familyPaid.length === 1 ? "" : "es"} confirmada{familyPaid.length === 1 ? "" : "s"}
          </small>
        </article>
        <article className="rd-kpi-card rd-reveal">
          <span>Saldo pendiente</span>
          <strong>{formatCurrency(pendingTotal)}</strong>
          <small>Total por liquidar</small>
        </article>
      </div>

      <section className="rd-panel rd-reveal">
        <div className="rd-panel-head">
          <p className="eyebrow">Perfil</p>
          <h2>Mi perfil y familia</h2>
        </div>
        <div className="rd-profile-grid">
          <div className="rd-profile-card">
            <span>Alumno</span>
            <strong>{student.name}</strong>
            <small>
              Nivel {student.level} · Función {student.functionNo}
            </small>
          </div>
          <div className="rd-profile-card">
            <span>Familia</span>
            <strong>{student.family}</strong>
            <small>Tutores: {student.parents.join(" y ")}</small>
          </div>
          <div className="rd-profile-card">
            <span>Hermanos registrados</span>
            <strong>{siblings.length}</strong>
            <small>
              {siblings.length
                ? siblings.map((item) => `${item.name} (N${item.level})`).join(", ")
                : "Sin hermanos registrados"}
            </small>
          </div>
          <div className="rd-profile-card">
            <span>Evento</span>
            <strong>{functionInfo.venue}</strong>
            <small>
              {functionInfo.name} · {functionInfo.time}
            </small>
          </div>
        </div>
      </section>

      <RdAvailableTickets student={student} pendingOrders={pendingOrders} paidOrders={paidOrders} />

      <RdPendingReservations
        orders={familyPending}
        onPay={onPayOrder}
        onCancel={onCancelOrder}
        onDismissExpired={onDismissExpired}
      />

      <section id="rd-zone-section" className="rd-panel rd-reveal rd-zone-section">
        <div className="rd-panel-head">
          <p className="eyebrow">Nueva reserva</p>
          <h2>Seleccionar zona de boletos</h2>
          <p className="rd-muted">Elige la zona para continuar al mapa de asientos.</p>
        </div>
        <RdZonePicker
          functionNo={student.functionNo}
          pendingOrders={pendingOrders}
          paidOrders={paidOrders}
          availableQuota={available}
          onSelect={onSelectZone}
        />
      </section>

      <RdSystemModal open={systemModalOpen} onClose={() => setSystemModalOpen(false)} />
    </div>
  );
}
