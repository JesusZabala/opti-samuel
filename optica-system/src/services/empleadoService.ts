import api from "@/api/axiosConfig";

export type Rol = 'Admin'|'optometrista'|'recepcionista' |'superadmin'|'staff'|'user';

export interface Empleado {
    id?:number;
    username: string;
    password?: string;
    first_name: string;
    last_name: string;
    email: string;
    rol: Rol;
    is_active: boolean;
}


export const registrarEmpleados = async (datos: Empleado) => {
    try {
        const response = await api.post('auth/gestion-empleados/', datos);
        return response.data;
    }catch(error:any){
        throw error.response?.data || "Error al registrar empleado";
    }
};

export const editarEmpleados = async(datos: Empleado) => {
    try {
        const response = await api.patch(`auth/gestion-empleados/${datos.id}/`, datos);
        return response.data;
    }catch(error: any){
        throw error.response?.data || "Error al editar al empleado";
    }
};

export const consultarEmpleados = async () => {
    try{ 
        const response = await api.get('auth/gestion-empleados/');
        return response.data;
    }catch(error:any){
        throw error.response?.data || "Error al consultar empleados"
    }
}