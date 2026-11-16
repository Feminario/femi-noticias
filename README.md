# femi-noticias

App de Feminario (Next.js en Vercel). Cada lunes: nuevas mujeres de la comunidad + mapeo de noticias económicas de **fuentes verificadas** + análisis de cómo nos afecta a nosotras y a Colombia. Voz cálida y directa; marca del panel (`../plataforma/femi-panel/docs/marca-panel.md`).

## Cómo funciona

```
Vercel Cron (lun 6:00 a. m. Bogotá)
  → /api/cron/semanal
     1. recolector.ts   trae los RSS de lib/fuentes.ts (lista cerrada)
     2. miembras.ts     compras de los últimos 7 días en Supabase (solo nombra a quien dio consentimiento)
     3. analisis.ts     Claude elige 4-6 notas y escribe impacto + análisis
                        → barrera: toda nota debe tener una URL que el recolector trajo de un dominio verificado
     4. db.ts           guarda la edición como BORRADOR (Storage)
  → Sofi/Andrea revisan y publican → la web (/, /ediciones) lee solo las publicadas
```

- **Guardado**: Supabase Storage (la misma Supabase de Emi), sin tablas que migrar. Bucket privado `noticias-ediciones` (un JSON por semana, con su estado) y bucket público `noticias-img` (fotos subidas desde el admin). Los buckets se crean solos.
- **Admin**: `/admin` con una clave compartida (`ADMIN_CLAVE`). Edita portada, notas, análisis, miembras y cierre; sube fotos (se reducen en el navegador); vista previa; publicar/despublicar; «Generar borrador con IA» (necesita `ANTHROPIC_API_KEY`).
- **Worker**: no hace falta un servidor aparte. Es una ruta con Vercel Cron (una corrida semanal de ~1-2 min). Emi (WhatsApp, `whatsapp-web.js`) es un proceso que debe estar siempre encendido; esto no, así que no se mezclan.
- **Fuentes** (probadas 6 nov 2026): Banco de la República, Portafolio, El Tiempo, La República, Valora Analitik, BBC Mundo, DW, El País. Sin feed que funcionara: DANE, MinHacienda, Superfinanciera, DIAN (se pueden agregar con scraping o a mano).

## Puesta en marcha
1. `cp .env.example .env.local` y llenar (Supabase = las mismas llaves del panel; `ANTHROPIC_API_KEY`; `CRON_SECRET` inventado).
2. Poner `ADMIN_CLAVE` (la clave del equipo para entrar a `/admin`).
3. `npm run dev` (sin variables muestra una edición de ejemplo). `npm run semanal` genera una edición real como borrador.
4. Publicar desde `/admin`.
5. `npx vercel deploy --prod --scope feminario` y cargar las variables en el proyecto.

## Pendiente de decidir
- **Acceso**: público, sin login (decidido 6 nov).
- **Nombres de nuevas miembras**: primer nombre + ciudad, solo con `consentimiento_datos` (aprobado por Sofi).
- **Publicación**: borrador + aprobación humana (recomendado: es análisis financiero con la marca de ustedes).

## Mensajes de comunidad por WhatsApp
Ver `comunidad/MENSAJES.md` (10 mensajes, 9 nov → 1 dic) y `comunidad/programar.mts` (ensayo por defecto; `--enviar` encola en el `outbox` de Emi).
