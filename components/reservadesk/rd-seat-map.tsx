"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PaidOrder, PendingOrder, Student, Zone } from "../../lib/reservadesk-demo";
import {
  formatCountdown,
  formatCurrency,
  getAvailableQuota,
  getFunctionInfo,
  getOccupiedSeats,
  getRemainingMs,
  getSeatColumn,
  getSeatRowLabel,
  getSeatsForZone,
  HOLD_MINUTES,
  isHoldExpired,
  orderTotal,
  seatZone,
  zones,
} from "../../lib/reservadesk-demo";

type RdSeatMapProps = {
  student: Student;
  zone: Zone;
  selectedSeats: number[];
  pendingOrders: PendingOrder[];
  paidOrders: PaidOrder[];
  holdExpiresAt: string | null;
  notice: string;
  onToggleSeat: (seat: number) => void;
  onConfirm: () => void;
  onHoldExpired: () => void;
  onBack: () => void;
};

export function RdSeatMap({
  student,
  zone,
  selectedSeats,
  pendingOrders,
  paidOrders,
  holdExpiresAt,
  notice,
  onToggleSeat,
  onConfirm,
  onHoldExpired,
  onBack,
}: RdSeatMapProps) {
  const [, tick] = useState(0);
  const expiredRef = useRef(false);
  const zoneInfo = zones.find((item) => item.name === zone)!;
  const functionInfo = getFunctionInfo(student.functionNo);
  const occupied = useMemo(
    () => getOccupiedSeats(student.functionNo, pendingOrders, paidOrders),
    [student.functionNo, pendingOrders, paidOrders],
  );
  const seats = getSeatsForZone(zone);
  const availableQuota = getAvailableQuota(student.family, student.functionNo, pendingOrders, paidOrders, selectedSeats);
  const subtotal = selectedSeats.reduce((sum, seat) => sum + seatZone(seat).price, 0);
  const total = orderTotal(selectedSeats);
  const holdUrgent = holdExpiresAt ? getRemainingMs(holdExpiresAt) <= 120000 : false;

  useEffect(() => {
    expiredRef.current = false;
  }, [holdExpiresAt]);

  useEffect(() => {
    if (!holdExpiresAt && selectedSeats.length === 0) return;
    const timer = window.setInterval(() => {
      tick((value) => value + 1);
      if (holdExpiresAt && isHoldExpired(holdExpiresAt) && selectedSeats.length > 0 && !expiredRef.current) {
        expiredRef.current = true;
        onHoldExpired();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [holdExpiresAt, selectedSeats.length, onHoldExpired]);

  const rows = Array.from({ length: 6 }, (_, rowIndex) => seats.slice(rowIndex * 10, rowIndex * 10 + 10));

  return (
    <div className="rd-seat-view rd-page-enter">
      <header className="rd-page-header">
        <div>
          <button type="button" className="rd-btn-ghost rd-btn-sm" onClick={onBack}>
            ← Volver a zonas
          </button>
          <p className="eyebrow">Mapa de asientos</p>
          <h1>
            Zona {zone} · {functionInfo.name}
          </h1>
          <p className="rd-muted">
            {functionInfo.date} · {functionInfo.time} · {formatCurrency(zoneInfo.price)} por asiento
          </p>
        </div>
        {holdExpiresAt && selectedSeats.length > 0 && (
          <div className={`rd-hold ${holdUrgent ? "is-urgent" : ""}`}>
            Apartado temporal · {HOLD_MINUTES} min máx.
            <b>{formatCountdown(holdExpiresAt)}</b>
            <small>Al expirar, los asientos se liberan automáticamente</small>
          </div>
        )}
      </header>

      <div className="rd-stage">ESCENARIO</div>

      <div className="rd-legend">
        <span>
          <i className="available" />
          Disponible
        </span>
        <span>
          <i className="selected" />
          Tu selección
        </span>
        <span>
          <i className="occupied" />
          Ocupado
        </span>
      </div>

      <div className="rd-seat-map-zone rd-reveal">
        <div className="rd-seat-map-columns">
          <span />
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>
        {rows.map((rowSeats, rowIndex) => (
          <div key={rowIndex} className="rd-seat-row">
            <span className="rd-seat-row-label">{String.fromCharCode(65 + rowIndex)}</span>
            {rowSeats.map((seat) => {
              const isSelected = selectedSeats.includes(seat);
              const isLocked = occupied.has(seat);
              const rowLabel = getSeatRowLabel(seat, zone);
              const column = getSeatColumn(seat, zone);
              return (
                <button
                  key={seat}
                  type="button"
                  aria-label={`Asiento ${seat}, fila ${rowLabel}, columna ${column}, zona ${zone}`}
                  title={`#${seat} · Fila ${rowLabel}${column} · ${formatCurrency(zoneInfo.price)}`}
                  onClick={() => onToggleSeat(seat)}
                  disabled={isLocked}
                  className={`rd-seat ${zone.toLowerCase()} ${isSelected ? "is-selected" : ""} ${isLocked ? "is-locked" : ""}`}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="rd-checkout rd-reveal">
        <div>
          <span>
            {selectedSeats.length} asiento{selectedSeats.length === 1 ? "" : "s"} · {availableQuota} disponible
            {availableQuota === 1 ? "" : "s"} en cupo
          </span>
          <strong>{formatCurrency(total)}</strong>
          <small>Incluye comisión de servicio</small>
        </div>
        <button type="button" className="rd-btn-primary" onClick={onConfirm} disabled={selectedSeats.length === 0 || subtotal === 0}>
          Continuar al pago →
        </button>
      </div>

      {notice && <p className="rd-alert">{notice}</p>}
    </div>
  );
}
