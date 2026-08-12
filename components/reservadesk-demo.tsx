"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DemoStep, PaidOrder, PendingOrder, Student, Zone } from "../lib/reservadesk-demo";
import {
  createHoldExpiry,
  createPendingOrder,
  DEMO_PASSWORD,
  getActivePendingOrders,
  getAvailableQuota,
  getFamilyPendingOrders,
  getOccupiedSeats,
  isHoldExpired,
  isOrderExpired,
  seedPendingOrders,
  students,
} from "../lib/reservadesk-demo";
import { RdAppShell } from "./reservadesk/rd-app-shell";
import { RdConfirmation } from "./reservadesk/rd-confirmation";
import { RdDashboard } from "./reservadesk/rd-dashboard";
import { RdLogin } from "./reservadesk/rd-login";
import { RdPaymentGateway } from "./reservadesk/rd-payment-gateway";
import { RdSeatMap } from "./reservadesk/rd-seat-map";
import { RdZonePicker } from "./reservadesk/rd-zone-picker";
import { scrollToZoneSection } from "../lib/reservadesk-system-info";

export function ReservaDeskDemo() {
  const [email, setEmail] = useState("fam001-1@reservadesk.demo");
  const [student, setStudent] = useState<Student | null>(null);
  const [step, setStep] = useState<DemoStep>("login");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>(() => seedPendingOrders());
  const [paidOrders, setPaidOrders] = useState<PaidOrder[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [completedOrder, setCompletedOrder] = useState<PendingOrder | null>(null);

  const activeOrder = useMemo(() => {
    if (!activeOrderId) return null;
    const order = pendingOrders.find((item) => item.id === activeOrderId);
    if (!order || isOrderExpired(order)) return null;
    return order;
  }, [activeOrderId, pendingOrders]);

  const familyActivePending = useMemo(() => {
    if (!student) return [];
    return getActivePendingOrders(getFamilyPendingOrders(student.family, pendingOrders));
  }, [student, pendingOrders]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPendingOrders((current) => {
        const expired = current.filter(isOrderExpired);
        if (expired.length === 0) return current;

        const expiredIds = new Set(expired.map((order) => order.id));
        if (activeOrderId && expiredIds.has(activeOrderId)) {
          setActiveOrderId(null);
          setStep("dashboard");
          setNotice(`La reserva ${expired.find((order) => order.id === activeOrderId)?.folio} expiró. Los asientos fueron liberados automáticamente.`);
        } else if (expired.length === 1) {
          setNotice(`La reserva ${expired[0].folio} expiró. Los asientos fueron liberados automáticamente.`);
        } else if (expired.length > 1) {
          setNotice(`${expired.length} reservas expiraron. Los asientos fueron liberados automáticamente.`);
        }

        return current.filter((order) => !expiredIds.has(order.id));
      });

      if (holdExpiresAt && isHoldExpired(holdExpiresAt) && selectedSeats.length > 0) {
        setSelectedSeats([]);
        setHoldExpiresAt(null);
        setNotice("Tu apartado temporal expiró. Los asientos seleccionados fueron liberados.");
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeOrderId, holdExpiresAt, selectedSeats.length]);

  function resetSession() {
    setStudent(null);
    setStep("login");
    setSelectedZone(null);
    setSelectedSeats([]);
    setPendingOrders(seedPendingOrders());
    setPaidOrders([]);
    setActiveOrderId(null);
    setHoldExpiresAt(null);
    setNotice("");
    setCompletedOrder(null);
  }

  function login(password: string) {
    const match = students.find((item) => item.email === email.toLowerCase());
    if (!match) {
      setNotice("Cuenta no encontrada. Usa una de las cuentas demo indicadas.");
      return;
    }
    if (password !== DEMO_PASSWORD) {
      setNotice("Contraseña incorrecta. Usa Festival2026! para la demo.");
      return;
    }
    setStudent(match);
    setStep("dashboard");
    setNotice("");
  }

  function selectZone(zone: Zone) {
    if (!student) return;
    const quota = getAvailableQuota(student.family, student.functionNo, pendingOrders, paidOrders);
    if (quota <= 0) {
      setNotice("Tu familia alcanzó el límite de boletos para esta función. Libera una reserva pendiente para continuar.");
      return;
    }
    setSelectedZone(zone);
    setSelectedSeats([]);
    setHoldExpiresAt(null);
    setNotice("");
    setStep("seats");
  }

  function toggleSeat(seat: number) {
    if (!student || !selectedZone) return;
    const occupied = getOccupiedSeats(student.functionNo, pendingOrders, paidOrders);
    if (occupied.has(seat)) return;

    if (selectedSeats.includes(seat)) {
      const next = selectedSeats.filter((item) => item !== seat);
      setSelectedSeats(next);
      if (next.length === 0) setHoldExpiresAt(null);
      setNotice("");
      return;
    }

    const quota = getAvailableQuota(student.family, student.functionNo, pendingOrders, paidOrders, selectedSeats);
    if (quota <= 0) {
      setNotice("Tu familia alcanzó el límite de boletos para esta función.");
      return;
    }

    if (!holdExpiresAt) setHoldExpiresAt(createHoldExpiry());
    setSelectedSeats([...selectedSeats, seat]);
    setNotice("");
  }

  function confirmSeats() {
    if (!student || !selectedZone || selectedSeats.length === 0) {
      setNotice("Selecciona al menos un asiento.");
      return;
    }
    const order = createPendingOrder({
      family: student.family,
      functionNo: student.functionNo,
      seats: selectedSeats,
      zone: selectedZone,
    });
    setPendingOrders((current) => [...current, order]);
    setActiveOrderId(order.id);
    setSelectedSeats([]);
    setSelectedZone(null);
    setHoldExpiresAt(null);
    setNotice("");
    setStep("payment");
  }

  function payExistingOrder(orderId: string) {
    const order = pendingOrders.find((item) => item.id === orderId);
    if (!order || isOrderExpired(order)) {
      setNotice("Esta reserva ya expiró. Los asientos fueron liberados.");
      return;
    }
    setActiveOrderId(orderId);
    setStep("payment");
  }

  function cancelPendingOrder(orderId: string) {
    const order = pendingOrders.find((item) => item.id === orderId);
    if (!order) return;
    setPendingOrders((current) => current.filter((item) => item.id !== orderId));
    if (activeOrderId === orderId) {
      setActiveOrderId(null);
      if (step === "payment") setStep("dashboard");
    }
    setNotice(`Reserva ${order.folio} liberada. Los asientos vuelven a estar disponibles.`);
  }

  function dismissExpiredOrder(orderId: string) {
    setPendingOrders((current) => current.filter((item) => item.id !== orderId));
  }

  const completePayment = useCallback(() => {
    if (!activeOrderId) return;
    const order = pendingOrders.find((item) => item.id === activeOrderId);
    if (!order) return;
    setCompletedOrder(order);
    setPaidOrders((paid) => [
      ...paid,
      {
        id: order.id,
        folio: order.folio,
        family: order.family,
        functionNo: order.functionNo,
        seats: order.seats,
        zone: order.zone,
        total: order.total,
        paidAt: new Date().toISOString(),
      },
    ]);
    setPendingOrders((current) => current.filter((item) => item.id !== activeOrderId));
    setActiveOrderId(null);
    setStep("confirmation");
  }, [activeOrderId, pendingOrders]);

  async function downloadReceipt(order: PendingOrder) {
    if (!student) return;
    const response = await fetch("/api/reservadesk/receipt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        student: student.name,
        email: student.email,
        family: student.family,
        functionNo: student.functionNo,
        seats: order.seats,
        zone: order.zone,
        folio: order.folio,
        subtotal: order.total - 15,
        serviceFee: 15,
        total: order.total,
      }),
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recibo-reservadesk.pdf";
    link.click();
    URL.revokeObjectURL(url);
  }

  function scrollToZonesFromNav() {
    if (step !== "dashboard") {
      setSelectedZone(null);
      setSelectedSeats([]);
      setHoldExpiresAt(null);
      setStep("dashboard");
      window.setTimeout(scrollToZoneSection, 120);
      return;
    }
    scrollToZoneSection();
  }

  function navigate(stepTarget: DemoStep) {
    if (stepTarget === "zones") {
      scrollToZonesFromNav();
      return;
    }
    if (stepTarget === "dashboard") {
      setSelectedZone(null);
      setSelectedSeats([]);
      setHoldExpiresAt(null);
      setActiveOrderId(null);
    }
    if (stepTarget === "seats" && !selectedZone) {
      setStep("zones");
      return;
    }
    if (stepTarget === "payment") {
      if (!activeOrderId) {
        if (familyActivePending.length === 0) return;
        setActiveOrderId(familyActivePending[0].id);
      }
    }
    setStep(stepTarget);
  }

  if (!student || step === "login") {
    return <RdLogin email={email} notice={notice} onEmailChange={setEmail} onSubmit={login} />;
  }

  const content = (() => {
    if (step === "dashboard") {
      return (
        <RdDashboard
          student={student}
          pendingOrders={pendingOrders}
          paidOrders={paidOrders}
          notice={notice}
          onPayOrder={payExistingOrder}
          onCancelOrder={cancelPendingOrder}
          onDismissExpired={dismissExpiredOrder}
          onSelectZone={selectZone}
        />
      );
    }

    if (step === "zones") {
      const quota = getAvailableQuota(student.family, student.functionNo, pendingOrders, paidOrders);
      return (
        <div className="rd-dashboard rd-page-enter">
          <header className="rd-page-header">
            <div>
              <p className="eyebrow">Reservar</p>
              <h1>Selecciona una zona</h1>
              <p className="rd-muted">Elige la zona para ver el mapa de asientos de tu función.</p>
            </div>
          </header>
          {notice && <p className="rd-alert">{notice}</p>}
          <RdZonePicker
            functionNo={student.functionNo}
            pendingOrders={pendingOrders}
            paidOrders={paidOrders}
            availableQuota={quota}
            onSelect={selectZone}
          />
        </div>
      );
    }

    if (step === "seats" && selectedZone) {
      return (
        <RdSeatMap
          student={student}
          zone={selectedZone}
          selectedSeats={selectedSeats}
          pendingOrders={pendingOrders}
          paidOrders={paidOrders}
          holdExpiresAt={holdExpiresAt}
          notice={notice}
          onToggleSeat={toggleSeat}
          onConfirm={confirmSeats}
          onHoldExpired={() => {
            setSelectedSeats([]);
            setHoldExpiresAt(null);
            setNotice("Tu apartado temporal expiró. Los asientos seleccionados fueron liberados.");
          }}
          onBack={() => {
            setSelectedZone(null);
            setSelectedSeats([]);
            setHoldExpiresAt(null);
            setStep("zones");
          }}
        />
      );
    }

    if (step === "payment" && activeOrder) {
      return (
        <RdPaymentGateway
          student={student}
          order={activeOrder}
          onSuccess={completePayment}
          onBack={() => {
            setActiveOrderId(null);
            setStep("dashboard");
          }}
        />
      );
    }

    if (step === "confirmation" && completedOrder) {
      return (
        <RdConfirmation
          student={student}
          order={completedOrder}
          onDownloadReceipt={() => downloadReceipt(completedOrder)}
          onBackToDashboard={() => {
            setCompletedOrder(null);
            setStep("dashboard");
          }}
        />
      );
    }

    return (
      <RdDashboard
        student={student}
        pendingOrders={pendingOrders}
        paidOrders={paidOrders}
        notice={notice}
        onPayOrder={payExistingOrder}
        onCancelOrder={cancelPendingOrder}
        onDismissExpired={dismissExpiredOrder}
        onSelectZone={selectZone}
      />
    );
  })();

  return (
    <RdAppShell
      student={student}
      step={step}
      hasSelectedZone={!!selectedZone}
      hasPendingPayment={familyActivePending.length > 0 || !!activeOrderId}
      onNavigate={navigate}
      onScrollToZones={scrollToZonesFromNav}
      onLogout={resetSession}
    >
      {content}
    </RdAppShell>
  );
}
