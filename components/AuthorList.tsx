'use client';

import { useState } from 'react';

/*
 * Les signataires d'un document.
 *
 * La liste montre un seul nom, même quand ils sont plusieurs : « Amina Kabila
 * et 2 autres ». Un clic déplie la liste entière, un second la replie. Rien
 * n'est tronqué en silence — le nom caché reste accessible.
 */
export default function AuthorList({ authors }: { authors: string[] }) {
  const [open, setOpen] = useState(false);
  const names = authors.filter((name) => name.trim());

  if (names.length === 0) return null;

  if (names.length === 1) {
    return <p className="publication-authors">{names[0]}</p>;
  }

  const others = names.length - 1;

  return (
    <p className="publication-authors">
      <span className="publication-authors-primary">{names[0]}</span>
      <button
        type="button"
        className="author-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'masquer les autres' : `+${others} ${others > 1 ? 'autres' : 'autre'}`}
      </button>
      {open && <span className="publication-authors-rest"> — {names.slice(1).join(', ')}</span>}
    </p>
  );
}
