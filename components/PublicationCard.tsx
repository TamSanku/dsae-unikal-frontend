'use client';

import Link from 'next/link';
import type { Publication } from '@/lib/backend';
import AuthorList from '@/components/AuthorList';
import PublicationCover, { categoryTone } from '@/components/PublicationCover';
import StarRating from '@/components/StarRating';

/*
 * La carte d'un document, dans le catalogue.
 *
 * Une seule carte, deux dispositions : à plat sur téléphone (couverture à
 * gauche, texte à droite) et debout ailleurs (couverture au-dessus). L'ordre du
 * texte ne change pas — titre, auteurs, catégorie, date, note — et la carte
 * garde la même hauteur que ses voisines d'une même ligne : la grille les étire,
 * la carte est une colonne flexible, et le pied (la note) est poussé en bas.
 *
 * Rien n'est écrit sur la couverture, et rien n'est inventé : un document sans
 * image propre reçoit un fond de la couleur de sa catégorie, avec une icône.
 * Toute la carte est cliquable ; le titre reste un lien pour le clavier.
 */

export default function PublicationCard({
  publication,
  variant = 'vertical',
  placeholder = false,
}: {
  publication: Publication;
  variant?: 'vertical' | 'horizontal';
  /** Vrai quand la couverture du backend n'est pas propre au document (même
   * image pour plusieurs) : la carte montre alors le fond de catégorie. */
  placeholder?: boolean;
}) {
  const href = `/publications/${publication.id}`;
  const tone = categoryTone(publication.domain || publication.category);
  const date = publication.publishedShortLabel || publication.publishedLabel;
  const badge = publication.category || publication.domain;

  return (
    <article className={`pub-card pub-card-${variant}`}>
      <Link href={href} className="pub-card-link" aria-label={`Ouvrir « ${publication.title} »`}>
        <PublicationCover
          title={publication.title}
          image={publication.coverUrl}
          placeholder={placeholder}
          tone={tone}
        />

        <div className="pub-card-body">
          <h3 className="pub-card-title">{publication.title}</h3>
          <AuthorList authors={publication.authorsList} compact />
          {badge && <span className="pub-card-badge">{badge}</span>}
          {date && <span className="pub-card-date">{date}</span>}
          {/* Le pied, poussé en bas par `margin-top: auto` : les notes d'une
           * même ligne s'alignent, quelle que soit la longueur du titre. */}
          <span className="pub-card-rating">
            <StarRating
              value={publication.reviewSummary.average}
              count={publication.reviewSummary.count}
              size={14}
              compact
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
