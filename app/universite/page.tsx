import Image from 'next/image';
import PageHero from '@/components/PageHero';

export default function UniversityPage() {
  return (
    <div className="page-shell">
      <PageHero title="Université" />

      <section className="section page-enter">
        <div className="container detail-layout">
          <div>
            <p>
              L’Université de Kalemie (UNIKAL) est une institution académique soucieuse de former des
              citoyens éclairés, des professionnels compétents et des chercheurs engagés dans le
              développement de leurs communautés.
            </p>
            <p>
              Son développement repose sur des principes de qualité, d’excellence, d’ouverture à la
              science et de coopération interuniversitaire.
            </p>
          </div>
          <div className="detail-image">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80"
              alt="Campus universitaire"
              width={900}
              height={700}
            />
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container split-columns">
          <div className="info-card">
            <h3>Historique</h3>
            <p>
              L’université a connu une évolution progressive en réponse aux besoins de formation,
              d’insertion professionnelle et de développement scientifique du milieu.
            </p>
          </div>
          <div className="info-card">
            <h3>Mission</h3>
            <p>
              Créer des opportunités de formation et de recherche dans un cadre de qualité,
              d’intégrité et d’innovation académique.
            </p>
          </div>
          <div className="info-card">
            <h3>Organisation</h3>
            <p>
              L’institution s’organise autour de facultés, départements, unités de recherche et
              structures administratives chargées d’assurer la gouvernance académique.
            </p>
          </div>
        </div>
      </section>

      <section className="section cta-band small">
        <div className="container cta-content">
          <div>
            <span className="eyebrow">Université de Kalemie</span>
            <h3>Découvrir l’institution sur son site officiel.</h3>
          </div>
          <a href="https://unikal.ac.cd" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            En savoir plus sur l’université de Kalemie
          </a>
        </div>
      </section>
    </div>
  );
}
