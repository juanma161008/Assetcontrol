import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "..frontend\src\assets\logom5.png";

export function generarPdfMantenimiento(activo, mantenimientos) {
  const doc = new jsPDF();

  /* LOGO */
  doc.addImage(logo, "PNG", 10, 8, 35, 18);

  /* TITULO */
  doc.setFontSize(16);
  doc.text("INFORME DE MANTENIMIENTOS DE ACTIVO", 60, 18);

  /* DESCRIPCIÓN */
  doc.setFontSize(11);
  doc.text(
    "Este informe presenta la información general del activo y su historial de mantenimientos registrados.",
    14,
    35
  );

  /* DATOS DEL ACTIVO */
  doc.setFontSize(13);
  doc.text("INFORMACIÓN DEL ACTIVO", 14, 45);

  const infoActivo = Object.entries(activo).map(([k, v]) => [
    k.replace(/([A-Z])/g, " $1").toUpperCase(),
    v || "-"
  ]);

  doc.autoTable({
    startY: 50,
    head: [["CAMPO", "VALOR"]],
    body: infoActivo,
    theme: "grid",
    styles: { fontSize: 10 }
  });

  /* HISTORIAL */
  let y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.text("HISTORIAL DE MANTENIMIENTOS", 14, y);

  const bodyMantenimientos = mantenimientos.map(m => [
    m.fecha,
    m.descripcion,
    m.responsable,
    m.tipo,
    m.usuario,
    m.observaciones
  ]);

  doc.autoTable({
    startY: y + 5,
    head: [["FECHA", "DESCRIPCIÓN", "RESPONSABLE", "TIPO", "USUARIO", "OBSERVACIONES"]],
    body: bodyMantenimientos,
    theme: "striped",
    styles: { fontSize: 9 }
  });

  doc.save(`Mantenimientos_${activo.activo}.pdf`);
}
