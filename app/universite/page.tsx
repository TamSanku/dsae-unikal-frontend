import Image from 'next/image';
import Link from 'next/link';

export default function UniversityPage() {
  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Université</span>
          <h1>Université de Kalemie (UNIKAL)</h1>
        </div>
      </section>

      <section className="section">
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
            <span className="eyebrow">Nous contacter</span>
            <h3>Pour toute demande ou information institutionnelle.</h3>
          </div>
          <Link href="/contact" className="btn btn-primary">
            Contacter l’université
          </Link>
        </div>
      </section>
    </div>
  );
}
