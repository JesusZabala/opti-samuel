/**
 * Reportes corporativos generados en el frontend con pdfmake.
 * Header verde, footer con datos de la empresa, marca de agua con logo y tabla de datos.
 *
 * Las funciones siguen la misma firma anterior para no romper Reportes.tsx.
 */
import pdfMakeModule from "pdfmake/build/pdfmake";
// @ts-ignore
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import logoUrl from "@/assets/Logo.png";
import { obtenerClientes } from "./clienteService";
import { obtenerCitas } from "./citaService";
import { obtenerTodasLasRecetas } from "./recetaService";
import { obtenerPedido } from "./pedidoService";

const pdfMake: any = pdfMakeModule;
const vfsSources = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs || pdfFonts;
pdfMake.vfs = vfsSources;

/* ───────────────────── Helpers ───────────────────── */

let LOGO_BASE64: string | null = null;

const obtenerLogoBase64 = async (): Promise<string> => {
  if (LOGO_BASE64) return LOGO_BASE64;
  const res = await fetch(logoUrl);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      LOGO_BASE64 = reader.result as string;
      resolve(LOGO_BASE64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const formatearFecha = (iso?: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-VE", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const dentroDelRango = (fecha: string | null | undefined, desde: string, hasta: string): boolean => {
  if (!fecha) return false;
  const f = new Date(fecha).getTime();
  const d = new Date(desde + "T00:00:00").getTime();
  const h = new Date(hasta + "T23:59:59").getTime();
  return f >= d && f <= h;
};

const descargarBlobPDF = (docDefinition: TDocumentDefinitions, nombre: string) => {
  pdfMake.createPdf(docDefinition).download(nombre);
};

/* ─────────────── Plantilla corporativa ─────────────── */

interface PlantillaOpciones {
  titulo: string;
  desde: string;
  hasta: string;
  cuerpo: Content;
  logoBase64: string;
  totalRegistros: number;
}

const construirDocumento = ({ titulo, desde, hasta, cuerpo, logoBase64, totalRegistros }: PlantillaOpciones): TDocumentDefinitions => {
  const fechaHoy = new Date().toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });

  return {
    pageSize: "LETTER",
    pageMargins: [40, 110, 40, 90],

    // Header verde corporativo con logo
    header: () => ({
      margin: [0, 0, 0, 0],
      table: {
        widths: ["*"],
        body: [
          [
            {
              fillColor: "#1a4731",
              margin: [40, 18, 40, 18],
              columns: [
                { image: logoBase64, width: 55, margin: [0, 0, 10, 0] },
                {
                  stack: [
                    { text: "OPTI-SAMUEL", color: "#ffffff", fontSize: 18, bold: true, characterSpacing: 2 },
                    { text: "Sistema de Gestión Óptica", color: "#a3d4b0", fontSize: 9, bold: true, characterSpacing: 1.5, margin: [0, 2, 0, 0] },
                  ],
                  alignment: "left",
                  margin: [10, 6, 0, 0],
                },
                {
                  stack: [
                    { text: titulo.toUpperCase(), color: "#ffffff", fontSize: 12, bold: true, alignment: "right" },
                    { text: `Emitido: ${fechaHoy}`, color: "#a3d4b0", fontSize: 8, alignment: "right", margin: [0, 4, 0, 0] },
                  ],
                  margin: [0, 8, 0, 0],
                },
              ],
            },
          ],
        ],
      },
      layout: "noBorders",
    }),

    // Footer verde corporativo
    footer: (currentPage, pageCount) => ({
      margin: [0, 0, 0, 0],
      table: {
        widths: ["*"],
        body: [
          [
            {
              fillColor: "#1a4731",
              margin: [40, 14, 40, 14],
              columns: [
                {
                  stack: [
                    { text: "Opti-Samuel C.A.", color: "#ffffff", fontSize: 9, bold: true },
                    { text: "Rif: J-12345678-9", color: "#a3d4b0", fontSize: 8 },
                  ],
                  width: "*",
                },
                {
                  stack: [
                    { text: '"Tu visión es nuestra prioridad"', color: "#a3d4b0", italics: true, fontSize: 8, alignment: "center" },
                    { text: `Página ${currentPage} de ${pageCount}`, color: "#ffffff", fontSize: 7, alignment: "center", margin: [0, 3, 0, 0] },
                  ],
                  width: "*",
                },
                {
                  stack: [
                    { text: "Contacto", color: "#a3d4b0", fontSize: 8, bold: true, alignment: "right" },
                    { text: "0412-1234567", color: "#ffffff", fontSize: 8, alignment: "right" },
                    { text: "optisamuel6@gmail.com", color: "#ffffff", fontSize: 8, alignment: "right" },
                  ],
                  width: "*",
                },
              ],
            },
          ],
        ],
      },
      layout: "noBorders",
    }),

    // Marca de agua (logo central y muy tenue)
    background: () => ({
      image: logoBase64,
      width: 400,
      opacity: 0.06,
      absolutePosition: { x: 100, y: 250 },
    }),

    content: [
      {
        columns: [
          {
            stack: [
              { text: titulo, fontSize: 18, bold: true, color: "#1a4731", characterSpacing: 1 },
              { text: `Período: ${formatearFecha(desde)} al ${formatearFecha(hasta)}`, fontSize: 9, color: "#6b7280", margin: [0, 4, 0, 0] },
            ],
            width: "*",
          },
          {
            stack: [
              {
                table: {
                  widths: [80],
                  body: [
                    [
                      {
                        stack: [
                          { text: String(totalRegistros), fontSize: 18, bold: true, color: "#1a4731", alignment: "center" },
                          { text: "REGISTROS", fontSize: 7, bold: true, color: "#6b7280", alignment: "center", characterSpacing: 1 },
                        ],
                        fillColor: "#f0f7f3",
                      },
                    ],
                  ],
                },
                layout: {
                  hLineColor: () => "#d0e0d6",
                  vLineColor: () => "#d0e0d6",
                  hLineWidth: () => 1,
                  vLineWidth: () => 1,
                  paddingTop: () => 8,
                  paddingBottom: () => 8,
                },
                alignment: "right",
              },
            ],
            width: "auto",
          },
        ],
        margin: [0, 0, 0, 16],
      },

      // Línea divisoria
      {
        canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: "#1a4731" }],
        margin: [0, 0, 0, 12],
      },

      cuerpo,
    ],

    defaultStyle: {
      fontSize: 9,
      color: "#1f2937",
    },

    styles: {
      tablaHeader: {
        bold: true,
        color: "#ffffff",
        fillColor: "#1a4731",
        fontSize: 9,
        characterSpacing: 0.8,
      },
      celdaPar: {
        fillColor: "#f7faf8",
      },
    },
  };
};

const construirTabla = (encabezados: string[], filas: any[][], anchos: any[]): Content => {
  if (filas.length === 0) {
    return {
      text: "No hay datos para mostrar en el período seleccionado.",
      italics: true,
      color: "#9ca3af",
      alignment: "center",
      margin: [0, 40, 0, 0],
    };
  }

  return {
    table: {
      headerRows: 1,
      widths: anchos,
      body: [
        encabezados.map((h) => ({ text: h, style: "tablaHeader", alignment: "center" })),
        ...filas.map((fila, idx) =>
          fila.map((celda) => ({
            text: celda ?? "—",
            fillColor: idx % 2 === 0 ? "#f7faf8" : "#ffffff",
            margin: [4, 4, 4, 4],
            fontSize: 8.5,
          }))
        ),
      ],
    },
    layout: {
      hLineColor: () => "#e5e7eb",
      vLineColor: () => "#e5e7eb",
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
    },
  };
};

/* ───────────────── CLIENTES ───────────────── */

export const descargarReportesClientesPDF = async (desde: string, hasta: string): Promise<void> => {
  const logo = await obtenerLogoBase64();
  const clientes = await obtenerClientes();

  const filtrados = clientes.filter((c: any) => dentroDelRango(c.registered_at, desde, hasta));

  const filas = filtrados.map((c: any) => [
    `${c.tipo_cliente}-${c.identificacion}`,
    `${c.nombre} ${c.apellido}`,
    c.email,
    c.telefono,
    c.genero === "M" ? "Masculino" : "Femenino",
    formatearFecha(c.registered_at),
    c.estado_cliente === "A" ? "Activo" : "Inactivo",
  ]);

  const cuerpo = construirTabla(
    ["Identificación", "Nombre Completo", "Correo", "Teléfono", "Género", "Registrado", "Estado"],
    filas,
    ["auto", "*", "*", "auto", "auto", "auto", "auto"]
  );

  const doc = construirDocumento({
    titulo: "Reporte de Clientes",
    desde,
    hasta,
    cuerpo,
    logoBase64: logo,
    totalRegistros: filtrados.length,
  });

  descargarBlobPDF(doc, `Reporte_Clientes_${desde}_al_${hasta}.pdf`);
};

/* ───────────────── CITAS ───────────────── */

export const generarReporteCitasPDF = async (desde: string, hasta: string): Promise<void> => {
  const logo = await obtenerLogoBase64();
  const citas = await obtenerCitas();

  const filtrados = citas.filter((c: any) => dentroDelRango(c.fecha, desde, hasta));

  const estadoLabel = (e: string) => {
    const m: Record<string, string> = { A: "Agendada", COM: "Completada", C: "Cancelada", P: "Pendiente" };
    return m[e] || e;
  };

  const filas = filtrados.map((c: any) => [
    `#${c.id}`,
    c.cliente_data ? `${c.cliente_data.nombre} ${c.cliente_data.apellido}` : `Cliente ${c.cliente}`,
    c.usuario_data?.first_name ? `Dr. ${c.usuario_data.first_name} ${c.usuario_data.last_name}` : `Usuario ${c.usuario}`,
    formatearFecha(c.fecha),
    c.motivo || "—",
    estadoLabel(c.estado_cita),
  ]);

  const cuerpo = construirTabla(
    ["ID", "Paciente", "Optometrista", "Fecha", "Motivo", "Estado"],
    filas,
    ["auto", "*", "*", "auto", "*", "auto"]
  );

  const doc = construirDocumento({
    titulo: "Reporte de Citas Médicas",
    desde,
    hasta,
    cuerpo,
    logoBase64: logo,
    totalRegistros: filtrados.length,
  });

  descargarBlobPDF(doc, `Reporte_Citas_${desde}_al_${hasta}.pdf`);
};

/* ───────────────── RECETAS ───────────────── */

export const generarReporteRecetasPDF = async (desde: string, hasta: string): Promise<void> => {
  const logo = await obtenerLogoBase64();
  const recetas = await obtenerTodasLasRecetas();

  const filtrados = recetas.filter((r: any) =>
    dentroDelRango(r.fecha_creacion || r.fecha_sistema, desde, hasta)
  );

  const obtenerOjo = (r: any, alias: "OD" | "OI") => {
    const d = r.rv_detalle_data?.find((x: any) => x.oculus?.alias === alias);
    if (!d) return "—";
    const esf = Number(d.oculus?.esfera || 0).toFixed(2);
    const cil = Number(d.oculus?.cilindro || 0).toFixed(2);
    const eje = d.oculus?.eje || 0;
    const add = Number(d.adicion || 0).toFixed(2);
    return `Esf:${esf} Cil:${cil} Eje:${eje}° Add:${add}`;
  };

  const filas = filtrados.map((r: any) => [
    `#${r.id}`,
    r.cliente_data ? `${r.cliente_data.nombre} ${r.cliente_data.apellido}` : `Cliente ${r.cliente}`,
    formatearFecha(r.fecha_creacion || r.fecha_sistema),
    obtenerOjo(r, "OD"),
    obtenerOjo(r, "OI"),
    r.observaciones || "—",
  ]);

  const cuerpo = construirTabla(
    ["ID", "Paciente", "Fecha", "Ojo Derecho (OD)", "Ojo Izquierdo (OI)", "Observaciones"],
    filas,
    ["auto", "*", "auto", "*", "*", "*"]
  );

  const doc = construirDocumento({
    titulo: "Reporte de Recetas Médicas",
    desde,
    hasta,
    cuerpo,
    logoBase64: logo,
    totalRegistros: filtrados.length,
  });

  descargarBlobPDF(doc, `Reporte_Recetas_${desde}_al_${hasta}.pdf`);
};

/* ───────────────── PEDIDOS ───────────────── */

export const generarReportePedidosPDF = async (desde: string, hasta: string): Promise<void> => {
  const logo = await obtenerLogoBase64();
  const pedidos = await obtenerPedido();

  const filtrados = (pedidos as any[]).filter((p: any) =>
    dentroDelRango(p.fecha_creacion || p.fecha_sistema || p.fecha, desde, hasta)
  );

  const tipoLabel = (t: string) => {
    const m: Record<string, string> = { C: "Completo", SL: "Solo Lente", SM: "Solo Montura" };
    return m[t] || t;
  };

  const estadoLabel = (e: string) => {
    const m: Record<string, string> = { P: "Pendiente", L: "Listo", E: "Entregado", C: "Cancelado" };
    return m[e] || e;
  };

  const filas = filtrados.map((p: any) => [
    `#${p.id}`,
    p.cliente_data ? `${p.cliente_data.nombre} ${p.cliente_data.apellido}` : `Cliente ${p.cliente}`,
    tipoLabel(p.tipo_pedido),
    formatearFecha(p.fecha_creacion || p.fecha_sistema || p.fecha),
    p.descripcion || "—",
    estadoLabel(p.estado_pedido),
  ]);

  const cuerpo = construirTabla(
    ["ID", "Cliente", "Tipo", "Fecha", "Descripción", "Estado"],
    filas,
    ["auto", "*", "auto", "auto", "*", "auto"]
  );

  const doc = construirDocumento({
    titulo: "Reporte de Pedidos",
    desde,
    hasta,
    cuerpo,
    logoBase64: logo,
    totalRegistros: filtrados.length,
  });

  descargarBlobPDF(doc, `Reporte_Pedidos_${desde}_al_${hasta}.pdf`);
};
