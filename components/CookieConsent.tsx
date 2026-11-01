'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getConsent, setConsent } from '@/lib/consent';

/*
 * Le bandeau demande le choix du visiteur pour la mesure d’audience.
 * Le choix reste modifiable depuis le bouton de gestion des cookies du footer.
 */

/** Évènement qui rouvre le bandeau depuis le pied de page. */
export const OPEN_CONSENT_EVENT = 'dsae:open-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const choice = getConsent();
    setAnalyticsEnabled(choice === 'accepted');
    if (choice === null) setVisible(true);

    const reopen = () => {
      setAnalyticsEnabled(getConsent() === 'accepted');
      setCustomizing(false);
      setVisible(true);
    };
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
    <div
      className="cookie-consent"
      role="dialog"
      aria-live="polite"
      aria-labelledby="cookie-consent-title"
    >
      <div className="cookie-consent-inner">
        <div className="cookie-consent-text">
          <strong id="cookie-consent-title">Gestion de cookies</strong>
          <p>
            Nous utilisons un identifiant anonyme pour mesurer l’audience du portail. Cela comprend
            les pages consultées, la durée de lecture, la provenance, le pays et le type d’appareil,
            afin d’améliorer le site. Aucune donnée personnelle n’est revendue, et l’adresse IP
            n’est pas conservée. Vous pouvez accepter ou refuser : le portail reste entièrement
            accessible.
          </p>
          <Link href="/politique-de-confidentialite" className="cookie-consent-link">
            En savoir plus
          </Link>

          <div
            id="cookie-consent-customization"
            className="cookie-consent-customization"
            hidden={!customizing}
          >
            <p>Choisissez si vous autorisez la mesure d’audience anonyme. Le portail reste accessible sans cette mesure.</p>
            <label className="cookie-consent-toggle-row" htmlFor="cookie-analytics-choice">
              <input
                id="cookie-analytics-choice"
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                disabled={busy}
              />
              <span>Autoriser la mesure d’audience</span>
            </label>
            <button
              type="button"
              className="btn btn-primary cookie-consent-save"
              onClick={() => decide(analyticsEnabled)}
              disabled={busy}
            >
              Enregistrer mes choix
            </button>
          </div>
        </div>

        <div className="cookie-consent-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => decide(true)}
            disabled={busy}
          >
            Accepter
          </button>
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
            className="btn btn-secondary"
            aria-expanded={customizing}
            aria-controls="cookie-consent-customization"
            onClick={() => setCustomizing((current) => !current)}
            disabled={busy}
          >
            Personnaliser
          </button>
        </div>
      </div>
    </div>
  );
}
