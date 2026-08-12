import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
export async function POST(request: Request) {
 const { student, email, family, functionNo, seats, total } = await request.json();
 const pdf = await PDFDocument.create(); const page = pdf.addPage([595,842]); const font = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
 const write = (text:string, x:number, y:number, size=12, strong=false, color=rgb(.08,.13,.21)) => page.drawText(text,{x,y,size,font:strong?bold:font,color});
 page.drawRectangle({x:0,y:760,width:595,height:82,color:rgb(.035,.11,.2)}); write("RESERVADESK",48,800,25,true,rgb(.45,.72,1)); write("RECIBO DE COMPRA · FESTIVAL EDUCATIVO 2026",48,778,10,false,rgb(.86,.92,1));
 write("Pago demo acreditado",48,720,18,true); write(`Folio: RD-${Date.now().toString().slice(-8)}`,48,692,11); write(`Comprador: ${student}`,48,660,12,true); write(email,48,640,11); write(`Familia: ${family} · Función ${functionNo}`,48,618,11);
 write("Asientos",48,572,13,true); write(seats.map((seat:number) => `#${seat}`).join(", "),48,550,12); page.drawLine({start:{x:48,y:520},end:{x:547,y:520},thickness:1,color:rgb(.78,.83,.9)}); write("TOTAL PAGADO",48,485,12,true); write(`$${Number(total).toLocaleString("es-MX")} MXN`,410,482,18,true,rgb(.04,.35,.68)); write("Este recibo valida la compra de boletos en modo Demo.",48,430,10,false,rgb(.35,.42,.52));
 const bytes=await pdf.save(); const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer; return new Response(body,{headers:{"content-type":"application/pdf","content-disposition":"attachment; filename=recibo-reservadesk.pdf"}});
}
