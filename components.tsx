import Link from 'next/link';
import { Confeti } from './confeti';
import type { Edicion } from './lib/tipos';
import { fechaCorta } from './lib/semana';
import { SUBSTACK, SPOTIFY_PROGRAMA, WEB, spotifyEmbed } from './lib/enlaces';

export function Cabecera() {
  return (
    <header className="cabecera">
      <Link href="/"><img src="/brand/logo-nombre.png" alt="Feminario" /></Link>
      <Link className="nav" href="/ediciones">Ediciones anteriores</Link>
    </header>
  );
}

const TEMAS: Record<string, string> = { tasas: 'Tasas', inflacion: 'Inflación', empleo: 'Empleo', impuestos: 'Impuestos', dolar: 'Dólar', 'ahorro-inversion': 'Ahorro e inversión', otro: 'Economía' };

export function VistaEdicion({ e }: { e: Edicion }) {
  return (
    <>
      <Confeti />
      <section className="hero">
        <div className="semana">Semana del {fechaCorta(e.semana)}</div>
        <h1>{e.titulo}</h1>
        <p>{e.apertura}</p>
      </section>
      {e.portada && <figure className="foto portada"><img src={e.portada.url} alt={e.portada.alt} referrerPolicy="no-referrer" /><figcaption>{e.portada.credito}</figcaption></figure>}

      <section className="comunidad">
        <img src="/fotos/comunidad.png" alt="Mujeres de la comunidad Feminario con sus tote bags «El dinero es poder decidir»" />
        <div className="texto">
          <h2>Bienvenidas a la comunidad 💜</h2>
          <p>Esta semana se {e.miembras.total === 1 ? 'unió' : 'unieron'} <b>{e.miembras.total}</b> {e.miembras.total === 1 ? 'mujer' : 'mujeres'}{e.miembras.mes ? <> y en lo que va del mes ya somos <b>{e.miembras.mes}</b> nuevas.</> : '.'} 💜</p>
        </div>
      </section>

      <h2>Lo que pasó esta semana</h2>
      {e.notas.map((n) => (
        <article className="tarjeta" key={n.url}>
          {n.imagen && <figure className="foto"><img src={n.imagen.url} alt={n.imagen.alt} loading="lazy" referrerPolicy="no-referrer" /><figcaption>{n.imagen.credito}</figcaption></figure>}
          <span className="chip peri">{TEMAS[n.tema] ?? 'Economía'}</span>
          <h3 style={{ marginTop: 8 }}>{n.titulo}</h3>
          <p>{n.resumen}</p>
          <div className="impacto"><b>¿Cómo nos afecta?</b>{n.impacto}</div>
          <p className="fuente" style={{ marginTop: 10 }}>Fuente: <a href={n.url} target="_blank" rel="noopener noreferrer">{n.fuente}</a> · {fechaCorta(n.fecha)}</p>
        </article>
      ))}

      <section className="analisis">
        <h2>{e.analisis.titulo}</h2>
        <p>{e.analisis.texto}</p>
        <b>Para nosotras esta semana</b>
        <ul>{e.analisis.para_nosotras.map((a) => <li key={a}>{a}</li>)}</ul>
      </section>

      <p className="cierre">{e.cierre}</p>
      <p className="suave">Femi-noticias es información y educación, no asesoría financiera personalizada. Todas las notas vienen de fuentes verificadas; el análisis es de Feminario.</p>
    </>
  );
}

export function Pie() {
  return (
    <footer className="pie">
      <section className="bloque-pod">
        <h2>Escúchanos 🎧</h2>
        <p className="suave">El podcast de Feminario, para seguir hablando de plata con calma.</p>
        <iframe title="Podcast de Feminario en Spotify" src={spotifyEmbed()} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
      </section>
      <section className="bloque-sub">
        <h2>Recíbelo en tu correo</h2>
        <p>Nuestro Substack llega directo a tu bandeja, sin que tengas que acordarte.</p>
        <a className="boton" href={SUBSTACK + 'subscribe'} target="_blank" rel="noopener noreferrer">Suscríbete en Substack</a>
      </section>
      <div className="pie-base">
        <img src="/brand/logo-nombre.png" alt="Feminario" />
        <nav>
          <a href={WEB} target="_blank" rel="noopener noreferrer">feminario.co</a>
          <a href={SUBSTACK} target="_blank" rel="noopener noreferrer">Substack</a>
          <a href={SPOTIFY_PROGRAMA} target="_blank" rel="noopener noreferrer">Podcast</a>
        </nav>
        <p className="suave">El dinero es poder decidir. Femi-noticias es información y educación, no asesoría financiera personalizada.</p>
      </div>
    </footer>
  );
}
