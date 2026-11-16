import { notFound, redirect } from 'next/navigation';
import { Cabecera, Pie, VistaEdicion } from '../../../../components';
import { esAdmin } from '@/lib/admin';
import { leer } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Vista previa de un borrador tal como se verá en la web (solo equipo).
export default async function Vista({ params }: { params: Promise<{ semana: string }> }) {
  if (!(await esAdmin())) redirect('/admin');
  const e = await leer((await params).semana);
  if (!e) notFound();
  return <main className="pagina"><div className="aviso">Vista previa · {e.estado === 'publicada' ? 'ya publicada' : 'borrador, aún no se ve en la web'}</div><Cabecera /><VistaEdicion e={e} /><Pie /></main>;
}
