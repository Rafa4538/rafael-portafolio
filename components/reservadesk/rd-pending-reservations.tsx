"use client";

import { useEffect, useState } from "react";
import type { PendingOrder } from "../../lib/reservadesk-demo";
import { formatCountdown, formatCurrency, HOLD_MINUTES, isOrderExpired } from "../../lib/reservadesk-demo";

type RdPendingReservationsProps = {
  orders: PendingOrder[];
  onPay: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onDismissExpired: (orderId: string) => void;
};

export function RdPendingReservations({ orders, onPay, onCancel, onDismissExpired }: RdPendingReservationsProps) {
  const [, tick] = useState(0);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => tick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="rd-panel rd-reveal">
      <div className="rd-panel-head">
        <p className="eyebrow">Pagos</p>
        <h2>Reservas pendientes de pago</h2>
        <p className="rd-muted">
          Cada reserva tiene {HOLD_MINUTES} minutos para pagar. Después de ese tiempo, los asientos se liberan automáticamente.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rd-empty-state">
          <strong>Sin reservas pendientes</strong>
          <p className="rd-muted">Cuando apartes asientos, aparecerán aquí con su tiempo de expiración.</p>
        </div>
      ) : (
        <div className="rd-table-wrap">
          <table className="rd-data-table">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Zona</th>
                <th>Asientos</th>
                <th>Total</th>
                <th>Expira en</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const expired = isOrderExpired(order);
                return (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.folio}</strong>
                    </td>
                    <td>{order.zone}</td>
                    <td>{order.seats.map((seat) => `#${seat}`).join(", ")}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span className={expired ? "rd-text-danger" : "rd-countdown"}>{formatCountdown(order.expiresAt)}</span>
                    </td>
                    <td>
                      <span className={`rd-badge ${expired ? "rd-badge-danger" : "rd-badge-warning"}`}>
                        {expired ? "Expirado" : "Pendiente de pago"}
                      </span>
                    </td>
                    <td>
                      <div className="rd-table-actions">
                        {!expired && (
                          <>
                            <button type="button" className="rd-btn-secondary rd-btn-sm" onClick={() => onPay(order.id)}>
                              Pagar ahora
                            </button>
                            {confirmId === order.id ? (
                              <div className="rd-inline-confirm">
                                <span>¿Liberar {order.folio}?</span>
                                <button type="button" className="rd-btn-danger rd-btn-sm" onClick={() => { onCancel(order.id); setConfirmId(null); }}>
                                  Confirmar
                                </button>
                                <button type="button" className="rd-btn-ghost rd-btn-sm" onClick={() => setConfirmId(null)}>
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button type="button" className="rd-btn-cancel rd-btn-sm" onClick={() => setConfirmId(order.id)}>
                                Liberar reserva
                              </button>
                            )}
                          </>
                        )}
                        {expired && (
                          <button type="button" className="rd-btn-ghost rd-btn-sm" onClick={() => onDismissExpired(order.id)}>
                            Quitar de la lista
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
