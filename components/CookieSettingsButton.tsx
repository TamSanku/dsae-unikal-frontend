'use client';

import { OPEN_CONSENT_EVENT } from './CookieConsent';

/*
 * « Gérer les cookies » : rouvre le bandeau de consentement depuis le pied de
 * page. Sans ce bouton, un visiteur qui a déjà tranché ne pourrait plus
 * changer d'avis — le choix ne doit pas être définitif.
 */
export default function CookieSettingsButton({ label = 'Gérer les cookies' }: { label?: string }) {
  return (
    <button
      type="button"
      className="legal-link-button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
    >
      {label}
    </button>
  );
}
