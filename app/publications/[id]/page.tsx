import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publications } from '@/lib/data';

export function generateStaticParams() {
  return publications.map((publication) => ({ id: publication.id }));
}

export default function PublicationDetailPage({ params }: { params: { id: string } }) {
  const publication = publications.find((item) => item.id === params.id);

  if (!publication) {
    notFound();
  }

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container publication-detail">
          <div className="detail-copy">
            <span className="mini-tag">{publication.category}</span>
            <h1>{publication.title}</h1>
            <p className="authors-line">{publication.authors}</p>
            <div className="meta-row wide-row">
              <span>{publication.year}</span>
              <span>{publication.discipline}</span>
              <span>{publication.department}</span>
            </div>

            <div className="publication-actions">
              <a href={publication.pdfUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
                Consulter
              </a>
              <a href={publication.pdfUrl} className="btn btn-secondary" target="_blank" rel="noreferrer">
                Télécharger
              </a>
            </div>

            <div className="info-list-block">
              <h3>Résumé</h3>
              <p>{publication.summary}</p>
            </div>

            <div className="info-list-block">
              <h3>Mots-clés</h3>
              <div className="pill-list">
                {publication.keywords.map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
            </div>

            <div className="info-list-block">
              <h3>Références bibliographiques</h3>
              <p>{publication.references}</p>
            </div>
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
