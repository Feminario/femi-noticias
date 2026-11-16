'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

async function api(url: string, cuerpo?: unknown, metodo = 'POST') {
  const r = await fetch(url, { method: metodo, headers: { 'content-type': 'application/json' }, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error ?? 'Algo salió mal');
  return j;
}

export function Acceso() {
  const [clave, setClave] = useState(''); const [error, setError] = useState(''); const r = useRouter();
  return (
    <form className="tarjeta" style={{ maxWidth: 380 }} onSubmit={async (ev) => { ev.preventDefault(); try { await api('/api/admin/entrar', { clave }); r.refresh(); } catch (e) { setError((e as Error).message); } }}>
      <label className="campo">Clave del equipo<input type="password" value={clave} onChange={(e) => setClave(e.target.value)} autoFocus /></label>
      {error && <p style={{ color: '#B24A72', fontWeight: 600 }}>{error}</p>}
      <button className="boton" type="submit">Entrar</button>
    </form>
  );
}

function Salir() {
  const r = useRouter();
  return <button className="boton-suave" onClick={async () => { await api('/api/admin/salir'); r.refresh(); }}>Cerrar sesión</button>;
}

function Nueva({ sugerida, hayIA }: { sugerida: string; hayIA: boolean }) {
  const [semana, setSemana] = useState(sugerida); const [desde, setDesde] = useState('vacia'); const [msg, setMsg] = useState(''); const [ocupada, setOcupada] = useState(false); const r = useRouter();
  return (
    <div className="tarjeta">
      <h3>Nueva edición</h3>
      <div className="fila-campos">
        <label className="campo">Lunes de la semana<input type="date" value={semana} onChange={(e) => setSemana(e.target.value)} /></label>
        <label className="campo">Empezar desde<select value={desde} onChange={(e) => setDesde(e.target.value)}><option value="vacia">En blanco</option><option value="ejemplo">Copia del ejemplo</option></select></label>
      </div>
      <div className="botones">
        <button className="boton" disabled={ocupada} onClick={async () => { setOcupada(true); setMsg(''); try { await api('/api/admin/nueva', { semana, desde }); r.push(`/admin/${semana}`); } catch (e) { setMsg((e as Error).message); setOcupada(false); } }}>Crear y editar</button>
        <button className="boton-suave" disabled={ocupada || !hayIA} title={hayIA ? '' : 'Falta ANTHROPIC_API_KEY'} onClick={async () => { setOcupada(true); setMsg('Buscando noticias y escribiendo el borrador… (1-2 min)'); try { const j = await api('/api/admin/generar'); r.push(`/admin/${j.semana}`); } catch (e) { setMsg((e as Error).message); setOcupada(false); } }}>Generar borrador con IA</button>
      </div>
      {!hayIA && <p className="suave">«Generar con IA» se activa cuando se cargue la llave del análisis.</p>}
      {msg && <p className="suave" role="status">{msg}</p>}
    </div>
  );
}

export const Acciones = { Salir, Nueva };
