import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  downloadUrl,
  getPublicationById,
  getPublicationReviews,
  getPublications,
} from '@/lib/backend';
import { documentKind } from '@/lib/document-kind';
import PublicationCover from '@/components/PublicationCover';
import PublicationReviews from '@/components/PublicationReviews';
import StarRating from '@/components/StarRating';
import ContentBlocks from '@/components/ContentBlocks';
import DocumentActions from '@/components/DocumentActions';
import RelatedCarousel from '@/components/RelatedCarousel';
import AuthorList from '@/components/AuthorList';

/* L'adresse publique du site, pour que le lien cité ramène bien à la fiche. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dsae-unikal-frontend.vercel.app';

/* Le titre de l'onglet porte le titre de la publication : c'est ce titre que la
 * mesure d'audience retient comme libellé de la fiche. */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const publication = await getPublicationById(params.id);
  return { title: publication?.title ?? 'Publication' };
}

export default async function PublicationDetailPage({ params }: { params: { id: string } }) {
  const [publication, allPublications] = await Promise.all([
    getPublicationById(params.id),
    getPublications(),
  ]);

  if (!publication) {
    notFound();
  }

  /* Les avis sont lus à part : la fiche les montre, et la note de la carte
   * vient de la même source. Sans avis, la section le dit — rien n'est inventé. */
  const { reviews, summary } = await getPublicationReviews(publication.entryId);

  /* Les autres documents, le même domaine d'abord : la suite la plus proche du
   * sujet que l'on vient d'ouvrir, puis le reste du catalogue. */
  const others = allPublications.filter((entry) => entry.id !== publication.id);
  const sameDomain = others.filter(
    (entry) => publication.domain && entry.domain === publication.domain
  );
  const rest = others.filter((entry) => !sameDomain.includes(entry));
  const related = [...sameDomain, ...rest].slice(0, 12);

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container publication-detail">
          <div className="publication-detail-cover">
            <Link href="/publications" className="btn btn-secondary back-to-catalog">
              ← Retour au catalogue
            </Link>
            <PublicationCover
              title={publication.title}
              image={publication.coverUrl}
              size="page"
            />
          </div>

          <div className="detail-copy">
            <h1>{publication.title}</h1>
            {publication.subtitle && <p className="publication-subtitle">{publication.subtitle}</p>}

            {publication.authorsList.length > 0 && (
              <div className="publication-byline">
                <span className="publication-byline-label">
                  {publication.authorsList.length > 1 ? 'Auteurs' : 'Auteur'}
                </span>
                <ol className="publication-author-list">
                  {publication.authorsList.map((author, index) => (
                    <li key={`${author}-${index}`}>{author}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="publication-meta">
              {publication.publishedLabel && <span>{publication.publishedLabel}</span>}
              {publication.category && <span>{publication.category}</span>}
              {publication.domain && <span>{publication.domain}</span>}
              {publication.level && <span>{publication.level}</span>}
              {publication.department && <span>{publication.department}</span>}
            </div>

            <StarRating value={summary.average} count={summary.count} size={20} />

            <DocumentActions
              url={publication.documentUrl}
              kind={documentKind(publication.documentName, publication.documentUrl)}
              title={publication.title}
              download={downloadUrl(publication.documentUrl)}
              /* La référence se compose avec les données de la fiche : le
                 lecteur n'invente ni revue, ni volume, ni numéro de pages. */
              citation={{
                title: publication.title,
                authors: publication.authorsList,
                year: publication.year,
                siteName: 'DSAE UNIKAL',
                url: `${SITE_URL}/publications/${publication.id}`,
                domain: publication.domain,
              }}
            />

            {publication.summary && (
              <div className="info-list-block">
                <h3>Résumé</h3>
                <p>{publication.summary}</p>
              </div>
            )}

            <ContentBlocks blocks={publication.blocks} />

            <PublicationReviews entryId={publication.entryId} initialReviews={reviews} initialSummary={summary} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <RelatedCarousel eyebrow="Poursuivre" title="Autres documents du catalogue">
          {related.map((entry) => (
            <article key={entry.id} className="publication-card publication-card-cover">
              <Link
                href={`/publications/${entry.id}`}
                className="publication-cover-link"
                aria-label={`Ouvrir « ${entry.title} »`}
              >
                <PublicationCover title={entry.title} image={entry.coverUrl} />
              </Link>
              <div className="publication-card-body">
                <h4>
                  <Link href={`/publications/${entry.id}`}>{entry.title}</Link>
                </h4>
                <AuthorList authors={entry.authorsList} />
                {entry.publishedLabel && <p className="publication-date">{entry.publishedLabel}</p>}
              </div>
            </article>
          ))}
        </RelatedCarousel>
      )}

      <section className="section cta-band small">
        <div className="container cta-content">
          <div>
            <span className="eyebrow">Retour</span>
            <h3>Consultez d’autres productions scientifiques.</h3>
          </div>
          <Link href="/publications" className="btn btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
