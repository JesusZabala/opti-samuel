import api from "../api/axiosConfig";

export interface Oculus {
    descripcion: string;
    alias: string;
    esfera: number;
    cilindro: number;
    eje: number;
}

export interface RecetaDetalle {
    oculus: Oculus;
    adicion: number;
    distancia_pupilar: number;
}

export interface RecetaVisual {
    id?: number;
    cita?: number|null;
    cliente?: number|null;
    observaciones: string;
    rv_detalle_data: RecetaDetalle[];
    fecha_sistema?: string;
    fecha_creacion?: string;
}

export const registrarRecetaCompleta = async (datos: RecetaVisual) => {
    try{
        const response = await api.post('recetas/',datos);
        return response.data;
    } catch (error:any){
        throw error.response?.data || "Error al procesar la receta medica";
    }
};

export const obtenerHistorialCliente = async (clienteId: number): Promise<RecetaVisual[]> => {
    try {
        const response = await api.get(`recetas/?cliente=${clienteId}`);
        return response.data;
    }catch (error:any) {
        throw error.response?.data || "Error al obtener historial";
    }
};

export const obtenerTodasLasRecetas = async (): Promise<RecetaVisual[]> => {
    try {
        const response = await api.get('recetas/');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Error al obtener el listado de recetas";
    }
};