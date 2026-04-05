import api from "../api/axiosConfig";

export type TipoCliente = 'V'|'E'|'J';

export type Genero = 'M'|'F';

export interface Cliente {
    id?: number;
    nombre: string;
    apellido: string;
    identificacion: string;
    email: string;
    telefono: string;
    tipo_cliente: TipoCliente;
    genero: Genero;
    estado_cliente?: 'A' | 'I';
    registered_at?: string;
}

export const registrarCliente = async (datos: Cliente) => {
    try {
        const response = await api.post('cliente/',datos);
        return response.data;
    } catch (error:any){
        throw error.response?.data || "Error al registrar cliente";
    }
};

export const obtenerClientes = async (): Promise<Cliente[]> => {
    try {
        const response = await api.get('cliente/');
        return response.data;
    } catch(error:any){
        throw error.response?.data || "Error al obtener la lista";
    }
};

export const buscarClientePorIdentificacion = async (identificacion: string): Promise<Cliente> => {
    try {
        const response = await api.get(`cliente/?identificacion=${identificacion}`);
        if(response.data.length > 0){
            return response.data[0];
        }
        throw "Cliente no encontrado";
    }catch (error:any){
        throw error.response?.data || error;
    }
};

export const buscarClientePorNombre = async (nombre: string): Promise<Cliente[]> => {
    try {
        // Usamos el parámetro ?search que provee Django REST Framework
        const response = await api.get(`cliente/?search=${encodeURIComponent(nombre)}`);
        
        // El search suele devolver una lista, así que devolvemos el array completo
        // Manejamos si viene paginado (results) o directo
        return Array.isArray(response.data) ? response.data : (response.data.results || []);
        
    } catch (error: any) {
        throw error.response?.data || "Error al buscar por nombre";
    }
};

export const actualizarCliente = async (id: number, cambios: Partial<Cliente>): Promise<Cliente> => {
    try {
        const response = await api.patch(`cliente/${id}/`, cambios);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || "Error al actualizar";
    }
};

