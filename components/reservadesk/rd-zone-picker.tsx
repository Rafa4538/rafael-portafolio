"use client";

import type { PaidOrder, PendingOrder, Zone } from "../../lib/reservadesk-demo";
import { formatCurrency, getAvailableInZone, zones } from "../../lib/reservadesk-demo";

type RdZonePickerProps = {
  functionNo: number;
  pendingOrders: PendingOrder[];
  paidOrders: PaidOrder[];
  availableQuota: number;
  onSelect: (zone: Zone) => void;
  compact?: boolean;
};

export function RdZonePicker({
  functionNo,
  pendingOrders,
  paidOrders,
  availableQuota,
  onSelect,
  compact = false,
}: RdZonePickerProps) {
  if (availableQuota <= 0) {
    return (
      <div className="rd-empty-state rd-quota-blocked">
        <strong>Sin cupo disponible</strong>
        <p className="rd-muted">
          Tu familia alcanzó el límite de boletos para esta función. Libera una reserva pendiente o espera a que expire
          para reservar de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className={`rd-zone-grid ${compact ? "is-compact" : ""}`}>
      {zones.map((zone) => {
        const available = getAvailableInZone(zone.name, functionNo, pendingOrders, paidOrders);
        return (
          <button
            key={zone.name}
            type="button"
            className={`rd-zone-card rd-reveal ${zone.name.toLowerCase()}`}
            onClick={() => onSelect(zone.name)}
            disabled={available === 0}
          >
            <div className="rd-zone-card-top">
              <span className={`zone-dot ${zone.name.toLowerCase()}`} />
              <span className="rd-badge">Zona {zone.name}</span>
            </div>
            <h3>{zone.name}</h3>
            <p>{zone.description}</p>
            <div className="rd-zone-card-meta">
              <strong>{formatCurrency(zone.price)}</strong>
              <small>{available} asientos disponibles</small>
            </div>
            <span className="rd-zone-card-cta">{available === 0 ? "Zona llena" : "Reservar boletos →"}</span>
          </button>
        );
      })}
    </div>
  );
}
