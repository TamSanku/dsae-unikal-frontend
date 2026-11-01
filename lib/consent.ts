import { API_BASE_URL } from './backend';

/*
 * Le choix du visiteur en matière de mesure d'audience.
 *
 * Deux clés, dans le navigateur : ce que le visiteur a décidé, et un
 * identifiant aléatoire qui ne le nomme pas. Tant qu'aucune décision n'a été
 * prise, le portail ne mesure rien — c'est le serveur qui le vérifie, pas
 * seulement ce fichier.
 */

export const CONSENT_KEY = 'dsae.cookie-consent';
export const VISITOR_KEY = 'dsae.visitor-id';
export const SESSION_KEY = 'dsae.visit-session';

export type ConsentChoice = 'accepted' | 'refused';

/** L'identifiant aléatoire du visiteur, créé au besoin. Il ne porte aucune
 * donnée personnelle : c'est un tirage, pas une identité. */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/** L'identifiant de l'onglet : il sépare deux onglets du même visiteur, pour
 * compter les visites sans les confondre. */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Le choix enregistré, ou `null` si le visiteur n'a pas encore tranché. */
export function getConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === 'accepted' || value === 'refused' ? value : null;
}

/** Le visiteur a-t-il accepté d'être mesuré ? Seul un « oui » compte. */
export function hasAnalyticsConsent(): boolean {
  return getConsent() === 'accepted';
}

/*
 * Le choix part au serveur : c'est ce qui lui permet de n'écrire que les vues
 * des visiteurs qui ont accepté, et de ne plus reposer la question à ceux qui
 * ont refusé. On ne bloque pas l'affichage du portail sur cet appel.
 */
async function sendConsent(analytics: boolean): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/analytics/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: getVisitorId(), analytics }),
      keepalive: true,
    });
  } catch {
    /* Le portail reste utilisable : le choix est déjà gardé dans le navigateur,
     * et repartira au prochain envoi. */
  }
}

/** Enregistre le choix et le transmet au serveur. */
export async function setConsent(analytics: boolean): Promise<void> {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_KEY, analytics ? 'accepted' : 'refused');
  if (analytics) getVisitorId();
  await sendConsent(analytics);
}

/** Le choix a-t-il été exprimé ? Sert au bandeau pour savoir s'il doit
 * s'afficher. */
export function hasDecided(): boolean {
  return getConsent() !== null;
}
