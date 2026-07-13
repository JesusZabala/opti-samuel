import { toast } from "sonner";

/**
 * Notificaciones centralizadas de Opti-Samuel.
 * Envuelve `sonner` para dar un estilo consistente y profesional en toda la app
 * y para traducir los errores que devuelve el backend (Django REST Framework)
 * a un mensaje legible para el usuario.
 */

/** Convierte cualquier error (string, Error o payload DRF) en un texto legible. */
export function formatApiError(error: any, fallback = "Ocurrió un error inesperado."): string {
  if (!error) return fallback;

  // String directo
  if (typeof error === "string") return error;

  // Instancia de Error
  if (error instanceof Error && error.message) return error.message;

  // Errores de axios: intentamos leer el cuerpo de la respuesta
  const data = error?.response?.data ?? error;

  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    // Formatos comunes de DRF
    if (typeof data.detail === "string") return data.detail;
    if (typeof data.error === "string") return data.error;
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
      return String(data.non_field_errors[0]);
    }

    // { campo: ["mensaje"], otro: "mensaje" }
    const partes: string[] = [];
    for (const [campo, valor] of Object.entries(data)) {
      const texto = Array.isArray(valor) ? valor.join(" ") : String(valor);
      // Omitimos claves técnicas que no aportan al usuario
      if (campo === "mensaje" || campo === "Cliente" || campo === "Cita") continue;
      partes.push(texto);
    }
    if (partes.length) return partes.join(" · ");
  }

  return fallback;
}

/** Notificación de éxito. */
export function notifyOk(mensaje: string, descripcion?: string) {
  toast.success(mensaje, { description: descripcion });
}

/** Notificación de error. Acepta un texto o directamente el error del backend. */
export function notifyError(error: any, fallback?: string) {
  toast.error(formatApiError(error, fallback));
}

/** Notificación informativa/neutra. */
export function notifyInfo(mensaje: string, descripcion?: string) {
  toast.info(mensaje, { description: descripcion });
}

/** Notificación de advertencia. */
export function notifyWarning(mensaje: string, descripcion?: string) {
  toast.warning(mensaje, { description: descripcion });
}
