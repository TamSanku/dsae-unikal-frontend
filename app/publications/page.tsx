import Link from 'next/link';
import { DownloadIcon, ReadIcon } from '@/components/icons';
import { downloadUrl, getPublications } from '@/lib/backend';
import AuthorList from '@/components/AuthorList';
import EmptyState from '@/components/EmptyState';
import PublicationCover from '@/components/PublicationCover';

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
              {publications.map((publication) => {
                const document = publication.documentUrl;
                return (
                  <article key={publication.id} className="publication-card large publication-card-cover">
                    <Link href={`/publications/${publication.id}`} className="publication-cover-link" aria-label={`Ouvrir « ${publication.title} »`}>
                      <PublicationCover
                        title={publication.title}
                        authors={publication.authors}
                        category={publication.category}
                        image={publication.coverUrl}
                      />
                    </Link>

                    <div className="publication-card-body">
                      {publication.category && <span className="mini-tag">{publication.category}</span>}
                      <h3>
                        <Link href={`/publications/${publication.id}`}>{publication.title}</Link>
                      </h3>
                      <AuthorList authors={publication.authorsList} />
                      {(publication.year > 0 || publication.discipline) && (
                        <div className="meta-row">
                          {publication.year > 0 && <span>{publication.year}</span>}
                          {publication.discipline && <span>{publication.discipline}</span>}
                        </div>
                      )}
                      {publication.summary && <p className="publication-summary">{publication.summary}</p>}

                      <div className="publication-actions">
                        {document ? (
                          <a href={document} className="btn btn-primary" target="_blank" rel="noreferrer">
                            <ReadIcon /> Lire
                          </a>
                        ) : (
                          <Link href={`/publications/${publication.id}`} className="btn btn-primary">
                            <ReadIcon /> Lire
                          </Link>
                        )}
                        {document ? (
                          <a href={downloadUrl(document)} className="btn btn-secondary">
                            <DownloadIcon /> Télécharger
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
