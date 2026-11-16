// Enlaces de Feminario que usa el pie de página. Para mostrar UN episodio en vez de la lista del programa, pega su enlace en EPISODIO.
export const SUBSTACK = 'https://feminario.substack.com/';
export const SPOTIFY_PROGRAMA = 'https://open.spotify.com/show/48yZaG2OUpzGPu8Rj6dbs9';
export const EPISODIO: string | null = null; // ej. 'https://open.spotify.com/episode/XXXXXXXX'
export const WEB = 'https://feminario.co';

export const spotifyEmbed = () => (EPISODIO ?? SPOTIFY_PROGRAMA).replace('open.spotify.com/', 'open.spotify.com/embed/') + '?utm_source=generator';
