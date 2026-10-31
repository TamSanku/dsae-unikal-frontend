import Link from 'next/link';
import { getPublications } from '@/lib/backend';
import EmptyState from '@/components/EmptyState';

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Publications</span>
          <h1>Catalogue scientifique</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {publications.length === 0 ? (
            <EmptyState label="Les publications seront publiées depuis l’espace d’administration." />
          ) : (
            <div className="card-grid two-grid">
              {publications.map((publication) => (
                <Link key={publication.id} href={`/publications/${publication.id}`} className="publication-card large">
                  {publication.category && <span className="mini-tag">{publication.category}</span>}
                  <h3>{publication.title}</h3>
                  {publication.authors && <p>{publication.authors}</p>}
                  <div className="meta-row">
                    {publication.year > 0 && <span>{publication.year}</span>}
                    {publication.discipline && <span>{publication.discipline}</span>}
                  </div>
                  {publication.summary && <p className="publication-summary">{publication.summary}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
