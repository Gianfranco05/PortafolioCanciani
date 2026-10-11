// Catálogo de ejemplo para la demo de SyncTune. En la app real los candidatos
// vienen de la búsqueda de Spotify; acá son un set fijo con varias versiones de
// la misma canción para que se vea cómo pesa la detección de versión.
// Las duraciones son aproximadas.
export const catalog = [
  { id: "br-rem", name: "Bohemian Rhapsody - Remastered 2011", artists: "Queen", album: "A Night At The Opera (2011 Remaster)", durationMs: 354000 },
  { id: "br-live", name: "Bohemian Rhapsody - Live Aid", artists: "Queen", album: "Live Aid", durationMs: 150000 },
  { id: "br-cover", name: "Bohemian Rhapsody (Cover)", artists: "Pentatonix", album: "PTX Vol. IV", durationMs: 348000 },
  { id: "dml", name: "De Música Ligera", artists: "Soda Stereo", album: "Canción Animal", durationMs: 212000 },
  { id: "dml-live", name: "De Música Ligera - En Vivo", artists: "Soda Stereo", album: "Me Verás Volver", durationMs: 245000 },
  { id: "crimen", name: "Crimen", artists: "Gustavo Cerati", album: "Ahí Vamos", durationMs: 233000 },
  { id: "crimen-ac", name: "Crimen - Acústico", artists: "Gustavo Cerati", album: "Ahí Vamos (Acústico)", durationMs: 241000 },
  { id: "lucky", name: "Get Lucky (feat. Pharrell Williams)", artists: "Daft Punk, Pharrell Williams", album: "Random Access Memories", durationMs: 369000 },
  { id: "lucky-edit", name: "Get Lucky - Radio Edit", artists: "Daft Punk, Pharrell Williams", album: "Get Lucky", durationMs: 248000 },
  { id: "persiana", name: "Persiana Americana", artists: "Soda Stereo", album: "Signos", durationMs: 293000 },
  { id: "flaca", name: "Flaca", artists: "Andrés Calamaro", album: "Alta Suciedad", durationMs: 278000 },
  { id: "flaca-live", name: "Flaca - En Vivo", artists: "Andrés Calamaro", album: "El Regreso", durationMs: 290000 },
  { id: "tusa", name: "Tusa", artists: "KAROL G, Nicki Minaj", album: "Tusa", durationMs: 200000 },
  { id: "tusa-remix", name: "Tusa - Remix", artists: "KAROL G, Nicki Minaj", album: "Tusa (Remix)", durationMs: 215000 },
];

// Títulos tal como aparecen en YouTube, con el ruido típico de cada canal.
export const examples = [
  { title: "Soda Stereo - De Música Ligera (En Vivo) [HD]", durationMs: 244000 },
  { title: "Gustavo Cerati | Crimen (Official Video)", durationMs: 234000 },
  { title: "Andrés Calamaro - Flaca (Con Letra)", durationMs: 279000 },
  { title: "KAROL G, Nicki Minaj - Tusa (Remix) [Official Audio]", durationMs: 214000 },
  { title: "Queen - Bohemian Rhapsody (Official Video Remastered)", durationMs: 359000 },
];
