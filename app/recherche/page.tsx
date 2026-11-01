import Link from 'next/link';
import { getResearchAreas } from '@/lib/backend';
import EmptyState from '@/components/EmptyState';
import PageHero from '@/components/PageHero';

export default async function ResearchPage() {
  const research = await getResearchAreas();

  return (
    <div className="page-shell">
      <PageHero title="Recherche" />

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Politique</span>
            <h3>Une recherche orientée vers l’impact sociétal</h3>
          </div>
          <p className="lead-text">
            La recherche scientifique de l’Université de Kalemie s’appuie sur une dynamique de
            collaboration, de qualité, d’innovation et de valorisation des connaissances. Les axes de
            recherche sont structurés pour répondre aux besoins de la société, à la recherche de
            solutions durables et à la formation de nouvelles générations de chercheurs.
          </p>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          {research.length === 0 ? (
            <EmptyState label="Les axes de recherche seront publiés depuis l’espace d’administration." />
          ) : (
            <div className="card-grid two-grid">
              {research.map((area) => (
                <Link key={area.slug} href={`/recherche/${area.slug}`} className="research-detail-card">
                  {area.category && <span className="mini-tag">{area.category}</span>}
                  <h3>{area.title}</h3>
                  <p>{area.summary}</p>
                  <span className="text-link">Voir le détail →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
