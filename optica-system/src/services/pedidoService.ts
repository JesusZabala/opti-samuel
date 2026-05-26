import api from "../api/axiosConfig";

export interface PedidoInput {
    tipo_pedido: 'SL' | 'SM' | 'C';
    receta_visual?: number | null;
    cliente?: number | null;
    descripcion: string;
    observacion: string;
    detalle: {
        montura?: {
            modelo: number; marca: number; color: number; 
            medidas: number; material: string;
        } | null;
        lente?: {
            tipo_lente: number; tipo_tratamiento: number;
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

/** Descarga con Bearer (axios); no usar window.location porque no envía el JWT. */
// export const descargarFacturaPDF = async (pedidoId: number): Promise<void> => {
//     const response = await api.get(`pedido/${pedidoId}/descargar_pdf/`, {
//         responseType: "blob",
//     });
//     const blob = new Blob([response.data], { type: "application/pdf" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `Pedido_${pedidoId}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
// };

/** Descarga con Bearer (axios); procesa correctamente errores JSON devueltos como Blob */
export const descargarFacturaPDF = async (pedidoId: number): Promise<void> => {
    try {
        const response = await api.get(`pedido/${pedidoId}/descargar_pdf/`, {
            responseType: "blob",
        });

        // Verificación de seguridad: Si el backend respondió con un JSON en vez de un PDF
        if (response.data.type === "application/json") {
            // Convertimos el blob a texto para leer el mensaje de Django
            const textError = await response.data.text();
            const jsonError = JSON.parse(textError);
            throw new Error(jsonError.error || "Error al generar el PDF en el servidor.");
        }

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.href = url;
        // Extraemos el nombre desde las cabeceras o usamos uno por defecto seguro
        link.setAttribute("download", `Pedido_${pedidoId}.pdf`);
        
        document.body.appendChild(link);
        link.click();
        
        // Limpieza del DOM
        link.remove();
        window.URL.revokeObjectURL(url);
        
    } catch (error: any) {
        // Si el error ya fue procesado como texto arriba, lo relanzamos
        if (error instanceof Error) throw error;
        
        // Si es un error estándar de Axios (ej. 404 o 500)
        if (error.response?.data instanceof Blob) {
            const text = await error.response.data.text();
            try {
                const parsed = JSON.parse(text);
                throw new Error(parsed.error || "Error interno del servidor al procesar el PDF.");
            } catch {
                throw new Error("No se pudo conectar con el servicio de reportes visuales.");
            }
        }
        
        throw error;
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

