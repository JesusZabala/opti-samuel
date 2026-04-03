import api from "@/api/axiosConfig";

export const descargarReportesClientesPDF = (desde: string, hasta: string) => {
    const baseURL = api.defaults.baseURL;
    const url = `${baseURL}cliente/descargar_reporte/?desde=${desde}&hasta=${hasta}`;

    window.location.href = url;
}

export const generarReporteCitasPDF = async (desde: string, hasta: string) => {
    try {
        const response = await api.get('cita/descargar_reporte/', {
            params: { desde, hasta },
            responseType: 'blob',
        });

        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Reporte_Citas_${desde}_al_${hasta}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar el reporte de citas:", error);
        throw error;
    }
}

export const generarReporteRecetasPDF = async (desde: string, hasta: string) => {
    try {
        const response = await api.get('recetas/descargar_reporte/', {
            params:{desde, hasta},
            responseType: 'blob',
        });
        const blob = new Blob([response.data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `Reporte_Recetas_${desde}_al_${hasta}.pdf`)

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    } catch(error){
        console.error("Error al descargar el reporte de recetas: ", error);
        throw error;
    }

}

export const generarReportePedidosPDF = async (desde: string, hasta: string) => {
    try{
        const response = await api.get('pedido/descargar_reporte/', {
            params:{desde,hasta},
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', `Reporte_Pedidos_${desde}_al_${hasta}.pdf`);
        document.body.appendChild(link);

        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    }catch(error){
        console.error("Error al descargar el reporte de pedidos: ", error);
        throw error;
    }
}