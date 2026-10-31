import Link from 'next/link';
import { getPublications } from '@/lib/backend';
import AuthorList from '@/components/AuthorList';
import EmptyState from '@/components/EmptyState';
import PublicationCover from '@/components/PublicationCover';
import StarRating from '@/components/StarRating';

/*
 * Le catalogue des publications.
 *
 * Une carte ne montre que l'essentiel : la couverture, le titre, le signataire,
 * la date de publication et les étoiles des avis. Pas de résumé, pas de bouton —
 * on ne lit ni ne télécharge depuis la liste. Tout le reste vit dans la fiche,
 * qu'on ouvre en cliquant la couverture ou le titre.
 */
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
                <article key={publication.id} className="publication-card large publication-card-cover">
                  <Link
                    href={`/publications/${publication.id}`}
                    className="publication-cover-link"
                    aria-label={`Ouvrir « ${publication.title} »`}
                  >
                    <PublicationCover
                      title={publication.title}
                        image={publication.coverUrl}
                    />
                  </Link>

                  <div className="publication-card-body">
                    <h3>
                      <Link href={`/publications/${publication.id}`}>{publication.title}</Link>
                    </h3>
                    <AuthorList authors={publication.authorsList} />
                    {publication.publishedLabel && (
                      <p className="publication-date">{publication.publishedLabel}</p>
                    )}
                    <StarRating
                      value={publication.reviewSummary.average}
                      count={publication.reviewSummary.count}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
