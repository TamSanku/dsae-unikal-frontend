'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getConsent, setConsent } from '@/lib/consent';

/*
 * La demande aux visiteurs au sujet des cookies.
 *
 * Elle s'affiche tant que le visiteur n'a pas tranché, et propose deux issues
 * claires : accepter la mesure d'audience, ou la refuser. Refuser n'enlève
 * rien au portail — aucun contenu n'est conditionné au consentement. Le choix
 * est gardé dans le navigateur et transmis au serveur.
 *
 * Le choix n'est pas définitif : le pied de page peut rouvrir le bandeau (voir
 * CookieSettingsButton), pour changer d'avis plus tard.
 */

/** L'évènement qui rouvre le bandeau depuis n'importe où dans la page. */
export const OPEN_CONSENT_EVENT = 'dsae:open-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    /* Rien n'est affiché tant que le choix enregistré n'a pas été relu, pour
     * éviter que le bandeau clignote à chaque page. */
    if (getConsent() === null) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const decide = async (analytics: boolean) => {
    setBusy(true);
    await setConsent(analytics);
    setBusy(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Préférences de cookies">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-text">
          <strong>Votre vie privée</strong>
          <p>
            Nous utilisons un identifiant anonyme pour mesurer l’audience du portail — pages
            consultées, durée de lecture, provenance, pays et type d’appareil — afin d’améliorer le
            site. Aucune donnée personnelle n’est revendue, et l’adresse IP n’est pas conservée.
            Vous pouvez accepter ou refuser&nbsp;: le portail reste entièrement accessible.
          </p>
          <Link href="/politique-de-confidentialite" className="cookie-consent-link">
            En savoir plus
          </Link>
        </div>

        <div className="cookie-consent-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => decide(false)}
            disabled={busy}
          >
            Refuser
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => decide(true)}
            disabled={busy}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
