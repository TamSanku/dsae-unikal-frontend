'use client';

import { useEffect, useState, type ReactNode } from 'react';

/*
 * Les trois volets de « S'engager » : proposer un partenariat, nous contacter,
 * nos partenaires. Trois onglets horizontaux, un seul volet visible à la fois.
 * Le contenu de chaque volet est fourni par la page — ce composant ne fait que
 * la mécanique des onglets.
 *
 * Le volet ouvert suit l'adresse (`?volet=`) : un lien du pied de page peut donc
 * ouvrir directement « Nos partenaires », et le reste de la page ne bouge pas.
 */
export default function EngagerTabs({
  panels,
  initialTab = '',
}: {
  panels: { key: string; label: string; content: ReactNode }[];
  initialTab?: string;
}) {
  const [active, setActive] = useState(
    panels.some((panel) => panel.key === initialTab) ? initialTab : panels[0]?.key ?? ''
  );

  /* Les clés, réduites à une chaîne : l'effet ci-dessous n'a pas besoin de
   * surveiller le tableau, qui est refait à chaque rendu. */
  const validKeys = panels.map((panel) => panel.key).join('|');

  /* Un lien qui ne change que la requête réutilise le même composant : l'onglet
   * doit suivre la nouvelle adresse. */
  useEffect(() => {
    if (initialTab && validKeys.split('|').includes(initialTab)) setActive(initialTab);
  }, [initialTab, validKeys]);

  return (
    <div className="engager-tabs">
      <div className="catalog-tabs" role="tablist" aria-label="S’engager">
        {panels.map((panel) => (
          <button
            key={panel.key}
            type="button"
            role="tab"
            aria-selected={active === panel.key}
            className={active === panel.key ? 'catalog-tab active' : 'catalog-tab'}
            onClick={() => setActive(panel.key)}
          >
            {panel.label}
          </button>
        ))}
      </div>

      <div className="engager-panel" role="tabpanel">
        {panels.find((panel) => panel.key === active)?.content}
      </div>
    </div>
  );
}
