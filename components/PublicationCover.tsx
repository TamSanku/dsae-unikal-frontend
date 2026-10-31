'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BookIcon } from '@/components/icons';

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
 */
export default function PublicationCover({
  title,
  image,
  size = 'card',
}: {
  title: string;
  image?: string | null;
  size?: 'card' | 'page';
}) {
  const cover = (image ?? '').trim();
  const [failed, setFailed] = useState(false);

  return (
    <div className={`publication-cover publication-cover-${size}`}>
      {cover && !failed ? (
        <Image
          src={cover}
          alt={`Couverture — ${title}`}
          fill
          sizes={size === 'page' ? '(max-width: 980px) 100vw, 460px' : '(max-width: 980px) 100vw, 420px'}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="publication-cover-blank" aria-hidden="true">
          <BookIcon size={size === 'page' ? 44 : 32} />
        </div>
      )}
    </div>
  );
}
