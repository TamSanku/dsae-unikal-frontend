import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicationById } from '@/lib/backend';

export default async function PublicationDetailPage({ params }: { params: { id: string } }) {
  const publication = await getPublicationById(params.id);

  if (!publication) {
    notFound();
  }

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container publication-detail">
          <div className="detail-copy">
            {publication.category && <span className="mini-tag">{publication.category}</span>}
            <h1>{publication.title}</h1>
            {publication.authors && <p className="role-page">{publication.authors}</p>}

            <div className="meta-row wide-row">
              {publication.year > 0 && <span>{publication.year}</span>}
              {publication.discipline && <span>{publication.discipline}</span>}
              {publication.department && <span>{publication.department}</span>}
            </div>

            {publication.pdfUrl && (
              <div className="publication-actions">
                <a href={publication.pdfUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
                  Consulter
                </a>
                <a href={publication.pdfUrl} className="btn btn-secondary" target="_blank" rel="noreferrer">
                  Télécharger
                </a>
              </div>
            )}

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
