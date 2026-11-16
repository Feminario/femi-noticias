import type { Fuente } from './tipos';

// Lista cerrada. Una nota solo entra si su URL pertenece a uno de estos dominios.
// Feeds probados el 6 nov 2026 (respondieron 200 con artículos). Si uno se cae, el recolector lo omite y lo reporta.
// Por probar / sin feed público que funcionó: DANE, MinHacienda, Superfinanciera, DIAN, La República (ver README).
export const FUENTES: Fuente[] = [
  { nombre: 'Banco de la República', dominio: 'banrep.gov.co', feed: 'https://www.banrep.gov.co/es/rss.xml', tipo: 'oficial' },
  { nombre: 'Portafolio', dominio: 'portafolio.co', feed: 'https://www.portafolio.co/rss/economia.xml', tipo: 'prensa' },
  { nombre: 'El Tiempo (Economía)', dominio: 'eltiempo.com', feed: 'https://www.eltiempo.com/rss/economia.xml', tipo: 'prensa' },
  { nombre: 'La República', dominio: 'larepublica.co', feed: 'https://www.larepublica.co/rss/', tipo: 'prensa' },
  { nombre: 'Valora Analitik', dominio: 'valoraanalitik.com', feed: 'https://www.valoraanalitik.com/feed/', tipo: 'prensa' },
  { nombre: 'BBC Mundo', dominio: 'bbc.co.uk', feed: 'https://feeds.bbci.co.uk/mundo/rss.xml', tipo: 'prensa' },
  { nombre: 'DW Economía', dominio: 'dw.com', feed: 'https://rss.dw.com/xml/rss-sp-eco', tipo: 'prensa' },
  { nombre: 'El País (Economía)', dominio: 'elpais.com', feed: 'https://elpais.com/rss/economia/portada.xml', tipo: 'prensa' },
];

export const dominioPermitido = (url: string) => {
  try { const h = new URL(url).hostname; return FUENTES.some((f) => h === f.dominio || h.endsWith('.' + f.dominio)); } catch { return false; }
};
