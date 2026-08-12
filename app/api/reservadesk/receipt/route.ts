import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(request: Request) {
  const { student, email, family, functionNo, seats, zone, folio, subtotal, serviceFee, total } = await request.json();
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const write = (text: string, x: number, y: number, size = 12, strong = false, color = rgb(0.08, 0.13, 0.21)) =>
    page.drawText(text, { x, y, size, font: strong ? bold : font, color });

  page.drawRectangle({ x: 0, y: 760, width: 595, height: 82, color: rgb(0.035, 0.11, 0.2) });
  write("RESERVADESK", 48, 800, 25, true, rgb(0.45, 0.72, 1));
  write("RECIBO DE COMPRA · FESTIVAL EDUCATIVO 2026", 48, 778, 10, false, rgb(0.86, 0.92, 1));

  write("Pago acreditado", 48, 720, 18, true);
  write(`Folio: ${folio || `RD-${Date.now().toString().slice(-8)}`}`, 48, 692, 11);
  write(`Comprador: ${student}`, 48, 660, 12, true);
  write(email, 48, 640, 11);
  write(`Familia: ${family} · Función ${functionNo}`, 48, 618, 11);
  if (zone) write(`Zona: ${zone}`, 48, 596, 11);

  write("Asientos", 48, 560, 13, true);
  write(seats.map((seat: number) => `#${seat}`).join(", "), 48, 538, 12);

  page.drawLine({ start: { x: 48, y: 510 }, end: { x: 547, y: 510 }, thickness: 1, color: rgb(0.78, 0.83, 0.9) });
  write("Subtotal boletos", 48, 485, 11);
  write(`$${Number(subtotal ?? total).toLocaleString("es-MX")} MXN`, 410, 482, 12, true);
  write("Comisión de servicio", 48, 460, 11);
  write(`$${Number(serviceFee ?? 15).toLocaleString("es-MX")} MXN`, 410, 457, 12, true);
  page.drawLine({ start: { x: 48, y: 440 }, end: { x: 547, y: 440 }, thickness: 1, color: rgb(0.78, 0.83, 0.9) });
  write("TOTAL PAGADO", 48, 415, 12, true);
  write(`$${Number(total).toLocaleString("es-MX")} MXN`, 410, 412, 18, true, rgb(0.04, 0.35, 0.68));
  write("Este recibo valida la compra de boletos en modo Demo.", 48, 370, 10, false, rgb(0.35, 0.42, 0.52));

  const bytes = await pdf.save();
  const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": "attachment; filename=recibo-reservadesk.pdf",
    },
  });
}
