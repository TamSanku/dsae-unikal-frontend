'use client';

import { useEffect, useState, type ReactNode } from 'react';

/*
 * Les volets de « Aide et support » : FAQ, guides d'utilisation, signalement.
 *
 * Trois onglets alignés sur une seule ligne (même dessin que les autres
 * catalogues) ; un seul volet est visible à la fois — choisir « FAQ » ne montre
 * que la FAQ. Le contenu de chaque volet est fourni par la page.
 *
 * Le volet ouvert suit l'ancre de l'adresse (`/aide#faq`, `/aide#guides`,
 * `/aide#signaler`) : les liens de l'en-tête et du pied de page ouvrent donc
 * directement le bon volet. Un clic met l'ancre à jour, pour que l'adresse
 * reste partageable.
 */
export default function AideTabs({
  panels,
  initialTab = '',
}: {
  panels: { key: string; label: string; content: ReactNode }[];
  initialTab?: string;
}) {
  const known = panels.map((panel) => panel.key);
  const first = panels[0]?.key ?? '';
  const [active, setActive] = useState(known.includes(initialTab) ? initialTab : first);

  /* L'ancre de l'adresse ouvre le volet voulu, y compris quand on arrive d'une
   * autre page (`/aide#signaler`) ou que l'on change d'ancre sur place. */
  useEffect(() => {
    const applyHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (known.includes(hash)) setActive(hash);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (key: string) => {
    setActive(key);
    /* L'ancre suit le volet : l'adresse reste partageable, sans recharger. */
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${key}`);
    }
  };

  return (
    <div className="aide-tabs page-enter">
      <div className="container">
        <div className="catalog-tabs" role="tablist" aria-label="Aide et support">
          {panels.map((panel) => (
            <button
              key={panel.key}
              type="button"
              role="tab"
              aria-selected={active === panel.key}
              className={active === panel.key ? 'catalog-tab active' : 'catalog-tab'}
              onClick={() => choose(panel.key)}
            >
              {panel.label}
            </button>
          ))}
        </div>
      </div>

      <div className="aide-panel" role="tabpanel">
        {panels.find((panel) => panel.key === active)?.content}
      </div>
    </div>
  );
}
