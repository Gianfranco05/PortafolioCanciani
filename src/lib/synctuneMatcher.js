// Port a JavaScript de backend/app/services/matching_service.py de SyncTune.
// Mantener en sincronía con el original: mismos patrones, pesos y umbrales.

export const CONFIDENCE_HIGH = 90.0;
export const CONFIDENCE_MEDIUM = 70.0;

const VERSION_KEYWORDS = {
  live: ["live", "en vivo"],
  acoustic: ["acoustic", "acústico", "acustico", "unplugged"],
  remix: ["remix"],
  remastered: ["remaster"],
  instrumental: ["instrumental"],
  karaoke: ["karaoke"],
  cover: ["cover"],
};

const NOISE_PATTERNS = [
  String.raw`\(official\s*(music\s*)?video\)`,
  String.raw`\(official\s*audio\)`,
  String.raw`\(official\)`,
  String.raw`\(lyrics?\)`,
  String.raw`\(lyric\s*video\)`,
  String.raw`\(audio\)`,
  String.raw`\(hd\)`,
  String.raw`\(hq\)`,
  String.raw`\(4k\)`,
  String.raw`\(visualizer\)`,
  String.raw`\(sub\s*(español|espanol|ingles|english)?\)`,
  String.raw`\(subtitulado\)`,
  String.raw`\(subtitles?\)`,
  String.raw`\(letra\)`,
  String.raw`\(con\s*letra\)`,
  String.raw`\[official\s*(music\s*)?video\]`,
  String.raw`\[official\s*audio\]`,
  String.raw`\[lyrics?\]`,
  String.raw`\[hd\]`,
  String.raw`\[sub\s*(español|espanol|ingles|english)?\]`,
  String.raw`\[subtitulado\]`,
  String.raw`\[letra\]`,
  String.raw`official\s*music\s*video`,
  String.raw`official\s*video`,
  String.raw`official\s*audio`,
  String.raw`lyric\s*video`,
  String.raw`\bremastered\b`,
  String.raw`\blyrics\b`,
  String.raw`\b4k\b`,
  String.raw`\bhd\b`,
];

const NOISE_RE = new RegExp(NOISE_PATTERNS.join("|"), "gi");
const SEPARATORS = [" - ", " – ", " — ", " | "];

// Equivalente a str.strip(" -–—|\t") de Python.
function stripChars(s, chars) {
  let start = 0;
  let end = s.length;
  while (start < end && chars.includes(s[start])) start++;
  while (end > start && chars.includes(s[end - 1])) end--;
  return s.slice(start, end);
}

export function findNoise(rawTitle) {
  return rawTitle.match(NOISE_RE) ?? [];
}

export function cleanTitle(rawTitle) {
  let cleaned = rawTitle.replace(NOISE_RE, "");
  cleaned = cleaned.replace(/\s{2,}/g, " ");
  cleaned = stripChars(cleaned, " -–—|\t");
  return cleaned.trim();
}

export function guessArtistTrack(cleanedTitle) {
  for (const sep of SEPARATORS) {
    const idx = cleanedTitle.indexOf(sep);
    if (idx !== -1) {
      return {
        artist: cleanedTitle.slice(0, idx).trim(),
        track: cleanedTitle.slice(idx + sep.length).trim(),
      };
    }
  }
  return { artist: null, track: cleanedTitle.trim() };
}

export function buildSearchQueries(rawTitle) {
  const cleaned = cleanTitle(rawTitle);
  const guess = guessArtistTrack(cleaned);
  const queries = [];
  if (guess.artist) {
    queries.push(`track:${guess.track} artist:${guess.artist}`);
    queries.push(`${guess.artist} ${guess.track}`);
  }
  queries.push(cleaned);
  if (cleaned !== rawTitle.trim()) queries.push(rawTitle.trim());
  return [...new Set(queries)];
}

export function detectVersion(text) {
  const lowered = text.toLowerCase();
  for (const [version, keywords] of Object.entries(VERSION_KEYWORDS)) {
    if (keywords.some((k) => lowered.includes(k))) return version;
  }
  return null;
}

export function confidenceLevel(score) {
  if (score >= CONFIDENCE_HIGH) return "alta";
  if (score >= CONFIDENCE_MEDIUM) return "media";
  return "baja";
}

// --- difflib.SequenceMatcher(None, a, b).ratio() ---------------------------
// Ratcliff/Obershelp, como CPython. Sin la heurística "autojunk", que solo
// aplica a secuencias de 200+ elementos (acá comparamos títulos cortos).

function findLongestMatch(a, alo, ahi, blo, bhi, b2j) {
  let besti = alo;
  let bestj = blo;
  let bestsize = 0;
  let j2len = new Map();
  for (let i = alo; i < ahi; i++) {
    const newj2len = new Map();
    for (const j of b2j.get(a[i]) ?? []) {
      if (j < blo) continue;
      if (j >= bhi) break;
      const k = (j2len.get(j - 1) ?? 0) + 1;
      newj2len.set(j, k);
      if (k > bestsize) {
        besti = i - k + 1;
        bestj = j - k + 1;
        bestsize = k;
      }
    }
    j2len = newj2len;
  }
  return [besti, bestj, bestsize];
}

function sequenceRatio(a, b) {
  const la = a.length;
  const lb = b.length;
  if (la + lb === 0) return 1.0;
  const b2j = new Map();
  for (let j = 0; j < lb; j++) {
    if (!b2j.has(b[j])) b2j.set(b[j], []);
    b2j.get(b[j]).push(j);
  }
  let matches = 0;
  const queue = [[0, la, 0, lb]];
  while (queue.length) {
    const [alo, ahi, blo, bhi] = queue.pop();
    const [i, j, k] = findLongestMatch(a, alo, ahi, blo, bhi, b2j);
    if (k) {
      matches += k;
      if (alo < i && blo < j) queue.push([alo, i, blo, j]);
      if (i + k < ahi && j + k < bhi) queue.push([i + k, ahi, j + k, bhi]);
    }
  }
  return (2.0 * matches) / (la + lb);
}

export function similarity(a, b) {
  return sequenceRatio(a.toLowerCase().trim(), b.toLowerCase().trim());
}

// Igual que score_candidate() del original, pero además devuelve el desglose
// para mostrarlo en la demo. total es idéntico al del backend.
export function scoreCandidate(videoTitle, videoDurationMs, candidate) {
  const cleaned = cleanTitle(videoTitle);
  const guess = guessArtistTrack(cleaned);

  const artist = guess.artist ? similarity(guess.artist, candidate.artists) : 0.5;
  const title = similarity(guess.track, candidate.name);

  let duration = 0.5;
  if (videoDurationMs && candidate.durationMs) {
    const diff = Math.abs(videoDurationMs - candidate.durationMs);
    duration = Math.max(0.0, 1 - diff / 15000);
  }

  const videoVersion = detectVersion(videoTitle);
  const candidateVersion = detectVersion(candidate.name) ?? detectVersion(candidate.album);
  let version;
  if (videoVersion === candidateVersion) version = 1.0;
  else if (videoVersion === null || candidateVersion === null) version = 0.5;
  else version = 0.0;

  const total = artist * 0.4 + title * 0.4 + duration * 0.1 + version * 0.1;
  return {
    total: Math.round(total * 1000) / 10,
    parts: { artist, title, duration, version },
    candidateVersion,
  };
}
