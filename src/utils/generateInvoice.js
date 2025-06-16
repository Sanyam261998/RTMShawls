// generateInvoice.js
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit"
import fontUrl from '../public/font/NotoSans-VariableFont_wdth,wght.ttf'

export default async function generateInvoice(order) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit)

  // ✅ Load font via fetch
  const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  let y = height - 50;
  let client = order.order.user

  page.drawText("RTM Shawls - Order Invoice", {
    x: 50,
    y,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 30;
  page.drawText(`Client: ${order.order.user}`, { x: 50, y, size: 12, font });
  y -= 20;
  page.drawText(`Date: ${new Date().toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font,
  });

  y -= 30;
  page.drawText("Product", { x: 50, y, size: 12, font });
  page.drawText("Qty", { x: 250, y, size: 12, font });
  page.drawText("Price", { x: 300, y, size: 12, font });
  page.drawText("Subtotal", { x: 400, y, size: 12, font });

  y -= 20;

  order.order.items.forEach(item => {
    const name = item.Name || item.name;
    const qty = item.quantity;
    const price = item.Price;
    const subtotal = qty * price;

    page.drawText(name, { x: 50, y, size: 11, font });
    page.drawText(`${qty}`, { x: 250, y, size: 11, font });
    page.drawText(`${price}`, { x: 300, y, size: 11, font });
    page.drawText(`${subtotal}`, { x: 400, y, size: 11, font });

    y -= 20;
  });

  y -= 30;
  page.drawText(`Total: ${order.order.total}`, {
    x: 50,
    y,
    size: 14,
    font,
    color: rgb(0.2, 0.6, 0.2),
  });

  const pdfBytes = await pdfDoc.save();

  // ✅ Save to browser
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Invoice_"+client+"_"+Date.now()+".pdf";
  link.click();
}