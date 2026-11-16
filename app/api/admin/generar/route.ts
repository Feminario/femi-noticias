import { esAdmin, noAutorizado } from '@/lib/admin';
import { correrSemanal } from '@/lib/semanal';
export const maxDuration = 300;

// Lo mismo que hace el cron del lunes, pero a pedido desde el admin. Queda como borrador.
export async function POST() {
  if (!(await esAdmin())) return noAutorizado();
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'Falta la llave del análisis (ANTHROPIC_API_KEY).' }, { status: 400 });
  try { return Response.json(await correrSemanal()); } catch (e) { return Response.json({ error: (e as Error).message }, { status: 500 }); }
}
