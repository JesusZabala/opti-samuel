import api from "../api/axiosConfig";

export type TipoPedido = 'SL'|'SM'|'C';

export interface DetallePedidoInput {
    montura?: number;
    lente?: number;
}

export interface PedidoInput {
    tipo_pedido: TipoPedido;
    receta_visual?: number;
    cliente?: number;
    descripcion: string;
    observacion:string;
    detalle: DetallePedidoInput;
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