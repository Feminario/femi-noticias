'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Edicion, Nota } from '@/lib/tipos';

type Img = NonNullable<Nota['imagen']>;
const TEMAS: [Nota['tema'], string][] = [['tasas', 'Tasas'], ['inflacion', 'Inflación'], ['empleo', 'Empleo'], ['impuestos', 'Impuestos'], ['dolar', 'Dólar'], ['ahorro-inversion', 'Ahorro e inversión'], ['otro', 'Otro']];

async function json(url: string, metodo: string, cuerpo?: unknown) {
  const r = await fetch(url, { method: metodo, headers: { 'content-type': 'application/json' }, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error ?? 'Algo salió mal');
  return j;
}

// Reduce la foto en el navegador (máx. 1600 px, JPEG) antes de subirla: sube rápido y nunca pasa del límite.
async function reducir(f: File): Promise<File> {
  const bmp = await createImageBitmap(f);
  const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  const blob: Blob = await new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error('No pude leer la imagen'))), 'image/jpeg', 0.85));
  return new File([blob], 'foto.jpg', { type: 'image/jpeg' });
}

function Imagen({ valor, onChange, titulo }: { valor?: Img; onChange: (v?: Img) => void; titulo: string }) {
  const [sube, setSube] = useState(false); const [error, setError] = useState('');
  async function subir(f?: File) {
    if (!f) return; setSube(true); setError('');
    try {
      const fd = new FormData(); fd.set('archivo', await reducir(f));
      const r = await fetch('/api/admin/subir', { method: 'POST', body: fd }); const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      onChange({ url: j.url, alt: valor?.alt ?? '', credito: valor?.credito ?? 'Foto: Feminario' });
    } catch (e) { setError((e as Error).message || 'No se pudo subir'); } finally { setSube(false); }
  }
  return (
    <div className="img-caja">
      <b className="etq">{titulo}</b>
      {valor?.url ? <img src={valor.url} alt="" referrerPolicy="no-referrer" /> : <p className="suave">Sin imagen.</p>}
      <div className="botones">
        <label className="boton-suave">{sube ? 'Subiendo…' : valor?.url ? 'Cambiar foto' : 'Subir foto'}<input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={sube} onChange={(e) => { subir(e.target.files?.[0]); e.target.value = ''; }} /></label>
        {valor?.url && <button type="button" className="boton-suave" onClick={() => onChange(undefined)}>Quitar</button>}
      </div>
      {valor?.url && <>
        <label className="campo">Descripción (para quien no ve la imagen)<input value={valor.alt} onChange={(e) => onChange({ ...valor, alt: e.target.value })} /></label>
        <label className="campo">Crédito<input value={valor.credito} onChange={(e) => onChange({ ...valor, credito: e.target.value })} /></label>
      </>}
      {error && <p style={{ color: '#B24A72', fontWeight: 600 }}>{error}</p>}
    </div>
  );
}

export default function Editor({ inicial }: { inicial: Edicion }) {
  const [e, setE] = useState<Edicion>(inicial);
  const [estado, setEstado] = useState(inicial.estado);
  const [msg, setMsg] = useState(''); const [ocupada, setOcupada] = useState(false); const [sucio, setSucio] = useState(false);
  const r = useRouter();
  const cambiar = (p: Partial<Edicion>) => { setE((x) => ({ ...x, ...p })); setSucio(true); };
  const nota = (i: number, p: Partial<Nota>) => cambiar({ notas: e.notas.map((n, k) => (k === i ? { ...n, ...p } : n)) });
  const mover = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= e.notas.length) return; const n = [...e.notas]; [n[i], n[j]] = [n[j], n[i]]; cambiar({ notas: n }); };
  const accion = async (f: () => Promise<string | void>) => { setOcupada(true); setMsg(''); try { setMsg((await f()) || ''); } catch (er) { setMsg('⚠️ ' + (er as Error).message); } finally { setOcupada(false); } };

  const guardar = () => accion(async () => { await json('/api/admin/edicion', 'PUT', e); setSucio(false); return 'Guardado ✓'; });
  const publicar = (p: boolean) => accion(async () => { await json('/api/admin/edicion', 'PUT', e); const j = await json('/api/admin/publicar', 'POST', { semana: e.semana, publicar: p }); setEstado(j.estado); setSucio(false); return p ? 'Publicada ✓ Ya se ve en la web.' : 'Quedó como borrador.'; });
  const traerMiembras = () => accion(async () => { const m = await json('/api/admin/miembras', 'POST', { semana: e.semana }); cambiar({ miembras: m }); return `Trajimos ${m.total} de esta semana desde Kajabi.`; });
  const eliminar = () => { if (confirm('¿Borrar esta edición? No se puede deshacer.')) accion(async () => { await json(`/api/admin/edicion?semana=${e.semana}`, 'DELETE'); r.push('/admin'); }); };

  return (
    <main className="pagina admin">
      <div className="barra-admin">
        <Link href="/admin">← Ediciones</Link>
        <span className={`chip ${estado === 'publicada' ? 'lima' : 'crema'}`}>{estado === 'publicada' ? 'Publicada' : 'Borrador'}</span>
        {sucio && <span className="suave">Cambios sin guardar</span>}
        <span style={{ flex: 1 }} />
        <Link className="boton-suave" href={`/admin/${e.semana}/vista`} target="_blank">Vista previa</Link>
        <button className="boton-suave" disabled={ocupada} onClick={guardar}>Guardar</button>
        {estado === 'publicada'
          ? <><button className="boton" disabled={ocupada} onClick={() => publicar(true)}>Guardar y actualizar web</button><button className="boton-suave" disabled={ocupada} onClick={() => publicar(false)}>Despublicar</button></>
          : <button className="boton" disabled={ocupada} onClick={() => publicar(true)}>Publicar</button>}
      </div>
      {msg && <p className="mensaje" role="status">{msg}</p>}
      <h1>Semana del {e.semana}</h1>

      <section className="tarjeta">
        <h2>Portada</h2>
        <label className="campo">Título<input value={e.titulo} onChange={(x) => cambiar({ titulo: x.target.value })} /></label>
        <label className="campo">Apertura (3-5 líneas)<textarea rows={4} value={e.apertura} onChange={(x) => cambiar({ apertura: x.target.value })} /></label>
        <Imagen titulo="Imagen de portada (opcional)" valor={e.portada} onChange={(v) => cambiar({ portada: v })} />
      </section>

      <section className="tarjeta">
        <h2>Nuevas en la comunidad</h2>
        <div className="botones"><button className="boton-suave" disabled={ocupada} onClick={traerMiembras}>Traer de Kajabi</button></div>
        <div className="fila-campos">
          <label className="campo">Esta semana<input type="number" min={0} value={e.miembras.total} onChange={(x) => cambiar({ miembras: { ...e.miembras, total: +x.target.value } })} /></label>
          <label className="campo">En el mes<input type="number" min={0} value={e.miembras.mes ?? 0} onChange={(x) => cambiar({ miembras: { ...e.miembras, mes: +x.target.value } })} /></label>
        </div>
        {e.miembras.nuevas.map((m, i) => (
          <div className="fila-campos" key={i}>
            <label className="campo">Nombre<input value={m.nombre} onChange={(x) => cambiar({ miembras: { ...e.miembras, nuevas: e.miembras.nuevas.map((y, k) => (k === i ? { ...y, nombre: x.target.value } : y)) } })} /></label>
            <label className="campo">Ciudad<input value={m.ciudad ?? ''} onChange={(x) => cambiar({ miembras: { ...e.miembras, nuevas: e.miembras.nuevas.map((y, k) => (k === i ? { ...y, ciudad: x.target.value || null } : y)) } })} /></label>
            <label className="campo">Compró<input value={m.producto} onChange={(x) => cambiar({ miembras: { ...e.miembras, nuevas: e.miembras.nuevas.map((y, k) => (k === i ? { ...y, producto: x.target.value } : y)) } })} /></label>
            <button className="boton-suave" onClick={() => cambiar({ miembras: { ...e.miembras, nuevas: e.miembras.nuevas.filter((_, k) => k !== i) } })}>Quitar</button>
          </div>
        ))}
        <button className="boton-suave" onClick={() => cambiar({ miembras: { ...e.miembras, nuevas: [...e.miembras.nuevas, { nombre: '', ciudad: null, producto: '' }] } })}>+ Agregar a mano</button>
      </section>

      <h2>Notas ({e.notas.length})</h2>
      {e.notas.map((n, i) => (
        <section className="tarjeta" key={i}>
          <div className="fila"><h3>Nota {i + 1}</h3><div className="botones"><button className="boton-suave" onClick={() => mover(i, -1)} disabled={i === 0}>↑</button><button className="boton-suave" onClick={() => mover(i, 1)} disabled={i === e.notas.length - 1}>↓</button><button className="boton-suave" onClick={() => confirm('¿Quitar esta nota?') && cambiar({ notas: e.notas.filter((_, k) => k !== i) })}>Quitar</button></div></div>
          <label className="campo">Titular<input value={n.titulo} onChange={(x) => nota(i, { titulo: x.target.value })} /></label>
          <label className="campo">Qué pasó<textarea rows={3} value={n.resumen} onChange={(x) => nota(i, { resumen: x.target.value })} /></label>
          <label className="campo">¿Cómo nos afecta?<textarea rows={3} value={n.impacto} onChange={(x) => nota(i, { impacto: x.target.value })} /></label>
          <div className="fila-campos">
            <label className="campo">Tema<select value={n.tema} onChange={(x) => nota(i, { tema: x.target.value as Nota['tema'] })}>{TEMAS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
            <label className="campo">Fuente<input value={n.fuente} onChange={(x) => nota(i, { fuente: x.target.value })} /></label>
            <label className="campo">Fecha<input type="date" value={n.fecha.slice(0, 10)} onChange={(x) => nota(i, { fecha: x.target.value })} /></label>
          </div>
          <label className="campo">Enlace a la nota original<input value={n.url} onChange={(x) => nota(i, { url: x.target.value })} /></label>
          <Imagen titulo="Imagen de la nota (opcional)" valor={n.imagen} onChange={(v) => nota(i, { imagen: v })} />
        </section>
      ))}
      <button className="boton-suave" onClick={() => cambiar({ notas: [...e.notas, { titulo: '', resumen: '', impacto: '', fuente: '', url: '', fecha: new Date().toISOString().slice(0, 10), tema: 'otro' }] })}>+ Agregar nota</button>

      <section className="tarjeta" style={{ marginTop: 16 }}>
        <h2>Análisis</h2>
        <label className="campo">Título<input value={e.analisis.titulo} onChange={(x) => cambiar({ analisis: { ...e.analisis, titulo: x.target.value } })} /></label>
        <label className="campo">Texto (deja una línea en blanco entre párrafos)<textarea rows={9} value={e.analisis.texto} onChange={(x) => cambiar({ analisis: { ...e.analisis, texto: x.target.value } })} /></label>
        <b className="etq">Para nosotras esta semana</b>
        {e.analisis.para_nosotras.map((a, i) => (
          <div className="fila-campos" key={i}><label className="campo" style={{ flex: 1 }}><input value={a} onChange={(x) => cambiar({ analisis: { ...e.analisis, para_nosotras: e.analisis.para_nosotras.map((y, k) => (k === i ? x.target.value : y)) } })} /></label><button className="boton-suave" onClick={() => cambiar({ analisis: { ...e.analisis, para_nosotras: e.analisis.para_nosotras.filter((_, k) => k !== i) } })}>Quitar</button></div>
        ))}
        <button className="boton-suave" onClick={() => cambiar({ analisis: { ...e.analisis, para_nosotras: [...e.analisis.para_nosotras, ''] } })}>+ Agregar acción</button>
      </section>

      <section className="tarjeta">
        <h2>Cierre</h2>
        <label className="campo"><textarea rows={2} value={e.cierre} onChange={(x) => cambiar({ cierre: x.target.value })} /></label>
      </section>

      <div className="barra-admin abajo">
        <button className="boton-suave" onClick={eliminar}>Borrar edición</button>
        <span style={{ flex: 1 }} />
        <button className="boton-suave" disabled={ocupada} onClick={guardar}>Guardar</button>
        <button className="boton" disabled={ocupada} onClick={() => publicar(true)}>{estado === 'publicada' ? 'Guardar y actualizar web' : 'Publicar'}</button>
      </div>
    </main>
  );
}
