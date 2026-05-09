import api from "@/api/axiosConfig";

export type TipoAccion = 'C' | 'U'; 

export interface AuditoriaRegistro {
    id: number;
    usuario: number|null;
    usuario_nombre: string;
    accion: TipoAccion;
    accion_display: string;
    modulo: string;
    objeto_anterior: any;
    objeto_nuevo: any;
    fecha_sistema: string;
}

export const obtenerAuditoria = async (): Promise<AuditoriaRegistro[]> => {
    try {
        const response = await api.get<AuditoriaRegistro[]>('auditoria/');
        return response.data;
    } catch(error:any){
        throw error.response?.data || "Error al obtener los registros de auditoria"
    }
}

export const obtenerAuditoriaPorId = async (id: number): Promise<AuditoriaRegistro> => {
    try {
        const response = await api.get<AuditoriaRegistro>(`auditoria/${id}/`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || `Error al obtener el registro ${id}`;
    }
};

