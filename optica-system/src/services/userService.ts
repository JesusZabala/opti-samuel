import api from "@/api/axiosConfig";

export interface UserList {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    rol: string;
    is_active: boolean;
    email: string;
}

export const obtenerUsuarios = async (): Promise<UserList[]> => {
  try {
    const response = await api.get<UserList[]>("auth/users/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de usuarios:", error);
    throw error;
  }
};