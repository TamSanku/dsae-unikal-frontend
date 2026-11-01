'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/*
 * Le carrousel « à lire aussi », en fin de fiche.
 *
 * Il fait défiler d'autres documents ou d'autres actualités, côte à côte, dans
 * le même sens que le bandeau des partenaires mais à la main : on glisse, ou on
 * avance d'un cran avec les flèches. Rien ne bouge tout seul — une fiche se lit
 * à son rythme.
 *
 * Les cartes sont écrites par la page (côté serveur) et passées ici toutes
 * faites : chaque section garde sa carte, et ce composant ne s'occupe que du
 * défilement. Sans autre contenu, il ne s'affiche pas.
 */
export default function RelatedCarousel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      track.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges]);

  /* Un cran : la largeur d'une carte, mesurée sur place — la mise en page
   * décide, pas une valeur écrite en dur. */
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const width = first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * width, behavior: 'smooth' });
  };

  return (
    <section className="section alt-section related-section" aria-label={title}>
      <div className="container">
        <div className="related-head">
          <div className="section-heading">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h3>{title}</h3>
          </div>
          <div className="related-nav">
            <button
              type="button"
              className="related-arrow"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Voir les précédents"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              className="related-arrow"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Voir les suivants"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="related-track" ref={trackRef} tabIndex={0} role="group" aria-label={title}>
          {children}
        </div>
      </div>
    </section>
  );
}
