import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { downloadUrl, getPublicationById, getPublicationReviews } from '@/lib/backend';
import { documentKind } from '@/lib/document-kind';
import PublicationCover from '@/components/PublicationCover';
import PublicationReviews from '@/components/PublicationReviews';
import StarRating from '@/components/StarRating';
import ContentBlocks from '@/components/ContentBlocks';
import DocumentActions from '@/components/DocumentActions';

/* Le titre de l'onglet porte le titre de la publication : c'est ce titre que la
 * mesure d'audience retient comme libellé de la fiche. */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const publication = await getPublicationById(params.id);
  return { title: publication?.title ?? 'Publication' };
}

export default async function PublicationDetailPage({ params }: { params: { id: string } }) {
  const publication = await getPublicationById(params.id);

  if (!publication) {
    notFound();
  }

  /* Les avis sont lus à part : la fiche les montre, et la note de la carte
   * vient de la même source. Sans avis, la section le dit — rien n'est inventé. */
  const { reviews, summary } = await getPublicationReviews(publication.entryId);

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
              download={downloadUrl(publication.documentUrl)}
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
