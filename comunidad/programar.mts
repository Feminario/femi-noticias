// Programa el mensaje de comunidad de UN día en la cola `outbox` de Emi (la misma que usan las campañas).
// Por defecto es un ENSAYO: no escribe nada. Con --enviar encola los mensajes (uno cada 45–90 s, nunca en ráfaga).
//
// Uso (desde femi-chat, con sus variables de entorno):
//   npx tsx ../../femi-noticias/comunidad/programar.mts --dia 2026-11-09            # ensayo
//   npx tsx ../../femi-noticias/comunidad/programar.mts --dia 2026-11-09 --enviar   # encola de verdad
//   Opcional: --prueba 573001234567  → solo a ese número (para probar contigo primero)
//
// Quién recibe: compró al menos un curso (no Club), dio consentimiento de WhatsApp, no pidió baja, tiene teléfono.
// Cada mensaje queda registrado en eventos_unicos: si lo corres dos veces el mismo día, nadie recibe doble.
import { createClient } from '@supabase/supabase-js';
import { MENSAJES, SALUDOS } from './mensajes.mjs';

const arg = (n: string) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : undefined; };
const ENVIAR = process.argv.includes('--enviar');
const DIA = arg('--dia');
const PRUEBA = arg('--prueba');
const LINK = process.env.NOTICIAS_URL ?? '[LINK FEMI-NOTICIAS]';

const m = MENSAJES.find((x) => x.dia === DIA);
if (!m) { console.error('Indica --dia con uno de:', MENSAJES.map((x) => x.dia).join(', ')); process.exit(1); }
if (ENVIAR && /\[[A-ZÁÉÍÓÚ ]{3,}[^\]]*\]/.test(m.texto + LINK)) { console.error('⛔ Quedan [CORCHETES] sin completar en el mensaje o falta NOTICIAS_URL. Complétalos en mensajes.mjs.'); process.exit(1); }

const db = createClient(process.env.SUPABASE_URL!, (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!, { auth: { persistSession: false } });
const primer = (n: string | null) => String(n ?? '').trim().split(/\s+/)[0] || 'amiga';

// 1) Compradoras de cursos (excluye a quien también es del Club: ellas tienen su propio acompañamiento)
const { data: compras } = await db.from('compras').select('customer_id, oferta_nombre, es_club, comprado_en').eq('desactivada', false).eq('tipo', 'compra').order('comprado_en', { ascending: false });
const clubIds = new Set((compras ?? []).filter((c) => c.es_club).map((c) => c.customer_id));
const cursoDe = new Map<string, string>();
for (const c of compras ?? []) if (!c.es_club && !clubIds.has(c.customer_id) && !cursoDe.has(c.customer_id)) cursoDe.set(c.customer_id, c.oferta_nombre);

// 2) Sus datos de contacto y permisos
const ids = [...cursoDe.keys()];
const clientas: any[] = [];
for (let i = 0; i < ids.length; i += 200) {
  const { data } = await db.from('customers').select('id, nombre, telefono_e164, wa_chat_id, consentimiento_whatsapp, opt_out_whatsapp, primer_contacto_via').in('id', ids.slice(i, i + 200));
  clientas.push(...(data ?? []));
}
let aptas = clientas.filter((c) => c.consentimiento_whatsapp && !c.opt_out_whatsapp && c.telefono_e164 && !['equipo', 'equipo_grupo'].includes(c.primer_contacto_via));
if (PRUEBA) aptas = clientas.filter((c) => String(c.telefono_e164 ?? '').replace(/\D/g, '') === PRUEBA);

console.log(`Mensaje ${m.dia} · «${m.tema}»`);
console.log(`Compradoras de curso: ${cursoDe.size} · aptas para escribir: ${aptas.length} (sin consentimiento o con baja: ${clientas.length - aptas.length})`);

let orden = 0, encoladas = 0, repetidas = 0;
for (const c of aptas) {
  const clave = `comunidad:${m.dia}:${c.id}`;
  const { data: ya } = await db.from('eventos_unicos').select('clave').eq('clave', clave).maybeSingle();
  if (ya) { repetidas++; continue; }
  const curso = (cursoDe.get(c.id) ?? 'tu curso').replace(/^curso\s+/i, '');
  const saludo = SALUDOS[encoladas % SALUDOS.length];
  const texto = `${saludo}\n${m.texto}`.replaceAll('{nombre}', primer(c.nombre)).replaceAll('{curso}', curso).replaceAll('{link_noticias}', LINK);
  if (orden < 3) console.log(`\n— Ejemplo (${primer(c.nombre)}):\n${texto}`);
  orden++;
  if (!ENVIAR) continue;
  // Hora de Bogotá 10:00 del día del mensaje (UTC-5), escalonado 45–90 s
  const base = new Date(`${m.dia}T10:00:00-05:00`).getTime();
  const send_at = new Date(Math.max(Date.now(), base) + encoladas * (45_000 + Math.random() * 45_000)).toISOString();
  const { data: conv } = await db.from('conversations').select('id').eq('customer_id', c.id).maybeSingle();
  const { data: msg } = conv ? await db.from('messages').insert({ conversation_id: conv.id, direccion: 'saliente', autor: 'agente', tipo: 'texto', contenido: texto, created_at: send_at }).select('id').single() : { data: null };
  await db.from('outbox').insert({ customer_id: c.id, contenido: texto, origen: 'comunidad', message_id: msg?.id ?? null, send_at });
  await db.from('eventos_unicos').insert({ clave, tipo: 'comunidad' });
  encoladas++;
}
console.log(ENVIAR ? `\n✅ Encoladas: ${encoladas} · ya enviadas antes: ${repetidas}` : `\n(ensayo) Se encolarían ${orden}. Nada se escribió. Agrega --enviar para programarlas.`);
