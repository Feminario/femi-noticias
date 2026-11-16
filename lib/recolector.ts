import { FUENTES, dominioPermitido } from './fuentes';

export type Item = { fuente: string; titulo: string; url: string; fecha: string; resumen: string };

const limpiar = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;|&gt;/g, '').replace(/\s+/g, ' ').trim();
const campo = (b: string, t: string) => limpiar(b.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, 'i'))?.[1] ?? '');

// Trae los feeds de las fuentes verificadas de los últimos `dias` días. Un feed caído no tumba la corrida: se reporta.
export async function recolectar(dias = 8) {
  const desde = Date.now() - dias * 86_400_000;
  const items: Item[] = [];
  const caidas: string[] = [];
  await Promise.all(FUENTES.map(async (f) => {
    try {
      const r = await fetch(f.feed, { headers: { 'user-agent': 'Mozilla/5.0 (Feminario Femi-noticias)' }, signal: AbortSignal.timeout(12_000) });
      if (!r.ok) throw new Error(String(r.status));
      const xml = await r.text();
      for (const b of xml.match(/<item[\s\S]*?<\/item>/gi) ?? []) {
        const url = campo(b, 'link') || b.match(/<link[^>]*href="([^"]+)"/i)?.[1] || '';
        const fecha = new Date(campo(b, 'pubDate') || campo(b, 'dc:date') || Date.now());
        if (!url || !dominioPermitido(url) || isNaN(+fecha) || +fecha < desde) continue;
        items.push({ fuente: f.nombre, titulo: campo(b, 'title'), url, fecha: fecha.toISOString(), resumen: campo(b, 'description').slice(0, 400) });
      }
    } catch (e) { caidas.push(`${f.nombre}: ${(e as Error).message}`); }
  }));
  return { items: items.sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha)), caidas };
}
