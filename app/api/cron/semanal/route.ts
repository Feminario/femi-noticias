import { correrSemanal } from '@/lib/semanal';
export const maxDuration = 300;

// Vercel Cron llama aquí cada lunes 6:00 a. m. Bogotá (11:00 UTC) con Authorization: Bearer CRON_SECRET.
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new Response('No autorizado', { status: 401 });
  try { return Response.json(await correrSemanal()); }
  catch (e) { return Response.json({ error: (e as Error).message }, { status: 500 }); }
}
