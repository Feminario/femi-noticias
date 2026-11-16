import { revalidatePath } from 'next/cache';
import { esAdmin, noAutorizado } from '@/lib/admin';
import { guardar, leer } from '@/lib/db';

export async function POST(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const { semana, publicar } = await req.json();
  const e = await leer(String(semana));
  if (!e) return Response.json({ error: 'No existe' }, { status: 404 });
  if (publicar && (!e.titulo.trim() || !e.notas.length)) return Response.json({ error: 'Para publicar necesita un título y al menos una nota.' }, { status: 400 });
  await guardar({ ...e, estado: publicar ? 'publicada' : 'borrador' });
  revalidatePath('/', 'layout');
  return Response.json({ ok: true, estado: publicar ? 'publicada' : 'borrador' });
}
