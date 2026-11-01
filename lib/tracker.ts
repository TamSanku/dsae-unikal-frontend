import { API_BASE_URL } from './backend';
import { getSessionId, getVisitorId, hasAnalyticsConsent } from './consent';

/*
 * La mesure d'une visite, côté navigateur.
 *
 * Rien n'est envoyé tant que le visiteur n'a pas accepté. Une page vue part à
 * l'arrivée sur la page ; la durée est envoyée à la sortie (onglet caché,
 * fermeture) et à chaque changement de page. Le serveur ne reçoit que des
 * faits : la page, le temps passé, la provenance — jamais l'adresse IP, qu'il
 * calcule puis oublie lui-même.
 */

type TrackerState = {
  eventId: string | null;
  path: string;
  startedAt: number;
  active: boolean;
};

const state: TrackerState = { eventId: null, path: '', startedAt: 0, active: false };

function post(path: string, body: unknown, keepalive = false): void {
  const url = `${API_BASE_URL}${path}`;
  const payload = JSON.stringify(body);
  /* À la fermeture de l'onglet, `fetch` peut être coupé : `sendBeacon` est le
   * seul envoi qui survit. Ailleurs, `fetch` avec `keepalive` suffit. */
  if (keepalive && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      return;
    } catch {
      /* On retombe sur `fetch` si le beacon est refusé. */
    }
  }
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive,
  }).catch(() => undefined);
}

/** Envoie la durée de la page en cours, puis remet le compteur à zéro. */
export function flushDuration(keepalive = false): void {
  if (!state.active || !state.eventId) return;
  const durationMs = Math.max(0, Date.now() - state.startedAt);
  if (durationMs < 1000) return;
  post(
    '/analytics/heartbeat',
    { eventId: state.eventId, visitorId: getVisitorId(), sessionId: getSessionId(), durationMs },
    keepalive,
  );
  state.startedAt = Date.now();
}

/** Annonce une page vue, et démarre le compteur de durée. */
export function trackPageView(path: string, title: string): void {
  if (!hasAnalyticsConsent()) return;
  /* La page précédente est close avant d'ouvrir la suivante. */
  flushDuration();
  state.active = true;
  state.eventId = null;
  state.path = path;
  state.startedAt = Date.now();

  fetch(`${API_BASE_URL}/analytics/pageview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      path,
      title,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      screen: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
    }),
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      /* La réponse dit si la vue a été retenue : sans consentement, elle ne
       * l'est pas, et il n'y a alors rien à chronométrer. */
      if (data?.tracked && data.eventId) state.eventId = data.eventId as string;
      else state.active = false;
    })
    .catch(() => {
      state.active = false;
    });
}

/* Les sorties de page : cacher l'onglet, le fermer, changer de page. */
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => flushDuration(true));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushDuration(true);
    else state.startedAt = Date.now();
  });
}
