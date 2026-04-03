import api from "../api/axiosConfig";

export const getDashboardStats = async () => {
    const response = await api.get('cita/obtener_dashboard_stats_global/');
    return response.data;
}