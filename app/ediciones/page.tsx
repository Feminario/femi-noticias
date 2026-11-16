import Link from 'next/link';
import { Pie, Cabecera } from '../../components';
import { ediciones } from '@/lib/db';
import { fechaCorta } from '@/lib/semana';

export const revalidate = 300;

export default async function Archivo() {
  const lista = await ediciones();
  return (
    <main className="pagina">
      <Cabecera />
      <h1>Ediciones anteriores</h1>
      <div className="lista">
        {lista.map((e) => (
          <Link key={e.semana} href={`/ediciones/${e.semana}`}><div className="tarjeta"><span className="fuente">Semana del {fechaCorta(e.semana)}</span><h3>{e.titulo}</h3></div></Link>
        ))}
      </div>
    <Pie />
</main>
  );
}
