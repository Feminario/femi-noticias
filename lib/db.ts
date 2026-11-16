import { createClient } from '@supabase/supabase-js';
import type { Edicion } from './tipos';
import { MUESTRA } from './muestra';
import { nuevasMiembras } from './miembras';

// Las ediciones viven en Supabase Storage (sin tablas que migrar):
//   bucket privado  noticias-ediciones  → 2026-11-02.json (una por semana; el JSON incluye su estado borrador/publicada)
//   bucket público  noticias-img        → fotos que se suben desde el admin
export const BUCKET_ED = 'noticias-ediciones';
export const BUCKET_IMG = 'noticias-img';

export const db = () => createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
export const hayDb = () => !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

let listos: Promise<void> | null = null;
export function asegurarBuckets() {
  listos ??= (async () => {
    const s = db().storage;
    await s.createBucket(BUCKET_ED, { public: false });
    await s.createBucket(BUCKET_IMG, { public: true, fileSizeLimit: 6 * 1024 * 1024, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] });
  })().catch(() => {}); // si ya existen, createBucket devuelve error: es lo esperado
  return listos;
}

export async function leer(semana: string): Promise<Edicion | null> {
  if (!hayDb()) return null;
  await asegurarBuckets();
  const { data, error } = await db().storage.from(BUCKET_ED).download(`${semana}.json`);
  if (error || !data) return null;
  try { return JSON.parse(await data.text()) as Edicion; } catch { return null; }
}

// Todas (borradores y publicadas), la más reciente primero. Para el admin.
export async function edicionesTodas(): Promise<Edicion[]> {
  if (!hayDb()) return [];
  await asegurarBuckets();
  const { data } = await db().storage.from(BUCKET_ED).list('', { limit: 200 });
  const semanas = (data ?? []).map((f) => f.name.replace(/\.json$/, '')).filter((n) => /^\d{4}-\d{2}-\d{2}$/.test(n));
  const todas = await Promise.all(semanas.map(leer));
  return todas.filter((e): e is Edicion => !!e).sort((a, b) => b.semana.localeCompare(a.semana));
}

// Para la web pública: solo publicadas. Sin ninguna publicada se ve la de ejemplo.
export async function ediciones(): Promise<Edicion[]> {
  if (!hayDb()) return [MUESTRA];
  const pub = (await edicionesTodas()).filter((e) => e.estado === 'publicada');
  return pub.length ? pub : [await muestraConMiembrasReales()];
}
export async function edicion(semana: string): Promise<Edicion | null> {
  return (await ediciones()).find((e) => e.semana === semana) ?? null;
}

export async function guardar(e: Edicion) {
  await asegurarBuckets();
  const { error } = await db().storage.from(BUCKET_ED).upload(`${e.semana}.json`, new Blob([JSON.stringify(e)], { type: 'application/json' }), { upsert: true, contentType: 'application/json', cacheControl: '0' });
  if (error) throw new Error(error.message);
}
export async function borrar(semana: string) {
  await db().storage.from(BUCKET_ED).remove([`${semana}.json`]);
}

async function muestraConMiembrasReales(): Promise<Edicion> {
  try { return { ...MUESTRA, miembras: await nuevasMiembras(new Date(Date.now() - 7 * 86400000).toISOString()) }; } catch { return MUESTRA; }
}
