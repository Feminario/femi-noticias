import { analizar } from './analisis';
import { guardar } from './db';
import { nuevasMiembras } from './miembras';
import { recolectar } from './recolector';
import { lunesDe } from './semana';

// El trabajo de cada lunes. Lo usan el cron de Vercel y `npm run semanal`.
export async function correrSemanal() {
  const semana = lunesDe();
  const { items, caidas } = await recolectar(8);
  if (items.length < 10) throw new Error(`Solo se recolectaron ${items.length} notas (feeds caídos: ${caidas.join('; ') || 'ninguno'}).`);
  const miembras = await nuevasMiembras(new Date(Date.now() - 7 * 86_400_000).toISOString());
  const ed = await analizar(semana, items, miembras);
  if (process.env.AUTO_PUBLICAR === 'true') ed.estado = 'publicada';
  await guardar(ed);
  return { semana, estado: ed.estado, notas: ed.notas.length, miembras: miembras.total, feedsCaidos: caidas };
}
