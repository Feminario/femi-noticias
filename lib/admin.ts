import { cookies } from 'next/headers';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Acceso del equipo: una clave compartida (ADMIN_CLAVE) y una cookie firmada de 7 días. Sin ADMIN_CLAVE el admin queda cerrado.
const firmar = (v: string) => createHmac('sha256', process.env.ADMIN_CLAVE ?? '').update(v).digest('hex');
const hash = (s: string) => createHash('sha256').update(s).digest();

export const adminActivo = () => !!process.env.ADMIN_CLAVE;
export const claveCorrecta = (c: string) => adminActivo() && timingSafeEqual(hash(c), hash(process.env.ADMIN_CLAVE!));
export function crearToken() { const exp = String(Date.now() + 7 * 86_400_000); return `${exp}.${firmar(exp)}`; }
export async function esAdmin() {
  if (!adminActivo()) return false;
  const t = (await cookies()).get('admin')?.value;
  if (!t) return false;
  const [exp, firma] = t.split('.');
  if (!exp || !firma || Number(exp) < Date.now()) return false;
  const esperado = firmar(exp);
  return firma.length === esperado.length && timingSafeEqual(Buffer.from(firma), Buffer.from(esperado));
}
export const noAutorizado = () => Response.json({ error: 'No autorizada' }, { status: 401 });
