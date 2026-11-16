import { revalidatePath } from 'next/cache';
import { esAdmin, noAutorizado } from '@/lib/admin';
import { borrar, guardar, leer } from '@/lib/db';
import type { Edicion } from '@/lib/tipos';

const SEMANA = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const semana = new URL(req.url).searchParams.get('semana') ?? '';
  const e = SEMANA.test(semana) ? await leer(semana) : null;
  return e ? Response.json(e) : Response.json({ error: 'No existe' }, { status: 404 });
}

// Guarda lo que editó el equipo. El estado (borrador/publicada) NO cambia aquí: se cambia con /publicar.
export async function PUT(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const e = (await req.json()) as Edicion;
  if (!SEMANA.test(e?.semana ?? '') || !Array.isArray(e.notas) || !e.analisis) return Response.json({ error: 'Edición inválida' }, { status: 400 });
  const previa = await leer(e.semana);
  await guardar({ ...e, estado: previa?.estado ?? 'borrador', ejemplo: undefined });
  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const semana = new URL(req.url).searchParams.get('semana') ?? '';
  if (!SEMANA.test(semana)) return Response.json({ error: 'Semana inválida' }, { status: 400 });
  await borrar(semana);
  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}
