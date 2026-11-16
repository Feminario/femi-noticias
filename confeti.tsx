'use client';
import { useEffect, useState } from 'react';

const COLORES = ['#7E84AE', '#C2CBFF', '#CEA2DD', '#DFF3AF', '#F59356', '#F9E1FF', '#FFEAD2'];

export function Confeti() {
  const [piezas, setPiezas] = useState<{ i: number; x: number; d: number; t: number; c: string; r: number; w: number }[]>([]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setPiezas(Array.from({ length: 70 }, (_, i) => ({
      i, x: Math.random() * 100, d: Math.random() * 0.8, t: 2.2 + Math.random() * 1.8,
      c: COLORES[i % COLORES.length], r: Math.random() * 360, w: 6 + Math.random() * 6,
    })));
    const f = setTimeout(() => setPiezas([]), 5000);
    return () => clearTimeout(f);
  }, []);
  if (!piezas.length) return null;
  return (
    <div className="confeti" aria-hidden="true">
      {piezas.map((p) => (
        <i key={p.i} style={{ left: `${p.x}%`, background: p.c, width: p.w, height: p.w * 1.6, animationDelay: `${p.d}s`, animationDuration: `${p.t}s`, transform: `rotate(${p.r}deg)` }} />
      ))}
    </div>
  );
}
