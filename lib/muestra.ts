import type { Edicion } from './tipos';

// Edición de la semana del 16 al 20 de noviembre de 2026. Las notas y sus cifras salen de las fuentes citadas (resumen del propio medio);
// el texto de «impacto» y el análisis se escribieron con el estilo del worker y sin agregar datos que las fuentes no den.
// Es la edición que se muestra mientras no haya ninguna publicada desde el admin (al publicar una, esta deja de verse).
export const MUESTRA: Edicion = {
  semana: '2026-11-16', estado: 'publicada', generada_en: '2026-11-16T12:00:00Z',
  titulo: 'Sin IVA en la canasta, pero la comida sigue cara',
  apertura: 'Esta semana hubo una buena noticia y una incómoda.\nLa buena: el Gobierno dijo que no pondrá IVA a la canasta familiar.\nLa incómoda: el precio de la papa subió 98 % y los analistas ven un 2027 con poco crecimiento y precios altos. Te contamos qué significa para tu bolsillo.',
  notas: [
    { tema: 'impuestos', titulo: 'De la Espriella descarta IVA a la canasta familiar y estudia bajar la tarifa general hasta 17 %', fuente: 'La República', url: 'https://www.larepublica.co/economia/de-la-espriella-descarta-iva-a-la-canasta-familiar-y-estudia-bajar-la-tarifa-general-hasta-17-4525692', fecha: '2026-11-16',
      resumen: 'El presidente anunció ajustes a la Ley de Rescate Económico para no aplicar IVA a la canasta familiar. El Ministerio de Hacienda estudia bajar la tarifa general de IVA de 19 % a 18 % o incluso a 17 %, manteniendo la meta de recaudo.',
      impacto: 'Es un anuncio, todavía no está en el texto final de la ley. Si se confirma, la comida de la casa no subiría por IVA. Y como gran parte del presupuesto del hogar se va en mercado, ahí se nota primero.' },
    { tema: 'inflacion', titulo: 'Aumenta 98 % el precio de la papa y golpea el bolsillo de los hogares: el Dane revela qué otros alimentos se encarecieron', fuente: 'El Tiempo (Economía)', url: 'https://www.eltiempo.com/economia/finanzas-personales/aumenta-98-el-precio-de-la-papa-en-colombia-y-golpea-el-bolsillo-de-los-hogares-dane-revela-que-otros-alimentos-se-encarecieron-3601460', fecha: '2026-11-16',
      resumen: 'El fenómeno de El Niño aumenta la presión sobre los cultivos. Según el Dane, el tomate, las frutas frescas y la carne de res también registraron alzas.',
      impacto: 'Aunque no haya IVA nuevo, el mercado está más caro por el clima. Anota cuánto gastas hoy en comida y compara con hace dos meses: así sabes si necesitas ajustar tu presupuesto.' },
    { tema: 'otro', titulo: 'Colombia viviría un 2027 de estancamiento económico y alta inflación: Banco de Bogotá', fuente: 'Valora Analitik', url: 'https://www.valoraanalitik.com/colombia-viviria-2027-estancamiento-economico-alta-inflacion/', fecha: '2026-11-14',
      resumen: 'La entidad financiera aseguró que el país tendría un escenario de estanflación durante este cierre de año y el próximo: poco crecimiento con precios altos.',
      impacto: 'Es una proyección de un banco, no una certeza. Pero sirve de alerta: si los ingresos no crecen y los precios sí, lo que ahorras hoy te da más margen mañana.' },
    { tema: 'empleo', titulo: 'Trabajadores pedirán que el aumento del salario mínimo sea mayor con base en esta variable', fuente: 'Valora Analitik', url: 'https://www.valoraanalitik.com/trabajadores-pediran-que-aumento-del-salario-minimo-en-colombia-sea-mayor-con-base-en-esta-variable/', fecha: '2026-11-15',
      resumen: 'El incremento del salario mínimo dependerá de factores clave como la inflación, pero los trabajadores piden tener presentes otros escenarios.',
      impacto: 'La negociación del salario mínimo arranca ahora. Si tu ingreso o el de tu familia se mueve con el mínimo, mira esta discusión: define cuánto más podrás gastar o ahorrar en 2027.' },
    { tema: 'ahorro-inversion', titulo: 'Confirman que no harán frecuente descuento para la prima de Navidad de los pensionados', fuente: 'Valora Analitik', url: 'https://www.valoraanalitik.com/confirman-que-no-haran-frecuente-descuento-para-la-prima-de-navidad-de-los-pensionados-en-colombia/', fecha: '2026-11-16',
      resumen: 'Los pensionados en Colombia recibirán la mesada de Navidad a cierre de noviembre.',
      impacto: 'Si en tu casa hay pensionados, esa plata llega pronto. Antes de gastarla, ponle nombre a cada peso: deudas, ahorro y lo que quieres disfrutar.' },
  ],
  analisis: {
    titulo: 'Qué conecta todo esto para nosotras',
    texto: 'La semana tuvo una señal de alivio: el Gobierno dice que la comida básica no tendrá IVA. Pero el mercado ya está más caro por el clima, y un banco advierte que 2027 podría traer poco crecimiento con precios altos. Cuando los precios suben más rápido que los ingresos, lo primero que se aprieta es el presupuesto de la casa.\n\nMuchas veces somos nosotras quienes administramos ese presupuesto del hogar, así que estos cambios se sienten en la mesa y en las cuentas del mes. Por eso conviene ir mirando con calma qué se confirma de la reforma y cómo se mueven los precios, y no decidir por rumores.',
    para_nosotras: [
      'Anota cuánto gastaste en comida este mes y compáralo con el anterior.',
      'Con la prima o la mesada de Navidad: reparte primero lo que debes y lo que ahorras, y después lo que gastas.',
      'Espera el texto final de la Ley de Rescate antes de tomar decisiones grandes.',
      'Si guardas dinero, mira que rinda más que la inflación.',
    ],
  },
  miembras: { mes: 0, total: 0, nuevas: [] },
  cierre: 'Informarte también es una forma de cuidarte. Nos vemos el próximo lunes 💜',
};
