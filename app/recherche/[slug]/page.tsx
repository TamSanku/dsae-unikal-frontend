import Link from 'next/link';
import { notFound } from 'next/navigation';
import { researchAreas } from '@/lib/data';

export function generateStaticParams() {
  return researchAreas.map((area) => ({ slug: area.slug }));
}

export default function ResearchDetailPage({ params }: { params: { slug: string } }) {
  const area = researchAreas.find((item) => item.slug === params.slug);

  if (!area) {
    notFound();
  }

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Axe de recherche</span>
          <h1>{area.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container detail-layout small-gap">
          <div>
            <p>{area.description}</p>
            <div className="info-list-block">
              <h3>Objectifs</h3>
              <ul>
                {area.goals.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="info-card">
            <h3>Projets</h3>
            <ul>
              {area.projects.map((project) => (
                <li key={project}>{project}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
