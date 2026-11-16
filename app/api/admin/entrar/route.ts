import { cookies } from 'next/headers';
import { claveCorrecta, crearToken } from '@/lib/admin';

export async function POST(req: Request) {
  const { clave } = await req.json().catch(() => ({ clave: '' }));
  if (!claveCorrecta(String(clave ?? ''))) { await new Promise((r) => setTimeout(r, 800)); return Response.json({ error: 'Clave incorrecta' }, { status: 401 }); }
  (await cookies()).set('admin', crearToken(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 86400 });
  return Response.json({ ok: true });
}
