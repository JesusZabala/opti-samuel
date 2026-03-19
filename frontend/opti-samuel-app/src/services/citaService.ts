import api from "../api/axiosConfig";

export interface Cita {
    id?: number;
    fecha: string; 
    motivo: string;
    cliente: number;
    usuario: number;
    estado_cita?: 'A' | 'C' | 'COM' | 'RR' | 'NA'; 
    motivo_cancelacion?: string;
    cliente_data?: any;
}


export const agendarCita = async (datos:Cita): Promise<Cita> => {
    try{
        const response = await api.post('cita/', datos);
        return response.data;
    }catch(error:any){
        throw error.response?.data || "Error al agendar";
    }
};

export const obtenerCitas = async (): Promise<Cita[]> => {
    try {
        const response = await api.get('cita/');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Error al obtener citas";
    }
};

export const actualizarEstadoCita = async (id: number, cambios: Partial<Cita>): Promise<Cita> => {
    try {
        const response = await api.patch(`cita/${id}/`, cambios);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Error al actualizar";
    }
};