import Link from 'next/link';
import { notFound } from 'next/navigation';
import { downloadUrl, getPublicationById } from '@/lib/backend';
import { DownloadIcon, ReadIcon } from '@/components/icons';
import PublicationCover from '@/components/PublicationCover';

export default async function PublicationDetailPage({ params }: { params: { id: string } }) {
  const publication = await getPublicationById(params.id);

  if (!publication) {
    notFound();
  }

  const document = publication.documentUrl;

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container publication-detail">
          <div className="publication-detail-cover">
            <PublicationCover
              title={publication.title}
              authors={publication.authors}
              category={publication.category}
              image={publication.coverUrl}
              size="page"
            />
          </div>

          <div className="detail-copy">
            {publication.category && <span className="mini-tag">{publication.category}</span>}
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

            <div className="meta-row wide-row">
              {publication.year > 0 && <span>{publication.year}</span>}
              {publication.discipline && <span>{publication.discipline}</span>}
              {publication.department && <span>{publication.department}</span>}
            </div>

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

            {publication.keywords.length > 0 && (
              <div className="info-list-block">
                <h3>Mots-clés</h3>
                <div className="pill-list">
                  {publication.keywords.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              </div>
            )}

            {publication.references && (
              <div className="info-list-block">
                <h3>Références bibliographiques</h3>
                <p>{publication.references}</p>
              </div>
            )}
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
