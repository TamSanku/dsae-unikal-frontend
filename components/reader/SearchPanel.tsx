'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/*
 * La recherche dans le document.
 *
 * Un champ, un compteur, deux flèches. Le compteur dit « 3 sur 17 » : on sait
 * où l'on en est et combien il reste, sans ouvrir une liste de résultats qui
 * masquerait le document.
 *
 * La recherche ne modifie rien : elle souligne le mot dans le texte, et rien
 * d'autre. Le surlignage de recherche est visuel et temporaire — il ne se
 * confond pas avec les annotations du visiteur, qui sont des gestes gardés.
 */

export type SearchHit = { page: number; text: string };

export default function SearchPanel({
  query,
  onQueryChange,
  hits,
  active,
  onStep,
  onClose,
  /** Le format cherche-t-il page par page, ou dans un flux continu ? */
  paged,
  /** Le nombre de résultats est-il connu sans attendre ? */
  pending,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  hits: SearchHit[];
  active: number;
  onStep: (delta: number) => void;
  onClose: () => void;
  paged: boolean;
  pending: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* Le champ prend le focus à l'ouverture : on ouvre la recherche pour taper,
   * pas pour regarder. */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const total = hits.length;
  const label = useMemo(() => {
    if (pending) return 'Recherche…';
    if (!query) return '';
    if (total === 0) return 'Aucun résultat';
    return `${active} sur ${total}`;
  }, [pending, query, total, active]);

  return (
    <div className="reader-search" role="search" data-search-skip>
      <input
        ref={inputRef}
        type="search"
        className="reader-search-input"
        placeholder="Rechercher dans le document"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onStep(event.shiftKey ? -1 : 1);
          }
        }}
        aria-label="Mot à rechercher dans le document"
      />

      <span className="reader-search-count" aria-live="polite">
        {label}
      </span>

      <button
        type="button"
        className="reader-search-step"
        onClick={() => onStep(-1)}
        disabled={total === 0}
        aria-label="Résultat précédent"
        title="Résultat précédent (Maj+Entrée)"
      >
        ↑
      </button>
      <button
        type="button"
        className="reader-search-step"
        onClick={() => onStep(1)}
        disabled={total === 0}
        aria-label="Résultat suivant"
        title="Résultat suivant (Entrée)"
      >
        ↓
      </button>

      <button
        type="button"
        className="reader-search-close"
        onClick={onClose}
        aria-label="Fermer la recherche"
        title="Fermer la recherche (Échap)"
      >
        ×
      </button>

      {paged && total > 0 && <span className="reader-search-page">page {hits[active - 1]?.page}</span>}
    </div>
  );
}
