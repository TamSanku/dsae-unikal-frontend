'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackInteraction, trackPageView } from '@/lib/tracker';

/*
 * Le guetteur de navigation : à chaque changement de page, il annonce la vue
 * au backend, et — quand la page est une fiche — la visite de cette fiche. Il
 * écoute aussi les clics sur les liens, pour savoir ce qui est suivi depuis le
 * portail.
 *
 * Il ne décide de rien : la règle du consentement vit dans `lib/tracker.ts` et,
 * en dernier ressort, sur le serveur.
 */

/* Les fiches, reconnues à leur adresse : `/actualites/<slug>`, etc. Le premier
 * segment dit la famille, le second désigne la fiche. */
const ENTITY_SECTIONS: Record<string, string> = {
  actualites: 'actualite',
  publications: 'publication',
  alumni: 'alumni',
  equipe: 'membre',
  recherche: 'axe',
};

function entityOf(pathname: string): { type: string; id: string } | null {
  const parts = (pathname || '').split('/').filter(Boolean);
  if (parts.length !== 2) return null;
  const type = ENTITY_SECTIONS[parts[0]];
  return type ? { type, id: parts[1] } : null;
}

/* Le titre de l'onglet porte le nom du site ; le libellé d'une fiche, lui, n'a
 * besoin que du titre de la fiche. */
function pageTitle(): string {
  return document.title.replace(/\s*\|\s*DSAE UNIKAL\s*$/i, '').trim();
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname || '/';
    trackPageView(path, document.title);

    const entity = entityOf(path);
    if (entity) {
      trackInteraction({
        kind: 'entity',
        entityType: entity.type,
        entityId: entity.id,
        label: pageTitle(),
        path,
      });
    }
  }, [pathname]);

  /* Les clics sur les liens : où ils mènent, et depuis quelle page. On ne
   * mesure que les liens — jamais les boutons, qui n'ont pas de destination. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      /* Un lien déjà mesuré pour ce qu'il est (un téléchargement) ne doit pas
       * être compté deux fois. */
      if (anchor.hasAttribute('data-track-skip')) return;
      const href = anchor.getAttribute('href') ?? '';
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      trackInteraction({
        kind: 'click',
        target: href,
        label: (anchor.textContent ?? '').trim().slice(0, 120),
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
