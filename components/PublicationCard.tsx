'use client';

import Link from 'next/link';
import type { Publication } from '@/lib/backend';
import AuthorList from '@/components/AuthorList';
import PublicationCover from '@/components/PublicationCover';
import StarRating from '@/components/StarRating';

/*
 * La carte d'un document, dans le catalogue.
 *
 * Une seule carte : la couverture au-dessus, le texte dessous. L'ordre du
 * texte ne change pas — titre, auteurs, date, note — et la carte garde la même
 * hauteur que ses voisines d'une même ligne : la grille les étire, la carte est
 * une colonne flexible, et la note est poussée en bas.
 *
 * La catégorie du document (« Article de recherche »…) n'est **pas** écrite sur
 * la carte : c'est le nom de l'étagère qui la porte déjà. La couverture est
 * celle publiée dans l'espace de gestion, montrée telle quelle. Toute la carte
 * est cliquable ; le titre reste un lien pour le clavier.
 */

export default function PublicationCard({ publication }: { publication: Publication }) {
  const href = `/publications/${publication.id}`;
  const date = publication.publishedShortLabel || publication.publishedLabel;

  return (
    <article className="pub-card">
      <Link href={href} className="pub-card-link" aria-label={`Ouvrir « ${publication.title} »`}>
        <PublicationCover title={publication.title} image={publication.coverUrl} />

        <div className="pub-card-body">
          <h3 className="pub-card-title">{publication.title}</h3>
          <AuthorList authors={publication.authorsList} compact />
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
