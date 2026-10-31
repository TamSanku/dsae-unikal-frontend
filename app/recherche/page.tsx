import Link from 'next/link';
import { researchAreas } from '@/lib/data';

export default function ResearchPage() {
  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Recherche</span>
          <h1>Politique, axes de recherche et projets</h1>
        </div>
      </section>

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
          <div className="card-grid two-grid">
            {researchAreas.map((area) => (
              <Link key={area.slug} href={`/recherche/${area.slug}`} className="research-detail-card">
                <span className="mini-tag">{area.category}</span>
                <h3>{area.title}</h3>
                <p>{area.summary}</p>
                <span className="text-link">Voir le détail →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
