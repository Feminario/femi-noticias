import { Pie, Cabecera, VistaEdicion } from '../components';
import { ediciones } from '@/lib/db';

export const revalidate = 300;

export default async function Inicio() {
  const [e] = await ediciones();
  return (
    <main className="pagina">
      <Cabecera />
      {e ? <VistaEdicion e={e} /> : (
        <div className="vacio"><img src="/brand/regadera.png" alt="" /><h2>Estamos regando la primera edición</h2><p className="suave">Sale el próximo lunes. Vuelve a pasar por aquí 💜</p></div>
      )}
    <Pie />
</main>
  );
}
