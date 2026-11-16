import { notFound } from 'next/navigation';
import { Pie, Cabecera, VistaEdicion } from '../../../components';
import { edicion } from '@/lib/db';

export const revalidate = 300;

export default async function Pagina({ params }: { params: Promise<{ semana: string }> }) {
  const { semana } = await params;
  const e = await edicion(semana);
  if (!e) notFound();
  return <main className="pagina"><Cabecera /><VistaEdicion e={e} /><Pie /></main>;
}
