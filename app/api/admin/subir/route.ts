import { randomBytes } from 'node:crypto';
import { esAdmin, noAutorizado } from '@/lib/admin';
import { BUCKET_IMG, asegurarBuckets, db } from '@/lib/db';

const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function POST(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const archivo = (await req.formData()).get('archivo');
  if (!(archivo instanceof File)) return Response.json({ error: 'Falta el archivo' }, { status: 400 });
  const ext = EXT[archivo.type];
  if (!ext) return Response.json({ error: 'Solo JPG, PNG o WebP' }, { status: 400 });
  if (archivo.size > 4 * 1024 * 1024) return Response.json({ error: 'La imagen pesa más de 4 MB' }, { status: 400 });
  await asegurarBuckets();
  const ruta = `${new Date().toISOString().slice(0, 10)}-${randomBytes(5).toString('hex')}.${ext}`;
  const { error } = await db().storage.from(BUCKET_IMG).upload(ruta, archivo, { contentType: archivo.type, cacheControl: '31536000' });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ url: db().storage.from(BUCKET_IMG).getPublicUrl(ruta).data.publicUrl });
}
