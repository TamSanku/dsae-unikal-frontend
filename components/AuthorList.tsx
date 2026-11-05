'use client';

import { useState } from 'react';

/*
 * Les signataires d'un document.
 *
 * La liste montre un seul nom, même quand ils sont plusieurs : « Amina Kabila
 * et 2 autres ». Un clic déplie la liste entière, un second la replie. Rien
 * n'est tronqué en silence — le nom caché reste accessible.
 *
 * Le nom du premier signataire tient toujours sur une ligne : la carte est
 * étroite (six blocs au bureau), un nom long y déborde vite. Il est donc coupé
 * d'un « … » à la fin de la ligne, et le nom entier s'affiche au survol
 * (`title`). Le bouton « +N autres » passe à la ligne suivante : à côté du nom,
 * il ne lui laissait que quelques caractères.
 */
export default function AuthorList({
  authors,
  compact = false,
}: {
  authors: string[];
  /** Le format des cartes : une seule ligne, le premier nom puis un badge
   * « +N », sans bouton ni dépliage. La liste entière reste lisible au survol. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const names = authors.filter((name) => name.trim());

  if (names.length === 0) return null;

  if (compact) {
    const others = names.length - 1;
    return (
      <span className="pub-authors" title={names.join(', ')}>
        <span className="pub-authors-name">{names[0]}</span>
        {others > 0 && <span className="pub-authors-more">+{others}</span>}
      </span>
    );
  }

  if (names.length === 1) {
    return (
      <p className="publication-authors" title={names[0]}>
        <span className="publication-authors-line">
          <span className="publication-authors-primary">{names[0]}</span>
        </span>
      </p>
    );
  }

  const others = names.length - 1;

  return (
    <p className="publication-authors" title={names.join(', ')}>
      {/* Le nom occupe la ligne ; le bouton « +N autres » se place dessous,
       * pour ne pas rogner le nom. La liste dépliée prend encore la ligne
       * suivante et s'étale sur plusieurs lignes. */}
      <span className="publication-authors-line">
        <span className="publication-authors-primary">{names[0]}</span>
        <button
          type="button"
          className="author-toggle"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'masquer les autres' : `+${others} ${others > 1 ? 'autres' : 'autre'}`}
        </button>
      </span>
      {open && <span className="publication-authors-rest"> — {names.slice(1).join(', ')}</span>}
    </p>
  );
}
