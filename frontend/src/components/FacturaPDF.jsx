import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default async function generarFacturaPDF() {
  const factura = document.getElementById("factura-print");

  if (!factura) {
    alert("No se encontró la factura para generar el PDF");
    return;
  }

  // Espera a que el DOM esté totalmente renderizado
  await new Promise((r) => setTimeout(r, 300));

  const canvas = await html2canvas(factura, {
    scale: 2,            // calidad alta
    useCORS: true,       // para el logo
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = 210;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("factura-mantenimiento.pdf");
}
