import Anthropic from '@anthropic-ai/sdk';
import type { Edicion } from './tipos';
import type { Item } from './recolector';
import { dominioPermitido } from './fuentes';

const SISTEMA = `Eres la editora de Femi-noticias, el resumen semanal de Feminario (educación financiera para mujeres en Colombia).
VOZ: cálida y directa. Como una amiga que sabe de finanzas: frases cortas, sin tecnicismos sin explicar, sin frases motivacionales vacías, sin corporativismo. Tuteas. Máximo 1 emoji por sección.
REGLAS DURAS:
1. Usa SOLO las notas que te doy. No añadas cifras, fechas ni hechos que no estén en ellas. Si falta un dato, dilo ("aún no hay cifra oficial").
2. Cada nota que elijas debe copiar EXACTAMENTE su url. No inventes urls.
3. Elige entre 4 y 6 notas con impacto real en el bolsillo de mujeres en Colombia (tasas, inflación, empleo, impuestos, dólar, ahorro e inversión). Ignora farándula, política sin efecto económico y notas repetidas.
4. "impacto" explica en 2 frases cómo afecta a una mujer colombiana (trabajadora, independiente, madre cabeza de hogar, ahorradora, deudora). Si el efecto es incierto, di que es incierto. Considera brechas reales (informalidad, trabajo de cuidado no remunerado, menor acceso a crédito) solo cuando la nota lo justifique.
5. No es asesoría de inversión: nada de "compra X". Da criterios y acciones prudentes.
6. Responde SOLO con JSON válido, sin texto extra ni bloques de código.`;

export async function analizar(semana: string, items: Item[], miembras: Edicion['miembras']): Promise<Edicion> {
  const cli = new Anthropic();
  const lista = items.slice(0, 80).map((i, n) => `${n + 1}. [${i.fuente}] ${i.titulo}\n   url: ${i.url}\n   fecha: ${i.fecha.slice(0, 10)}\n   ${i.resumen}`).join('\n');
  const r = await cli.messages.create({
    model: process.env.MODELO_ANALISIS ?? 'claude-sonnet-5-5', max_tokens: 6000, system: SISTEMA,
    messages: [{ role: 'user', content: `Semana del ${semana}. Notas disponibles:\n${lista}\n\nDevuelve JSON con esta forma exacta:
{"titulo": string, "apertura": string (3-5 líneas, entra directo a una tensión real),
 "notas": [{"titulo": string, "resumen": string, "fuente": string, "url": string, "fecha": "YYYY-MM-DD", "impacto": string, "tema": "tasas"|"inflacion"|"empleo"|"impuestos"|"dolar"|"ahorro-inversion"|"otro"}],
 "analisis": {"titulo": string, "texto": string (150-220 palabras: qué conecta estas notas y cómo nos afecta a nosotras y a Colombia), "para_nosotras": [2 a 4 acciones concretas y prudentes]},
 "cierre": string (2 líneas cálidas)}` }],
  });
  const txt = r.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('');
  const j = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));

  // Barrera anti-invención: cada nota debe existir en lo recolectado y venir de un dominio verificado.
  const reales = new Map(items.map((i) => [i.url, i]));
  const notas = (j.notas ?? []).filter((n: any) => reales.has(n.url) && dominioPermitido(n.url)).map((n: any) => ({ ...n, fecha: reales.get(n.url)!.fecha, fuente: reales.get(n.url)!.fuente }));
  if (notas.length < 3) throw new Error(`Solo ${notas.length} notas pasaron la verificación de fuentes; no se genera la edición.`);
  return { semana, estado: 'borrador', titulo: j.titulo, apertura: j.apertura, notas, analisis: j.analisis, miembras, cierre: j.cierre, generada_en: new Date().toISOString() };
}
