export type Fuente = { nombre: string; dominio: string; feed: string; tipo: 'oficial' | 'prensa' };

export type Nota = {
  titulo: string;
  resumen: string;          // qué pasó, 2 frases, sin opinión
  fuente: string;           // nombre de la fuente verificada
  url: string;              // SIEMPRE una URL que el recolector trajo de una fuente de la lista
  fecha: string;            // ISO
  impacto: string;          // cómo nos afecta a nosotras / a las mujeres en Colombia, en voz Feminario
  imagen?: { url: string; alt: string; credito: string };  // opcional; se sube desde el admin
  tema: 'tasas' | 'inflacion' | 'empleo' | 'impuestos' | 'dolar' | 'ahorro-inversion' | 'otro';
};

export type NuevaMiembra = { nombre: string; ciudad: string | null; producto: string };

export type Edicion = {
  semana: string;           // lunes de esa semana, YYYY-MM-DD
  estado: 'borrador' | 'publicada';
  titulo: string;
  portada?: { url: string; alt: string; credito: string };  // imagen opcional bajo el título
  apertura: string;         // 3-5 líneas, voz Feminario
  notas: Nota[];
  analisis: { titulo: string; texto: string; para_nosotras: string[] };  // análisis financiero + 2-4 acciones concretas
  miembras: { total: number; nuevas: NuevaMiembra[]; mes?: number };
  cierre: string;
  generada_en: string;
  ejemplo?: boolean;        // true = edición de demostración (muestra un aviso)
};
