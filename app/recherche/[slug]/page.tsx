import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getResearchAreaBySlug } from '@/lib/backend';
import PageHero from '@/components/PageHero';

/* Le titre de l'onglet porte le nom de l'axe : c'est ce nom que la mesure
 * d'audience retient comme libellé de la fiche. */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const area = await getResearchAreaBySlug(params.slug);
  return { title: area?.title ?? 'Axe de recherche' };
}

export default async function ResearchDetailPage({ params }: { params: { slug: string } }) {
  const area = await getResearchAreaBySlug(params.slug);

  if (!area) {
    notFound();
  }

  return (
    <div className="page-shell">
      <PageHero title={area.title} />

      <section className="section page-enter">
        <div className="container detail-layout small-gap">
          <div>
            {area.description && <p>{area.description}</p>}
            {area.goals.length > 0 && (
              <div className="info-list-block">
                <h3>Objectifs</h3>
                <ul>
                  {area.goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {area.projects.length > 0 && (
            <div className="info-card">
              <h3>Projets</h3>
              <ul>
                {area.projects.map((project) => (
                  <li key={project}>{project}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {area.publications.length > 0 && (
        <section className="section alt-section">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Publications associées</span>
              <h3>Productions scientifiques</h3>
            </div>
            <ul className="publication-list">
              {area.publications.map((publication) => (
                <li key={publication}>{publication}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section cta-band small">
        <div className="container cta-content">
          <div>
            <span className="eyebrow">Retour</span>
            <h3>Retrouvez tous les axes de recherche.</h3>
          </div>
          <Link href="/recherche" className="btn btn-primary">
            Voir la recherche
          </Link>
        </div>
      </section>
    </div>
  );
}
