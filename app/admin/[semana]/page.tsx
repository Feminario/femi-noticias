import { notFound, redirect } from 'next/navigation';
import { esAdmin } from '@/lib/admin';
import { leer } from '@/lib/db';
import Editor from './editor';

export const dynamic = 'force-dynamic';

export default async function Editar({ params }: { params: Promise<{ semana: string }> }) {
  if (!(await esAdmin())) redirect('/admin');
  const { semana } = await params;
  const e = await leer(semana);
  if (!e) notFound();
  return <Editor inicial={e} />;
}
