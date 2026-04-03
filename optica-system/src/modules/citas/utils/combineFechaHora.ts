/**
 * Une fecha (YYYY-MM-DD) y hora en 12h ("08:00 AM") en un string ISO sin zona
 * que DRF/Django interpreta con TIME_ZONE del servidor (America/Caracas).
 */
export function combineFechaHoraForApi(fecha: string, hora12: string): string {
  const parts = hora12.trim().split(/\s+/);
  if (parts.length < 2) {
    throw new Error('Formato de hora inválido');
  }
  const modifier = parts[parts.length - 1]?.toUpperCase();
  const timePart = parts.slice(0, -1).join(' ');
  const [hStr, mStr] = timePart.split(':');
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error('Hora inválida');
  }

  return `${fecha}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}
