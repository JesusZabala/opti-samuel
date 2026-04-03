import api from "@/api/axiosConfig";

/** Descarga con Bearer (axios); no usar window.location porque no envía el JWT. */
export const descargarReportesClientesPDF = async (desde: string, hasta: string): Promise<void> => {
    const response = await api.get("cliente/descargar_reporte/", {
        params: { desde, hasta },
        responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_Clientes_${desde}_al_${hasta}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

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