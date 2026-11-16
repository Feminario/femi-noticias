import { db } from './db';
import type { NuevaMiembra } from './tipos';

// Mujeres que compraron un curso o el Club (compras reales de Kajabi, no cuotas).
// Se muestra solo el primer nombre y el producto (Sofi aprobó mostrar nombres el 6 nov 2026). Se excluye al equipo y a quien pidió baja.
const bonito = (s: string) => { const t = s.trim().split(/\s+/)[0].toLowerCase(); return t.charAt(0).toUpperCase() + t.slice(1); };
const limpio = (s: string) => s.replace(/[\p{Extended_Pictographic}️‍]/gu, '').replace(/\s+/g, ' ').trim();

export async function nuevasMiembras(desdeISO: string): Promise<{ total: number; nuevas: NuevaMiembra[]; mes: number }> {
  const bog = new Date(Date.now() - 5 * 3600_000);
  const inicioMes = new Date(`${bog.toISOString().slice(0, 7)}-01T00:00:00-05:00`).toISOString();
  const desde = desdeISO < inicioMes ? desdeISO : inicioMes;

  const { data: compras } = await db().from('compras').select('customer_id, oferta_nombre, es_club, comprado_en').eq('desactivada', false).eq('tipo', 'compra').gte('comprado_en', desde).order('comprado_en', { ascending: false });
  const ids = [...new Set((compras ?? []).map((c) => c.customer_id))];
  if (!ids.length) return { total: 0, nuevas: [], mes: 0 };
  const { data: cl } = await db().from('customers').select('id, nombre, ciudad, opt_out_whatsapp, primer_contacto_via').in('id', ids);
  const valida = new Map((cl ?? []).filter((c) => !['equipo', 'equipo_grupo'].includes(c.primer_contacto_via ?? '')).map((c) => [c.id, c]));

  const semana = new Map<string, string>(), mes = new Set<string>();
  for (const c of compras ?? []) {
    if (!valida.has(c.customer_id)) continue;
    if (c.comprado_en >= inicioMes) mes.add(c.customer_id);
    if (c.comprado_en >= desdeISO && !semana.has(c.customer_id)) semana.set(c.customer_id, limpio(c.oferta_nombre));
  }
  const nuevas = [...semana].filter(([id]) => valida.get(id)!.nombre).map(([id, producto]) => ({ nombre: bonito(valida.get(id)!.nombre!), ciudad: valida.get(id)!.ciudad ?? null, producto }));
  return { total: semana.size, nuevas, mes: mes.size };
}
