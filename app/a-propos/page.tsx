import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">À propos</span>
          <h1>Présentation de la faculté scientifique</h1>
        </div>
      </section>

      <section className="section">
        <div className="container detail-layout">
          <div>
            <p>
              La faculté scientifique de l’Université de Kalemie constitue un pôle académique dédié à
              la formation, à la recherche et à l’innovation. Elle s’attache à développer des
              compétences de pointe, tout en favorisant une culture scientifique ouverte, critique et
              solidaire.
            </p>
            <p>
              Sa mission est de produire des connaissances utiles, d’accompagner la recherche
              scientifique et de former des professionnels compétents capables de répondre aux défis
              du développement local, national et international.
            </p>
          </div>
          <div className="detail-image">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
              alt="Étudiants et faculté"
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
              À partir de la volonté d’étendre l’accès à l’enseignement supérieur et de renforcer la
              recherche scientifique, la faculté a progressivement structuré ses programmes et ses
              unités de recherche autour des grands défis contemporains.
            </p>
          </div>
          <div className="info-card">
            <h3>Mission</h3>
            <p>
              Former des étudiants compétents, soutenir la recherche fondamentale et appliquée,
              développer des partenariats académiques et scientifiques et contribuer au
              développement durable.
            </p>
          </div>
          <div className="info-card">
            <h3>Vision</h3>
            <p>
              Devenir un pôle de référence dans la production scientifique, la qualité de la
              formation et l’innovation au service des communautés universitaires et de la société.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Objectifs</span>
            <h3>Organisation académique et domaines de formation</h3>
          </div>

          <div className="check-grid">
            <div>
              <ul>
                <li>Développer des programmes de qualité et adaptés aux besoins sociétaux.</li>
                <li>Renforcer la recherche fondamentale et la recherche appliquée.</li>
                <li>Favoriser la collaboration entre enseignants, chercheurs et étudiants.</li>
              </ul>
            </div>
            <div>
              <ul>
                <li>Mettre en place des structures académiques et scientifiques performantes.</li>
                <li>Développer des maîtrises, doctorats et programmes spécialisés.</li>
                <li>Renforcer la diffusion des savoirs à travers des publications et événements.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-band small">
        <div className="container cta-content">
          <div>
            <span className="eyebrow">Explorer</span>
            <h3>Consultez la recherche et les publications de la faculté.</h3>
          </div>
          <Link href="/publications" className="btn btn-primary">
            Voir les publications
          </Link>
        </div>
      </section>
    </div>
  );
}
