import { esAdmin, noAutorizado } from '@/lib/admin';
import { guardar, leer } from '@/lib/db';
import { nuevasMiembras } from '@/lib/miembras';
import { MUESTRA } from '@/lib/muestra';
import type { Edicion } from '@/lib/tipos';

export async function POST(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const { semana, desde } = await req.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(semana))) return Response.json({ error: 'Semana inválida' }, { status: 400 });
  if (await leer(semana)) return Response.json({ error: 'Ya existe una edición de esa semana' }, { status: 409 });
  const miembras = await nuevasMiembras(new Date(`${semana}T00:00:00-05:00`).toISOString()).catch(() => ({ total: 0, nuevas: [], mes: 0 }));
  const base: Edicion = desde === 'ejemplo'
    ? { ...MUESTRA, semana, estado: 'borrador', ejemplo: undefined, miembras }
    : { semana, estado: 'borrador', titulo: '', apertura: '', notas: [], analisis: { titulo: 'Qué conecta todo esto para nosotras', texto: '', para_nosotras: [] }, miembras, cierre: '', generada_en: new Date().toISOString() };
  await guardar({ ...base, generada_en: new Date().toISOString() });
  return Response.json({ ok: true, semana });
}
