export type Zone = "Oro" | "Plata" | "Bronce";

export type Student = {
  id: string;
  family: string;
  name: string;
  email: string;
  level: number;
  functionNo: number;
  parents: string[];
};

export type PendingOrder = {
  id: string;
  folio: string;
  family: string;
  functionNo: number;
  seats: number[];
  zone: Zone;
  total: number;
  heldAt: string;
  expiresAt: string;
};

export type PaidOrder = {
  id: string;
  folio: string;
  family: string;
  functionNo: number;
  seats: number[];
  zone: Zone;
  total: number;
  paidAt: string;
};

export type FunctionInfo = {
  number: 1 | 2 | 3;
  name: string;
  date: string;
  time: string;
  venue: string;
};

export type DemoStep = "login" | "dashboard" | "zones" | "seats" | "payment" | "confirmation";

export const SERVICE_FEE = 15;
export const HOLD_MINUTES = 10;
export const DEMO_PASSWORD = "Festival2026!";

const familySizes = [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2];
const parentNames = [
  "Mariana y Carlos Torres",
  "Daniela y Sergio Ríos",
  "Andrea y Luis Vega",
  "Paola y Jorge Méndez",
  "Laura e Iván Castillo",
  "Elena y Manuel Cruz",
  "Patricia y Héctor Luna",
  "Sofía y Marco Ramos",
  "Karla y Diego Flores",
  "Cecilia y Raúl Ortiz",
];

export const students: Student[] = familySizes.flatMap((size, familyIndex) =>
  Array.from({ length: size }, (_, childIndex) => {
    const number = familyIndex + 1;
    const level = ((number + childIndex - 1) % 4) + 1;
    return {
      id: `student-${number}-${childIndex + 1}`,
      family: `FAM-${String(number).padStart(3, "0")}`,
      name: `Alumno ${String(number).padStart(3, "0")}-${childIndex + 1}`,
      email: `fam${String(number).padStart(3, "0")}-${childIndex + 1}@reservadesk.demo`,
      level,
      functionNo: level <= 2 ? 1 : level === 3 ? 2 : 3,
      parents: (parentNames[familyIndex % parentNames.length] || "Tutora y Tutor").split(" y "),
    };
  }),
);

export const zones: { name: Zone; price: number; range: [number, number]; description: string }[] = [
  { name: "Oro", price: 180, range: [1, 60], description: "Primera fila · Vista premium al escenario" },
  { name: "Plata", price: 140, range: [61, 120], description: "Zona central · Excelente visibilidad" },
  { name: "Bronce", price: 100, range: [121, 180], description: "Zona general · Acceso amplio" },
];

export const limits = { 1: 8, 2: 6, 3: 4 } as const;

export const functionCatalog: FunctionInfo[] = [
  { number: 1, name: "Descubre", date: "24 de octubre de 2026", time: "10:00 h", venue: "Auditorio Nacional Educativo" },
  { number: 2, name: "Imagina", date: "24 de octubre de 2026", time: "13:30 h", venue: "Auditorio Nacional Educativo" },
  { number: 3, name: "Crea", date: "24 de octubre de 2026", time: "17:00 h", venue: "Auditorio Nacional Educativo" },
];

const globalOccupied = new Set([3, 4, 7, 8, 21, 22, 34, 35, 63, 64, 80, 81, 121, 122, 145, 146]);

export const seatZone = (number: number) => zones.find((zone) => number >= zone.range[0] && number <= zone.range[1])!;

export function getFunctionInfo(functionNo: number): FunctionInfo {
  return functionCatalog.find((item) => item.number === functionNo) ?? functionCatalog[0];
}

export function getSeatsForZone(zone: Zone): number[] {
  const match = zones.find((item) => item.name === zone)!;
  return Array.from({ length: match.range[1] - match.range[0] + 1 }, (_, index) => match.range[0] + index);
}

export function isOrderExpired(order: PendingOrder): boolean {
  return new Date(order.expiresAt).getTime() <= Date.now();
}

export function isHoldExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= Date.now();
}

export function getActivePendingOrders(orders: PendingOrder[]): PendingOrder[] {
  return orders.filter((order) => !isOrderExpired(order));
}

export function getRemainingMs(expiresAt: string): number {
  return Math.max(0, new Date(expiresAt).getTime() - Date.now());
}

export function getOccupiedSeats(functionNo: number, pendingOrders: PendingOrder[], paidOrders: PaidOrder[]): Set<number> {
  const occupied = new Set(globalOccupied);
  for (const order of getActivePendingOrders(pendingOrders)) {
    if (order.functionNo === functionNo) order.seats.forEach((seat) => occupied.add(seat));
  }
  for (const order of paidOrders) {
    if (order.functionNo === functionNo) order.seats.forEach((seat) => occupied.add(seat));
  }
  return occupied;
}

export function getAvailableInZone(zone: Zone, functionNo: number, pendingOrders: PendingOrder[], paidOrders: PaidOrder[]): number {
  const occupied = getOccupiedSeats(functionNo, pendingOrders, paidOrders);
  return getSeatsForZone(zone).filter((seat) => !occupied.has(seat)).length;
}

export function getFamilyPendingOrders(family: string, pendingOrders: PendingOrder[]): PendingOrder[] {
  return pendingOrders.filter((order) => order.family === family);
}

export function getFamilyPaidOrders(family: string, paidOrders: PaidOrder[]): PaidOrder[] {
  return paidOrders.filter((order) => order.family === family);
}

export function countReservedSeats(
  family: string,
  functionNo: number,
  pendingOrders: PendingOrder[],
  paidOrders: PaidOrder[],
  draftSeats: number[] = [],
): number {
  const pending = getFamilyPendingOrders(family, pendingOrders)
    .filter((order) => order.functionNo === functionNo && !isOrderExpired(order))
    .reduce((sum, order) => sum + order.seats.length, 0);
  const paid = getFamilyPaidOrders(family, paidOrders)
    .filter((order) => order.functionNo === functionNo)
    .reduce((sum, order) => sum + order.seats.length, 0);
  return pending + paid + draftSeats.length;
}

export function getAvailableQuota(
  family: string,
  functionNo: number,
  pendingOrders: PendingOrder[],
  paidOrders: PaidOrder[],
  draftSeats: number[] = [],
): number {
  const limit = limits[functionNo as 1 | 2 | 3];
  return Math.max(0, limit - countReservedSeats(family, functionNo, pendingOrders, paidOrders, draftSeats));
}

export function seatTotal(seats: number[]): number {
  return seats.reduce((sum, seat) => sum + seatZone(seat).price, 0);
}

export function orderTotal(seats: number[]): number {
  return seatTotal(seats) + SERVICE_FEE;
}

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString("es-MX")} MXN`;
}

export function formatCountdown(expiresAt: string): string {
  const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function createHoldExpiry(minutes = HOLD_MINUTES): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

export function createFolio(): string {
  return `RD-${Date.now().toString().slice(-8)}`;
}

export function createPendingOrder(input: {
  family: string;
  functionNo: number;
  seats: number[];
  zone: Zone;
}): PendingOrder {
  const total = orderTotal(input.seats);
  const heldAt = new Date().toISOString();
  return {
    id: `order-${Date.now()}`,
    folio: createFolio(),
    family: input.family,
    functionNo: input.functionNo,
    seats: input.seats,
    zone: input.zone,
    total,
    heldAt,
    expiresAt: createHoldExpiry(),
  };
}

export function seedPendingOrders(): PendingOrder[] {
  const heldAt = new Date(Date.now() - 3 * 60 * 1000).toISOString();
  const expiresAt = createHoldExpiry(HOLD_MINUTES - 3);
  return [
    {
      id: "seed-fam001-oro",
      folio: "RD-48291037",
      family: "FAM-001",
      functionNo: 1,
      seats: [12, 13],
      zone: "Oro",
      total: orderTotal([12, 13]),
      heldAt,
      expiresAt,
    },
    {
      id: "seed-fam002-plata",
      folio: "RD-48291038",
      family: "FAM-002",
      functionNo: 1,
      seats: [72, 73],
      zone: "Plata",
      total: orderTotal([72, 73]),
      heldAt,
      expiresAt,
    },
  ];
}

export function getSeatRowLabel(seat: number, zone: Zone): string {
  const seats = getSeatsForZone(zone);
  const index = seats.indexOf(seat);
  const row = Math.floor(index / 10);
  return String.fromCharCode(65 + row);
}

export function getSeatColumn(seat: number, zone: Zone): number {
  const seats = getSeatsForZone(zone);
  const index = seats.indexOf(seat);
  return (index % 10) + 1;
}
