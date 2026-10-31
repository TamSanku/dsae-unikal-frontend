import Link from 'next/link';
import { notFound } from 'next/navigation';
import { downloadUrl, getPublicationById, getPublicationReviews } from '@/lib/backend';
import { DownloadIcon, ReadIcon } from '@/components/icons';
import PublicationCover from '@/components/PublicationCover';
import PublicationReviews from '@/components/PublicationReviews';
import StarRating from '@/components/StarRating';
import ContentBlocks from '@/components/ContentBlocks';

export default async function PublicationDetailPage({ params }: { params: { id: string } }) {
  const publication = await getPublicationById(params.id);

  if (!publication) {
    notFound();
  }

  /* Les avis sont lus à part : la fiche les montre, et la note de la carte
   * vient de la même source. Sans avis, la section le dit — rien n'est inventé. */
  const { reviews, summary } = await getPublicationReviews(publication.entryId);

  const document = publication.documentUrl;

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container publication-detail">
          <div className="publication-detail-cover">
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
                <p>{publication.authorsList.join(', ')}</p>
              </div>
            )}

            <div className="publication-meta">
              {publication.publishedLabel && <span>{publication.publishedLabel}</span>}
              {publication.category && <span>{publication.category}</span>}
              {publication.department && <span>{publication.department}</span>}
            </div>

            <StarRating value={summary.average} count={summary.count} size={20} />

            <div className="publication-actions">
              {document ? (
                <>
                  <a href={document} className="btn btn-primary" target="_blank" rel="noreferrer">
                    <ReadIcon /> Lire
                  </a>
                  <a href={downloadUrl(document)} className="btn btn-secondary">
                    <DownloadIcon /> Télécharger
                  </a>
                </>
              ) : (
                <p className="publication-nodoc">
                  Aucun document joint à cette publication pour le moment.
                </p>
              )}
            </div>

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
