'use client';

import { useState, type ReactNode } from 'react';

/*
 * Les trois volets de « S'engager » : proposer un partenariat, nous contacter,
 * nos partenaires. Trois onglets horizontaux, un seul volet visible à la fois.
 * Le contenu de chaque volet est fourni par la page — ce composant ne fait que
 * la mécanique des onglets.
 */
export default function EngagerTabs({
  panels,
}: {
  panels: { key: string; label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(panels[0]?.key ?? '');

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
