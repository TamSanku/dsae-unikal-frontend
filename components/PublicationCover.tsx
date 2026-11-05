'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BookIcon, DocumentIcon } from '@/components/icons';

/*
 * La couverture d'un document, au format A4.
 *
 * Un document n'est pas une vignette d'actualité : il se présente comme une
 * page — un rapport 1 / 1,414 (210 × 297 mm). Quand une image de couverture a
 * été publiée, elle remplit la page **sans aucun texte par-dessus** : le titre
 * et les signataires vivent à côté, dans la carte, jamais écrits sur l'image.
 *
 * Sans image, la page ne porte qu'un repère sobre (une icône) : elle ne recopie
 * pas le titre sur la couverture, pour ne jamais « écrire » sur une image.
 *
 * `placeholder` sert quand l'image du backend n'est pas une vraie couverture :
 * tous les documents d'un même import portent la même image décorative. La
 * carte montre alors un fond uni de la couleur de la catégorie, avec l'icône
 * d'un document — plus honnête qu'une image noire répétée à l'identique.
 */

/* Les tons de couverture, par domaine scientifique. Le repli « slate » couvre
 * un domaine inconnu sans laisser la carte sans couleur. */
const TONES: Record<string, string> = {
  'production vegetale': 'green',
  'production animale': 'amber',
  agroeconomie: 'blue',
  'gestion des ressources naturelles et renouvelables': 'teal',
};

/** La teinte d'une catégorie : un nom de ton, stable pour une même catégorie. */
export function categoryTone(category: string | null | undefined): string {
  const key = (category ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
  return TONES[key] ?? 'slate';
}

export default function PublicationCover({
  title,
  image,
  size = 'card',
  placeholder = false,
  tone = 'slate',
}: {
  title: string;
  image?: string | null;
  size?: 'card' | 'page';
  /** Vrai quand l'image n'est pas une couverture propre au document : on montre
   * alors le fond de catégorie plutôt qu'une image répétée. */
  placeholder?: boolean;
  /** Le ton de ce fond, tiré de la catégorie (`categoryTone`). */
  tone?: string;
}) {
  const cover = (image ?? '').trim();
  const [failed, setFailed] = useState(false);
  const showImage = cover && !failed && !placeholder;

  return (
    <div className={`publication-cover publication-cover-${size}`}>
      {showImage ? (
        <Image
          src={cover}
          alt={`Couverture — ${title}`}
          fill
          sizes={size === 'page' ? '(max-width: 980px) 100vw, 460px' : '(max-width: 980px) 100vw, 420px'}
          onError={() => setFailed(true)}
        />
      ) : placeholder ? (
        <div className={`publication-cover-placeholder tone-${tone}`} aria-hidden="true">
          <DocumentIcon size={size === 'page' ? 40 : 26} />
        </div>
      ) : (
        <div className="publication-cover-blank" aria-hidden="true">
          <BookIcon size={size === 'page' ? 44 : 32} />
        </div>
      )}
    </div>
  );
}
