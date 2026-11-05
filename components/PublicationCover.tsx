'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BookIcon } from '@/components/icons';

/*
 * La couverture d'un document, au format A4.
 *
 * Un document n'est pas une vignette d'actualité : il se présente comme une
 * page — un rapport 1 / 1,414 (210 × 297 mm). Quand une image de couverture a
 * été publiée dans l'espace de gestion, elle remplit la page **sans aucun texte
 * par-dessus** : le titre et les signataires vivent à côté, dans la carte,
 * jamais écrits sur l'image.
 *
 * Sans image (ou si l'image ne se charge pas), la page ne porte qu'un repère
 * sobre — une icône — sans recopier le titre.
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
  const showImage = cover && !failed;

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
      ) : (
        <div className="publication-cover-blank" aria-hidden="true">
          <BookIcon size={size === 'page' ? 44 : 32} />
        </div>
      )}
    </div>
  );
}
