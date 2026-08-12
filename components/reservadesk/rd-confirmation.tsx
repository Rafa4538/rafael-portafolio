"use client";

import type { PendingOrder, Student } from "../../lib/reservadesk-demo";
import { formatCurrency, getFunctionInfo } from "../../lib/reservadesk-demo";

type RdConfirmationProps = {
  student: Student;
  order: PendingOrder;
  onDownloadReceipt: () => void;
  onBackToDashboard: () => void;
};

export function RdConfirmation({ student, order, onDownloadReceipt, onBackToDashboard }: RdConfirmationProps) {
  const functionInfo = getFunctionInfo(student.functionNo);

  return (
    <div className="rd-confirmation">
      <div className="rd-confirmation-icon" aria-hidden>
        ✓
      </div>
      <p className="eyebrow">Pago confirmado</p>
      <h1>Tu compra fue acreditada</h1>
      <p className="rd-muted">
        Folio <strong>{order.folio}</strong> · {functionInfo.name}
      </p>

      <div className="rd-confirmation-card">
        <div>
          <span>Comprador</span>
          <strong>{student.name}</strong>
        </div>
        <div>
          <span>Asientos</span>
          <strong>{order.seats.map((seat) => `#${seat}`).join(", ")}</strong>
        </div>
        <div>
          <span>Zona</span>
          <strong>{order.zone}</strong>
        </div>
        <div>
          <span>Total pagado</span>
          <strong>{formatCurrency(order.total)}</strong>
        </div>
      </div>

      <div className="rd-confirmation-actions">
        <button type="button" className="rd-btn-primary" onClick={onDownloadReceipt}>
          Descargar recibo PDF
        </button>
        <button type="button" className="rd-btn-secondary" onClick={onBackToDashboard}>
          Volver al dashboard
        </button>
      </div>
    </div>
  );
}
