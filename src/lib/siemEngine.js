// Port a JavaScript del pipeline de detección de la tesis "SIEM Inteligente con ML"
// (scripts_ml/motor_ml.py + scripts_ml/simulador_ataques.py). Mismas features,
// hiperparámetros, reglas y fusión OR. Isolation Forest y DBSCAN son
// implementaciones propias del mismo algoritmo (el original usa scikit-learn),
// así que los números pueden diferir levemente de los de la tesis.

export const IF_CONTAMINATION = 0.18;
export const IF_N_ESTIMATORS = 100;
export const DBSCAN_EPS = 1.5;
export const DBSCAN_MIN_SAMPLES = 3;
export const DENSIDAD_UMBRAL_FREQ = 5;
export const DENSIDAD_UMBRAL_HOSTS = 3;
export const ORGANIC_EVENTS = 96; // escenario_tesis(): 17 anómalos ≈ 15% de 113

// PRNG determinístico (mulberry32) para que cada "ventana" sea reproducible.
export function createRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const randInt = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
const choice = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const pad = (n) => String(n).padStart(2, "0");

function tsDiurno(rng) {
  return `Jun 26 ${pad(randInt(rng, 8, 19))}:${pad(randInt(rng, 0, 59))}:${pad(randInt(rng, 0, 59))}`;
}

// --- Generadores (mismo formato de mensaje que simulador_ataques.py) --------

const ORGANIC_GENERATORS = [
  (rng) => {
    const ip = `192.168.1.${randInt(rng, 10, 49)}`;
    const user = choice(rng, ["gianfranco", "admin", "operador", "soporte", "devops"]);
    return { message: `${tsDiurno(rng)} servidor_app sshd[${randInt(rng, 1000, 9999)}]: Accepted password for ${user} from ${ip} port ${randInt(rng, 40000, 60000)} ssh2` };
  },
  (rng) => {
    const ip = `192.168.1.${randInt(rng, 10, 49)}`;
    const user = choice(rng, ["gianfranco", "admin", "operador", "soporte"]);
    return { message: `${tsDiurno(rng)} servidor_app sshd[${randInt(rng, 1000, 9999)}]: Disconnected from user ${user} ${ip} port ${randInt(rng, 40000, 60000)}` };
  },
  (rng) => {
    const task = choice(rng, ["/usr/local/bin/backup.sh", "run-parts /etc/cron.hourly", "/usr/bin/logrotate /etc/logrotate.conf"]);
    return { message: `${tsDiurno(rng)} servidor_app CRON[${randInt(rng, 1000, 9999)}]: (root) CMD (${task})` };
  },
  (rng) => {
    const action = choice(rng, ["Started", "Reloaded", "Finished"]);
    const service = choice(rng, ["nginx.service", "postgresql.service", "docker.service", "apt-daily.service"]);
    return { message: `${tsDiurno(rng)} servidor_app systemd[1]: ${action} ${service}` };
  },
  (rng) => {
    const domain = choice(rng, ["github.com", "pypi.org", "registry.npmjs.org", "archive.ubuntu.com"]);
    return { message: `${tsDiurno(rng)} servidor_app systemd-resolved[${randInt(rng, 100, 999)}]: Positive cache hit for ${domain}` };
  },
];

const IPS_ATACANTES = ["185.220.101.47", "185.220.101.1", "185.220.101.33", "171.25.193.78", "45.33.32.156"];

export const ATTACKS = {
  ru1: {
    label: "RU-1 · Fuerza bruta SSH",
    description: "15 intentos fallidos de login como root desde la misma IP externa.",
    generate(rng) {
      const ip = choice(rng, IPS_ATACANTES);
      const ts = tsDiurno(rng);
      return Array.from({ length: 15 }, () => ({
        message: `${ts} victima_ssh sshd[1024]: Failed password for root from ${ip} port 50234 ssh2`,
      }));
    },
  },
  ru2: {
    label: "RU-2 · Acceso nocturno",
    description: "Login exitoso de admin a las 03:15, fuera del horario habitual.",
    generate(rng) {
      const ip = `192.168.1.${randInt(rng, 50, 99)}`;
      return [{ message: `Jun 26 03:15:${pad(randInt(rng, 0, 59))} victima_ssh sshd[1025]: Accepted password for admin from ${ip} port 50235 ssh2` }];
    },
  },
  ru3: {
    label: "RU-3 · Pico de CPU",
    description: "Métrica de uso de CPU más de 3 desvíos por encima de lo normal.",
    generate(rng) {
      const ip = `192.168.1.${randInt(rng, 20, 30)}`;
      return [{ message: `${tsDiurno(rng)} victima_ssh systemd[1]: METRICA ANOMALA: SPIKE_CPU detectado al ${randInt(rng, 92, 99)}% (Desviacion > 3 sigma) en host ${ip}` }];
    },
  },
  ru6: {
    label: "RU-6 · Movimiento lateral",
    description: "La misma IP se autentica con éxito contra 6 hosts internos distintos (MITRE T1021.004).",
    generate(rng) {
      const ip = choice(rng, IPS_ATACANTES);
      const user = choice(rng, ["admin", "operador", "devops", "soporte"]);
      const hosts = ["srv-db01", "srv-web01", "srv-web02", "srv-files", "srv-backup", "srv-ci"];
      return hosts.map((host) => ({
        message: `${tsDiurno(rng)} ${host} sshd[${randInt(rng, 1000, 9999)}]: Accepted password for ${user} from ${ip} port ${randInt(rng, 40000, 60000)} ssh2`,
      }));
    },
  },
};

// Genera una ventana de eventos: tráfico orgánico + los ataques elegidos,
// intercalados al azar. `attack` guarda qué vector lo generó (ground truth).
export function generateWindow(seed, attackIds) {
  const rng = createRng(seed);
  const events = [];
  for (let i = 0; i < ORGANIC_EVENTS; i++) {
    events.push({ ...choice(rng, ORGANIC_GENERATORS)(rng), attack: null });
  }
  for (const id of attackIds) {
    for (const ev of ATTACKS[id].generate(rng)) {
      events.splice(randInt(rng, 0, events.length), 0, { ...ev, attack: id });
    }
  }
  return events.map((ev, i) => ({ ...ev, id: i }));
}

// --- Features (construir_features / separar_features) ------------------------

export const FEATURE_NAMES = ["hora_del_dia", "es_fallo_ssh", "es_exitoso_ssh", "puerto", "lon_mensaje", "es_spike", "freq_ip"];

function parseEvent(ev) {
  const m = ev.message;
  const hour = Number(m.match(/\b(\d{2}):(\d{2}):(\d{2})\b/)?.[1] ?? 12);
  const port = Number(m.match(/\bport (\d+)/)?.[1] ?? 22);
  const ip = m.match(/\bfrom (\d{1,3}(?:\.\d{1,3}){3})/)?.[1] ?? "";
  const hostname = m.split(" ")[3] ?? "";
  return { hour, port, ip, hostname };
}

export function buildFeatures(events) {
  const parsed = events.map(parseEvent);
  const ipCount = new Map();
  for (const p of parsed) if (p.ip) ipCount.set(p.ip, (ipCount.get(p.ip) ?? 0) + 1);

  const hostsByIp = new Map();
  events.forEach((ev, i) => {
    const p = parsed[i];
    if (ev.message.includes("Accepted") && p.ip) {
      if (!hostsByIp.has(p.ip)) hostsByIp.set(p.ip, new Set());
      hostsByIp.get(p.ip).add(p.hostname);
    }
  });

  return events.map((ev, i) => {
    const p = parsed[i];
    const accepted = ev.message.includes("Accepted");
    return {
      features: [
        p.hour,
        ev.message.includes("Failed") ? 1 : 0,
        accepted ? 1 : 0,
        p.port,
        ev.message.length,
        ev.message.includes("SPIKE_CPU") ? 1 : 0,
        p.ip ? ipCount.get(p.ip) : 1,
      ],
      hostsDistintos: accepted && p.ip ? hostsByIp.get(p.ip).size : 0,
    };
  });
}

// --- StandardScaler ----------------------------------------------------------

export function standardScale(X) {
  const n = X.length;
  const d = X[0].length;
  const mean = Array(d).fill(0);
  const std = Array(d).fill(0);
  for (const row of X) row.forEach((v, j) => (mean[j] += v / n));
  for (const row of X) row.forEach((v, j) => (std[j] += (v - mean[j]) ** 2 / n));
  for (let j = 0; j < d; j++) std[j] = Math.sqrt(std[j]) || 1;
  return X.map((row) => row.map((v, j) => (v - mean[j]) / std[j]));
}

// --- Isolation Forest --------------------------------------------------------

const EULER = 0.5772156649;
function avgPathLength(n) {
  if (n <= 1) return 0;
  if (n === 2) return 1;
  return 2 * (Math.log(n - 1) + EULER) - (2 * (n - 1)) / n;
}

function buildTree(X, idx, depth, maxDepth, rng) {
  if (depth >= maxDepth || idx.length <= 1) return { size: idx.length };
  const d = X[0].length;
  // Elige al azar un feature que no sea constante en este nodo.
  const order = Array.from({ length: d }, (_, j) => j);
  for (let i = d - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (const f of order) {
    let min = Infinity;
    let max = -Infinity;
    for (const i of idx) {
      if (X[i][f] < min) min = X[i][f];
      if (X[i][f] > max) max = X[i][f];
    }
    if (max > min) {
      const split = min + rng() * (max - min);
      const left = idx.filter((i) => X[i][f] < split);
      const right = idx.filter((i) => X[i][f] >= split);
      return {
        f,
        split,
        left: buildTree(X, left, depth + 1, maxDepth, rng),
        right: buildTree(X, right, depth + 1, maxDepth, rng),
      };
    }
  }
  return { size: idx.length };
}

function pathLength(x, node, depth = 0) {
  if (node.size !== undefined) return depth + avgPathLength(node.size);
  return pathLength(x, x[node.f] < node.split ? node.left : node.right, depth + 1);
}

export function isolationForest(X, seed = 42) {
  const rng = createRng(seed);
  const n = X.length;
  const sampleSize = Math.min(256, n);
  const maxDepth = Math.ceil(Math.log2(Math.max(sampleSize, 2)));
  const trees = [];
  for (let t = 0; t < IF_N_ESTIMATORS; t++) {
    const all = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    trees.push(buildTree(X, all.slice(0, sampleSize), 0, maxDepth, rng));
  }
  const c = avgPathLength(sampleSize);
  // score_samples de sklearn: -2^(-E[h(x)]/c(n)). Más negativo = más anómalo.
  const scores = X.map((x) => -(2 ** (-(trees.reduce((s, tr) => s + pathLength(x, tr), 0) / trees.length) / c)));
  // offset_ = percentil `contamination` de los scores; decision < 0 → anomalía.
  const sorted = [...scores].sort((a, b) => a - b);
  const pos = IF_CONTAMINATION * (n - 1);
  const lo = Math.floor(pos);
  const offset = sorted[lo] + (sorted[Math.min(lo + 1, n - 1)] - sorted[lo]) * (pos - lo);
  return scores.map((s) => ({ score: s, decision: s - offset, anomaly: s - offset < 0 }));
}

// --- DBSCAN ------------------------------------------------------------------

export function dbscan(X) {
  const n = X.length;
  const dist = (a, b) => Math.sqrt(a.reduce((s, v, j) => s + (v - b[j]) ** 2, 0));
  const neighbors = X.map((a) => X.map((b, j) => (dist(a, b) <= DBSCAN_EPS ? j : -1)).filter((j) => j !== -1));
  const labels = Array(n).fill(null);
  let cluster = 0;
  for (let i = 0; i < n; i++) {
    if (labels[i] !== null) continue;
    if (neighbors[i].length < DBSCAN_MIN_SAMPLES) {
      labels[i] = -1;
      continue;
    }
    labels[i] = cluster;
    const queue = [...neighbors[i]];
    while (queue.length) {
      const j = queue.shift();
      if (labels[j] === -1) labels[j] = cluster; // ruido que resulta ser borde
      if (labels[j] !== null) continue;
      labels[j] = cluster;
      if (neighbors[j].length >= DBSCAN_MIN_SAMPLES) queue.push(...neighbors[j]);
    }
    cluster++;
  }
  return labels;
}

// --- Pipeline completo -------------------------------------------------------

export function analyze(events) {
  const built = buildFeatures(events);
  const X = standardScale(built.map((b) => b.features));
  const iforest = isolationForest(X);
  const dbLabels = dbscan(X);

  const results = events.map((ev, i) => {
    const signals = {
      if: iforest[i].anomaly,
      dbscan: dbLabels[i] === -1,
      densidad: built[i].features[6] >= DENSIDAD_UMBRAL_FREQ,
      lateral: built[i].hostsDistintos >= DENSIDAD_UMBRAL_HOSTS,
    };
    const predicted = Object.values(signals).some(Boolean);
    const actual = ev.attack !== null;
    return { ...ev, signals, predicted, actual, ifScore: iforest[i].score, features: built[i].features };
  });

  const tp = results.filter((r) => r.predicted && r.actual).length;
  const fp = results.filter((r) => r.predicted && !r.actual).length;
  const fn = results.filter((r) => !r.predicted && r.actual).length;
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp + fn ? tp / (tp + fn) : 0;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;

  const bySignal = { if: 0, dbscan: 0, densidad: 0, lateral: 0 };
  for (const r of results) for (const k of Object.keys(bySignal)) if (r.signals[k]) bySignal[k]++;

  return { results, metrics: { tp, fp, fn, precision, recall, f1 }, bySignal };
}
