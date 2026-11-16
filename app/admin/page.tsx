import Link from 'next/link';
import { adminActivo, esAdmin } from '@/lib/admin';
import { edicionesTodas } from '@/lib/db';
import { lunesDe, fechaCorta } from '@/lib/semana';
import { Acceso, Acciones } from './cliente';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  if (!adminActivo()) return <main className="pagina"><p>El admin no está activado (falta ADMIN_CLAVE).</p></main>;
  if (!(await esAdmin())) return <main className="pagina"><img src="/brand/logo-nombre.png" alt="Feminario" style={{ width: 200 }} /><h1 style={{ marginTop: 24 }}>Admin de Femi-noticias</h1><Acceso /></main>;
  const lista = await edicionesTodas();
  return (
    <main className="pagina">
      <header className="cabecera"><img src="/brand/logo-nombre.png" alt="Feminario" /><Acciones.Salir /></header>
      <h1>Ediciones</h1>
      <p className="suave">Edita todo, sube fotos y publica cuando esté lista. Lo que no está publicado no se ve en la web.</p>
      <Acciones.Nueva sugerida={lunesDe()} hayIA={!!process.env.ANTHROPIC_API_KEY} />
      <div className="lista" style={{ marginTop: 20 }}>
        {lista.length === 0 && <div className="tarjeta suave">Todavía no hay ediciones guardadas. Crea la primera arriba.</div>}
        {lista.map((e) => (
          <Link key={e.semana} href={`/admin/${e.semana}`}>
            <div className="tarjeta fila">
              <div><span className="fuente">Semana del {fechaCorta(e.semana)}</span><h3 style={{ margin: 0 }}>{e.titulo || '(sin título)'}</h3></div>
              <span className={`chip ${e.estado === 'publicada' ? 'lima' : 'crema'}`}>{e.estado === 'publicada' ? 'Publicada' : 'Borrador'}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
