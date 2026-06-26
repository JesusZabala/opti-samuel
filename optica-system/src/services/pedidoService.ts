// import api from "../api/axiosConfig";

// export interface PedidoInput {
//     tipo_pedido: 'SL' | 'SM' | 'C';
//     receta_visual?: number | null;
//     cliente?: number | null;
//     descripcion: string;
//     observacion: string;
//     detalle: {
//         medida?: string;
//         montura?: {
//             modelo: number; 
//             marca: number; 
//             color: number; 
//             material: string;
//         } | null;
//         lente?: {
//             tipo_lente: number; 
//             tipo_tratamiento: number;
//         } | null;
//     };
// }

// export const registrarPedido = async (datos: PedidoInput) => {
//     try{
//         const response = await api.post('pedido/', datos);
//         return response.data;
//     } catch (error:any){
//         throw error.response?.data || "Error desconocido al registrar el pedido"
//     }
// };

// /** Descarga con Bearer (axios); no usar window.location porque no envía el JWT. */
// // export const descargarFacturaPDF = async (pedidoId: number): Promise<void> => {
// //     const response = await api.get(`pedido/${pedidoId}/descargar_pdf/`, {
// //         responseType: "blob",
// //     });
// //     const blob = new Blob([response.data], { type: "application/pdf" });
// //     const url = window.URL.createObjectURL(blob);
// //     const link = document.createElement("a");
// //     link.href = url;
// //     link.setAttribute("download", `Pedido_${pedidoId}.pdf`);
// //     document.body.appendChild(link);
// //     link.click();
// //     link.remove();
// //     window.URL.revokeObjectURL(url);
// // };

// /** Descarga con Bearer (axios); procesa correctamente errores JSON devueltos como Blob */
// export const descargarFacturaPDF = async (pedidoId: number): Promise<void> => {
//     try {
//         const response = await api.get(`pedido/${pedidoId}/descargar_pdf/`, {
//             responseType: "blob",
//         });

//         // Verificación de seguridad: Si el backend respondió con un JSON en vez de un PDF
//         if (response.data.type === "application/json") {
//             // Convertimos el blob a texto para leer el mensaje de Django
//             const textError = await response.data.text();
//             const jsonError = JSON.parse(textError);
//             throw new Error(jsonError.error || "Error al generar el PDF en el servidor.");
//         }

//         const blob = new Blob([response.data], { type: "application/pdf" });
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
        
//         link.href = url;
//         // Extraemos el nombre desde las cabeceras o usamos uno por defecto seguro
//         link.setAttribute("download", `Pedido_${pedidoId}.pdf`);
        
//         document.body.appendChild(link);
//         link.click();
        
//         // Limpieza del DOM
//         link.remove();
//         window.URL.revokeObjectURL(url);
        
//     } catch (error: any) {
//         // Si el error ya fue procesado como texto arriba, lo relanzamos
//         if (error instanceof Error) throw error;
        
//         // Si es un error estándar de Axios (ej. 404 o 500)
//         if (error.response?.data instanceof Blob) {
//             const text = await error.response.data.text();
//             try {
//                 const parsed = JSON.parse(text);
//                 throw new Error(parsed.error || "Error interno del servidor al procesar el PDF.");
//             } catch {
//                 throw new Error("No se pudo conectar con el servicio de reportes visuales.");
//             }
//         }
        
//         throw error;
//     }
// };

// export const obtenerPedido = async () => {
//     try{
//         const response = await api.get('pedido/');
//         return response.data;
//     } catch(error:any){
//         throw error.response?.data || "Error al obtener el pedido";
//     }
// };

// export const actualizarEstadoPedido = async (id:number, nuevoEstado:string) => {
//     try{
//         const response = await api.patch(`pedido/${id}/`, {estado_pedido: nuevoEstado});
//         return response.data;
//     }catch(error: any){
//         throw error.response?.data || "Error al actualizar el estado";
//     }
// }

// export const obtenerCatalogos = async () => {
//   const response = await api.get("pedido/obtener_catalogos/");
//   return response.data;
// };



import api from "../api/axiosConfig";
import pdfMakeModule from 'pdfmake/build/pdfmake';
// @ts-ignore
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// Importamos la interfaz oficial de definiciones de pdfmake
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

const pdfMake: any = pdfMakeModule;
const vfsSources = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs || pdfFonts;
pdfMake.vfs = vfsSources;

export interface PedidoInput {
    tipo_pedido: 'SL' | 'SM' | 'C';
    receta_visual?: number | null;
    cliente?: number | null;
    descripcion: string;
    observacion: string;
    detalle: {
        medida?: string;
        montura?: {
            modelo: number; 
            marca: number; 
            color: number; 
            material: string;
        } | null;
        lente?: {
            tipo_lente: number; 
            tipo_treatment: number;
        } | null;
    };
}

export const registrarPedido = async (datos: PedidoInput) => {
    try{
        const response = await api.post('pedido/', datos);
        return response.data;
    } catch (error:any){
        throw error.response?.data || "Error desconocido al registrar el pedido"
    }
};

export const obtenerPedido = async () => {
    try{
        const response = await api.get('pedido/');
        return response.data;
    } catch(error:any){
        throw error.response?.data || "Error al obtener el pedido";
    }
};

export const actualizarEstadoPedido = async (id:number, nuevoEstado:string) => {
    try{
        const response = await api.patch(`pedido/${id}/`, {estado_pedido: nuevoEstado});
        return response.data;
    }catch(error: any){
        throw error.response?.data || "Error al actualizar el estado";
    }
}

export const obtenerCatalogos = async () => {
  const response = await api.get("pedido/obtener_catalogos/");
  return response.data;
};

/** Generación de Factura PDF usando pdfmake en el Frontend (Sin Logo) */
// export const descargarFacturaPDF = async (pedidoId: number, pedidoPrecargado?: any): Promise<void> => {
//     try {
//         let pedido = pedidoPrecargado;

//         if (!pedido) {
//             const response = await api.get(`pedido/${pedidoId}/`);
//             pedido = response.data;
//         }

//         const getTipoLabel = (tipo: string) => {
//             const tipos: any = { 'C': "Completo", 'SL': "Solo Lente", 'SM': "Solo Montura" };
//             return tipos[tipo] || tipo;
//         };

//         // Aplicamos la interfaz correcta en lugar de 'any' para tener autocompletado nativo
//         const docDefinition: TDocumentDefinitions = {
//             content: [
//                 {
//                     columns: [
//                         {
//                             text: 'OPTI-SAMUEL C.A.\nRIF: J-00000000-0\nMaracaibo, Edo. Zulia',
//                             style: 'companyBrand',
//                         },
//                         {
//                             text: 'COMPROBANTE DE COMPRA\nServicios Ópticos Integrales\nContacto: optisamuel6@gmail.com',
//                             style: 'companyDetails',
//                             alignment: 'right',
//                         }
//                     ]
//                 },
//                 { text: '\n', margin: [0, 2] },
//                 { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, linewidth: 2, lineColor: '#1a4731' }] },
//                 { text: '\n', margin: [0, 5] },

//                 {
//                     columns: [
//                         { text: `FACTURA DE PEDIDO #${pedido.id}`, style: 'invoiceTitle' },
//                         { 
//                             text: `Fecha Emisión: ${pedido.fecha_emision ? new Date(pedido.fecha_emision).toLocaleDateString() : 'N/A'}\nFecha Entrega: ${pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString() : 'N/A'}`, 
//                             alignment: 'right', 
//                             fontSize: 10,
//                             bold: true
//                         }
//                     ]
//                 },
//                 { text: '\n', margin: [0, 5] },

//                 { text: 'DATOS DEL CLIENTE', style: 'sectionHeader' },
//                 {
//                     style: 'clientBox',
//                     table: {
//                         widths: ['*'],
//                         body: [[
//                             {
//                                 text: `Nombre Completo: ${pedido.cliente_data?.nombre || ''} ${pedido.cliente_data?.apellido || 'N/A'}\nTipo de Servicio: ${getTipoLabel(pedido.tipo_pedido)}\nDescripción: ${pedido.descripcion || 'Sin descripción'}`,
//                                 margin: [6, 6, 6, 6],
//                                 fontSize: 11,
//                                 lineHeight: 1.3
//                             }
//                         ]]
//                     },
//                     layout: 'none'
//                 },
//                 { text: '\n', margin: [0, 5] },

//                 { text: 'ESPECIFICACIONES TÉCNICAS', style: 'sectionHeader' },
                
//                 ...(pedido.info_detalle || []).map((item: any) => {
//                     const detallesItems: any[][] = [];

//                     if (item.montura_data) {
//                         detallesItems.push([
//                             { text: 'Montura', bold: true, fillColor: '#f4fbf7' },
//                             { text: `Marca: ${item.montura_data.marca_data?.descripcion || 'N/A'}\nModelo: ${item.montura_data.modelo_data?.descripcion || 'N/A'}\nColor: ${item.montura_data.color_data?.descripcion || 'N/A'} (Material: ${item.montura_data.material || 'N/A'})` }
//                         ]);
//                     }

//                     if (item.lente_data) {
//                         detallesItems.push([
//                             { text: 'Cristales / Lente', bold: true, fillColor: '#f4fbf7' },
//                             { text: `Tipo: ${item.lente_data.tipo_lente_data?.descripcion || 'N/A'}\nTratamiento: ${item.lente_data.tipo_treatment_data?.descripcion || item.lente_data.tipo_tratamiento_data?.descripcion || 'Sin tratamiento'}` }
//                         ]);
//                     }

//                     return {
//                         style: 'tableSpecs',
//                         table: {
//                             widths: [120, '*'],
//                             body: detallesItems.length > 0 ? detallesItems : [[{ text: 'Sin especificaciones', colSpan: 2 }, {}]]
//                         },
//                         layout: 'lightHorizontalLines',
//                         margin: [0, 0, 0, 10]
//                     };
//                 }),

//                 pedido.observacion ? {
//                     text: `\nOBSERVACIONES IMPORTANTES:\n${pedido.observacion}`,
//                     style: 'observacionBox'
//                 } : '',

//                 { text: '\n\n\nEste documento sirve como comprobante oficial para el retiro de sus cristales y monturas.', style: 'footerText' }
//             ],

//             styles: {
//                 companyBrand: { fontSize: 14, bold: true, color: '#1a4731', lineHeight: 1.2 },
//                 companyDetails: { fontSize: 10, color: '#444', lineHeight: 1.3 },
//                 invoiceTitle: { fontSize: 18, bold: true, color: '#1a4731' },
//                 sectionHeader: { fontSize: 11, bold: true, color: '#1a4731', margin: [0, 10, 0, 5] },
//                 clientBox: { fillColor: '#fafafa' },
//                 tableSpecs: { fontSize: 10, margin: [0, 5, 0, 15], lineHeight: 1.2 },
//                 observacionBox: { fontSize: 10, bold: true, color: '#b91c1c', fillColor: '#fef2f2', margin: [0, 5, 0, 5] },
//                 footerText: { fontSize: 9, italics: true, color: '#666', alignment: 'center' }
//             }
//         };

//         pdfMake.createPdf(docDefinition).download(`Factura_Pedido_${pedidoId}.pdf`);

//     } catch (error: any) {
//         console.error("Error al generar el PDF con pdfmake:", error);
//         throw new Error("No se pudo estructurar el reporte del pedido.");
//     }
// };
export const descargarFacturaPDF = async (pedidoId: number, pedidoPrecargado?: any): Promise<void> => {
    try {
        let pedido = pedidoPrecargado;

        if (!pedido) {
            const response = await api.get(`pedido/${pedidoId}/`);
            pedido = response.data;
        }

        const getTipoLabel = (tipo: string) => {
            const tipos: any = { 'C': "Completo", 'SL': "Solo Lente", 'SM': "Solo Montura" };
            return tipos[tipo] || tipo;
        };

        // 1. Extraemos la receta visual de forma segura según tu backend
        const receta = pedido.receta_visual_data || pedido.receta_visual || null;

        // 2. Inicializamos los estados por defecto para mitigar campos indefinidos
        let odInfo = { esfera: '0.00', cilindro: '0.00', eje: '-', adicion: '-', dnp: '-' };
        let oiInfo = { esfera: '0.00', cilindro: '0.00', eje: '-', adicion: '-', dnp: '-' };

        // 3. Mapeamos dinámicamente recorriendo los detalles anidados por alias (OD / OI)
        if (receta && Array.isArray(receta.rv_detalle_data)) {
            receta.rv_detalle_data.forEach((det: any) => {
                const alias = det.oculus?.alias?.toUpperCase();
                const info = {
                    esfera: det.oculus?.esfera || '0.00',
                    cilindro: det.oculus?.cilindro || '0.00',
                    eje: det.oculus?.eje ? `${det.oculus.eje}°` : '-',
                    adicion: det.adicion || '-',
                    dnp: det.distancia_pupilar || '-' // Mapeado exacto de tu backend
                };

                if (alias === 'OD') odInfo = info;
                if (alias === 'OI') oiInfo = info;
            });
        }

        // 4. Si existe una receta asociada, construimos la tabla estructurada para pdfmake
        const recetaBlock = receta ? [
            { text: 'RECETA VISUAL ASOCIADA', style: 'sectionHeader' },
            {
                style: 'tableSpecs',
                table: {
                    widths: [40, '*', '*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'Ojo', bold: true, fillColor: '#f4fbf7', alignment: 'center' },
                            { text: 'Esfera (SPH)', bold: true, fillColor: '#f4fbf7', alignment: 'center' },
                            { text: 'Cilindro (CYL)', bold: true, fillColor: '#f4fbf7', alignment: 'center' },
                            { text: 'Eje (AXIS)', bold: true, fillColor: '#f4fbf7', alignment: 'center' },
                            { text: 'Adición (ADD)', bold: true, fillColor: '#f4fbf7', alignment: 'center' },
                            { text: 'DNP / ALT', bold: true, fillColor: '#f4fbf7', alignment: 'center' }
                        ],
                        [
                            { text: 'OD', bold: true, alignment: 'center' },
                            { text: odInfo.esfera, alignment: 'center' },
                            { text: odInfo.cilindro, alignment: 'center' },
                            { text: odInfo.eje, alignment: 'center' },
                            { text: odInfo.adicion, alignment: 'center' },
                            { text: odInfo.dnp, alignment: 'center' }
                        ],
                        [
                            { text: 'OI', bold: true, alignment: 'center' },
                            { text: oiInfo.esfera, alignment: 'center' },
                            { text: oiInfo.cilindro, alignment: 'center' },
                            { text: oiInfo.eje, alignment: 'center' },
                            { text: oiInfo.adicion, alignment: 'center' },
                            { text: oiInfo.dnp, alignment: 'center' }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#e2e8f0',
                    vLineColor: () => '#e2e8f0',
                },
                margin: [0, 5, 0, 15]
            }
        ] : [];

        const docDefinition: TDocumentDefinitions = {
            content: [
                {
                    columns: [
                        {
                            text: 'OPTI-SAMUEL C.A.\nRIF: J-00000000-0\nMaracaibo, Edo. Zulia',
                            style: 'companyBrand',
                        },
                        {
                            text: 'COMPROBANTE DE COMPRA\nServicios Ópticos Integrales\nContacto: optisamuel6@gmail.com',
                            style: 'companyDetails',
                            alignment: 'right',
                        }
                    ]
                },
                { text: '\n', margin: [0, 2] },
                { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, linewidth: 2, lineColor: '#1a4731' }] },
                { text: '\n', margin: [0, 5] },

                {
                    columns: [
                        { text: `FACTURA DE PEDIDO #${pedido.id}`, style: 'invoiceTitle' },
                        { 
                            text: `Fecha Emisión: ${pedido.fecha_emision ? new Date(pedido.fecha_emision).toLocaleDateString() : 'N/A'}\nFecha Entrega: ${pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString() : 'N/A'}`, 
                            alignment: 'right', 
                            fontSize: 10,
                            bold: true
                        }
                    ]
                },
                { text: '\n', margin: [0, 5] },

                { text: 'DATOS DEL CLIENTE', style: 'sectionHeader' },
                {
                    style: 'clientBox',
                    table: {
                        widths: ['*'],
                        body: [[
                            {
                                text: `Nombre Completo: ${pedido.cliente_data?.nombre || ''} ${pedido.cliente_data?.apellido || 'N/A'}\nTipo de Servicio: ${getTipoLabel(pedido.tipo_pedido)}\nDescripción: ${pedido.descripcion || 'Sin descripción'}`,
                                margin: [6, 6, 6, 6],
                                fontSize: 11,
                                lineHeight: 1.3
                            }
                        ]]
                    },
                    layout: 'none'
                },
                { text: '\n', margin: [0, 5] },

                // Inyectamos dinámicamente el bloque condicional de la receta médica
                ...recetaBlock,

                { text: 'ESPECIFICACIONES TÉCNICAS', style: 'sectionHeader' },
                
                ...(pedido.info_detalle || []).map((item: any) => {
                    const detallesItems: any[][] = [];

                    if (item.montura_data) {
                        detallesItems.push([
                            { text: 'Montura', bold: true, fillColor: '#f4fbf7' },
                            { text: `Marca: ${item.montura_data.marca_data?.descripcion || 'N/A'}\nModelo: ${item.montura_data.modelo_data?.descripcion || 'N/A'}\nColor: ${item.montura_data.color_data?.descripcion || 'N/A'} (Material: ${item.montura_data.material || 'N/A'})` }
                        ]);
                    }

                    if (item.lente_data) {
                        detallesItems.push([
                            { text: 'Cristales / Lente', bold: true, fillColor: '#f4fbf7' },
                            { text: `Tipo: ${item.lente_data.tipo_lente_data?.descripcion || 'N/A'}\nTratamiento: ${item.lente_data.tipo_treatment_data?.descripcion || item.lente_data.tipo_tratamiento_data?.descripcion || 'Sin tratamiento'}` }
                        ]);
                    }

                    return {
                        style: 'tableSpecs',
                        table: {
                            widths: [120, '*'],
                            body: detallesItems.length > 0 ? detallesItems : [[{ text: 'Sin especificaciones', colSpan: 2 }, {}]]
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, 0, 0, 10]
                    };
                }),

                pedido.observacion ? {
                    text: `\nOBSERVACIONES IMPORTANTES:\n${pedido.observacion}`,
                    style: 'observacionBox'
                } : '',

                { text: '\n\n\nEste documento sirve como comprobante oficial para el retiro de sus cristales y monturas.', style: 'footerText' }
            ],

            styles: {
                companyBrand: { fontSize: 14, bold: true, color: '#1a4731', lineHeight: 1.2 },
                companyDetails: { fontSize: 10, color: '#444', lineHeight: 1.3 },
                invoiceTitle: { fontSize: 18, bold: true, color: '#1a4731' },
                sectionHeader: { fontSize: 11, bold: true, color: '#1a4731', margin: [0, 10, 0, 5] },
                clientBox: { fillColor: '#fafafa' },
                tableSpecs: { fontSize: 10, margin: [0, 5, 0, 15], lineHeight: 1.2 },
                observacionBox: { fontSize: 10, bold: true, color: '#b91c1c', fillColor: '#fef2f2', margin: [0, 5, 0, 5] },
                footerText: { fontSize: 9, italics: true, color: '#666', alignment: 'center' }
            }
        };

        pdfMake.createPdf(docDefinition).download(`Factura_Pedido_${pedidoId}.pdf`);

    } catch (error: any) {
        console.error("Error al generar el PDF con pdfmake:", error);
        throw new Error("No se pudo extraer la receta ni estructurar el reporte.");
    }
};