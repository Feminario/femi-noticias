import { esAdmin, noAutorizado } from '@/lib/admin';
import { nuevasMiembras } from '@/lib/miembras';

// Trae de la base de Emi (compras de Kajabi) quién entró desde el lunes de esa semana.
export async function POST(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const { semana } = await req.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(semana))) return Response.json({ error: 'Semana inválida' }, { status: 400 });
  return Response.json(await nuevasMiembras(new Date(`${semana}T00:00:00-05:00`).toISOString()));
}
