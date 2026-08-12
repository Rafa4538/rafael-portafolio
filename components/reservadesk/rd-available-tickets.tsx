"use client";

import type { PaidOrder, PendingOrder, Student } from "../../lib/reservadesk-demo";
import { getAvailableQuota, limits } from "../../lib/reservadesk-demo";

type RdAvailableTicketsProps = {
  student: Student;
  pendingOrders: PendingOrder[];
  paidOrders: PaidOrder[];
};

export function RdAvailableTickets({ student, pendingOrders, paidOrders }: RdAvailableTicketsProps) {
  const limit = limits[student.functionNo as 1 | 2 | 3];
  const available = getAvailableQuota(student.family, student.functionNo, pendingOrders, paidOrders);
  const used = limit - available;
  const percent = limit > 0 ? (used / limit) * 100 : 0;

  return (
    <section className="rd-panel rd-reveal">
      <div className="rd-panel-head">
        <p className="eyebrow">Cupo familiar</p>
        <h2>Boletos disponibles</h2>
      </div>
      <div className="rd-quota-card">
        <div className="rd-quota-top">
          <div>
            <strong>{available}</strong>
            <span>boletos restantes</span>
          </div>
          <div className="rd-quota-meta">
            <span>Función {student.functionNo}</span>
            <small>
              {used} de {limit} utilizados
            </small>
          </div>
        </div>
        <div className="rd-quota-bar">
          <b style={{ width: `${percent}%` }} />
        </div>
        <p className="rd-muted">
          El límite aplica por familia e incluye reservas pendientes de pago y boletos ya confirmados.
        </p>
      </div>
    </section>
  );
}
