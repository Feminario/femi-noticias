// Las semanas de Feminario empiezan el lunes, hora de Bogotá.
export function lunesDe(fecha = new Date()): string {
  const bog = new Date(fecha.getTime() - 5 * 3600_000);
  const dia = (bog.getUTCDay() + 6) % 7; // lun=0
  bog.setUTCDate(bog.getUTCDate() - dia);
  return bog.toISOString().slice(0, 10);
}
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fechaCorta = (iso: string) => { const d = new Date(iso.slice(0, 10) + 'T12:00:00Z'); return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };
