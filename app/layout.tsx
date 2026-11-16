import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Femi-noticias · Feminario', description: 'Lo que pasó en la economía esta semana y qué significa para nosotras.', icons: { icon: '/brand/isotipo.png' } };

export default function Raiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=MuseoModerno:wght@600;700;800&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
