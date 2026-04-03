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

export const descargarFacturaPDF = (pedidoId: number) => {
    const baseURL = api.defaults.baseURL;
    const url = `${baseURL}pedido/${pedidoId}/descargar_pdf/`;
    window.location.href = url;
}


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

