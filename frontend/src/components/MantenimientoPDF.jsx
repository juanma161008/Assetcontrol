import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logom5.png";

export default function generarMantenimientoPDF({ activo, mantenimientos }) {
  const doc = new jsPDF("p", "mm", "a4");

  /* ===== ENCABEZADO ===== */
  doc.addImage(logo, "PNG", 15, 10, 35, 20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MICROCINCO S.A.S", 55, 16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Medellín - Antioquia", 55, 22);
  doc.text("contacto@microcinco.com", 55, 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("HISTÓRICO DE MANTENIMIENTOS", 105, 42, { align: "center" });

  doc.line(15, 45, 195, 45);

  /* ===== DATOS ACTIVO ===== */
  let y = 55;

  doc.setFontSize(11);
  doc.text("DATOS DEL ACTIVO", 15, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const datos = [
    ["Activo", activo.activo],
    ["Equipo", activo.equipo],
    ["Marca", activo.marca],
    ["Modelo", activo.modelo],
    ["Serial", activo.serial],
    ["RAM", activo.ram],
    ["Disco", activo.hdd],
    ["Sistema Operativo", activo.os],
    ["Área", `${activo.areaPrincipal || ""} ${activo.areaSecundaria || ""}`],
    ["Estado", activo.estado],
  ];

  datos.forEach((d, i) => {
    const x = i % 2 === 0 ? 15 : 110;
    const yy = y + Math.floor(i / 2) * 6;
    doc.text(`${d[0]}:`, x, yy);
    doc.text(String(d[1] || ""), x + 35, yy);
  });

  y += Math.ceil(datos.length / 2) * 6 + 8;

  /* ===== TABLA ===== */
  autoTable(doc, {
    startY: y,
    head: [["Fecha", "Descripción", "Tipo", "Técnico"]],
    body: mantenimientos.map(m => [
      m.fecha,
      m.descripcion,
      m.tipo,
      m.tecnico,
    ]),
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [40, 40, 40],
      textColor: 255,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`Historial_Mantenimiento_${activo.activo}.pdf`);
}
