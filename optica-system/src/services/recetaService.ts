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
export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  identificacion: string;
  email: string;
  telefono: string;
  // Usamos unión de literales para que coincida con los TextChoices de Django
  tipo_cliente: 'V' | 'E' | 'J'; 
  estado_cliente: 'A' | 'I';
  genero: 'M' | 'F';
  // Django envía las fechas como string en formato ISO por defecto
  registered_at: string; 
}
export interface RecetaVisual {
    id?: number;
    cita?: number|null;
    cliente?: number|null;
    cliente_data?: Cliente;
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

/**
 * Actualiza una receta existente (PUT)
 * @param id ID de la receta a modificar
 * @param datos Objeto con los datos actualizados
 */
export const actualizarReceta = async (id: number, datos: RecetaVisual) => {
    try {
        const response = await api.put(`recetas/${id}/`, datos);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || `Error al actualizar la receta #${id}`;
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

export const buscarRecetas = async (termino: string): Promise<RecetaVisual[]> => {
    try {
        const response = await api.get(`recetas/?search=${termino}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Error al buscar recetas";
    }
};