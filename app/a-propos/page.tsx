import Image from 'next/image';
import Link from 'next/link';
import { getFilieres } from '@/lib/backend';
import EmptyState from '@/components/EmptyState';

/*
 * La page « À propos ».
 *
 * Les filières et leurs axes de recherche viennent de l'espace de gestion
 * (rubrique « Filières ») : la page n'en invente aucune. Tant qu'aucune filière
 * n'est publiée, la section le dit, plutôt que d'afficher une liste écrite en
 * dur que l'administration ne pourrait pas corriger.
 */
export default async function AboutPage() {
  const filieres = await getFilieres();

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">À propos</span>
          <h1>Domaine des Sciences Agronomiques et de l’Environnement</h1>
        </div>
      </section>

      <section className="section">
        <div className="container detail-layout">
          <div>
            <p>
              Le Domaine des Sciences Agronomiques et de l’Environnement (DSAE) de l’Université
              de Kalemie regroupe les formations et les recherches consacrées à l’agriculture, à
              l’élevage et à la gestion durable de l’environnement. Il forme des agronomes et des
              spécialistes capables de répondre aux besoins des exploitations, des communautés et des
              institutions de la région.
            </p>
            <p>
              Ses travaux portent sur la production végétale et animale, la fertilité des sols, la
              préservation des ressources naturelles et l’adaptation de l’agriculture au changement
              climatique. Le domaine associe formation, recherche appliquée et appui aux acteurs
              du monde rural.
            </p>
          </div>
          <div className="detail-image">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
              alt="Étudiants et chercheurs du domaine"
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
              Le domaine s’est structuré pour répondre aux besoins d’une région à vocation
              agricole, marquée par la pêche, l’élevage et la présence du lac Tanganyika. Ses enseignements et ses
              unités de recherche se sont progressivement organisés autour de la production
              agricole et de la gestion de l’environnement.
            </p>
          </div>
          <div className="info-card">
            <h3>Mission</h3>
            <p>
              Former des agronomes et des spécialistes de l’environnement compétents, conduire des
              recherches appliquées sur l’agriculture et les ressources naturelles, accompagner les
              producteurs et contribuer à la sécurité alimentaire et au développement durable.
            </p>
          </div>
          <div className="info-card">
            <h3>Vision</h3>
            <p>
              Devenir un pôle de référence en sciences agronomiques et environnementales dans
              l’Est de la République Démocratique du Congo, au service de la formation, de la
              recherche et des communautés.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Enseignement</span>
            <h3>Filières et axes de recherche</h3>
          </div>

          {filieres.length === 0 ? (
            <EmptyState label="Les filières et leurs axes de recherche seront publiés depuis l’espace d’administration." />
          ) : (
            <div className="card-grid two-grid">
              {filieres.map((filiere) => (
                <div key={filiere.slug} className="info-card">
                  <h4>{filiere.title}</h4>
                  <p>{filiere.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Objectifs</span>
            <h3>Organisation académique et objectifs</h3>
          </div>

          <div className="check-grid">
            <div>
              <ul>
                <li>Développer des programmes de qualité et adaptés aux besoins sociétaux.</li>
                <li>Renforcer la recherche fondamentale et la recherche appliquée.</li>
                <li>Favoriser la collaboration entre enseignants, chercheurs et étudiants.</li>
                <li>Former des agronomes et des spécialistes de l’environnement.</li>
              </ul>
            </div>
            <div>
              <ul>
                <li>Mettre en place des structures académiques et scientifiques performantes.</li>
                <li>Développer des maîtrises, doctorats et programmes spécialisés.</li>
                <li>Renforcer la diffusion des savoirs à travers des publications et événements.</li>
                <li>Accompagner les producteurs et les communautés rurales.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-band small">
        <div className="container cta-content">
          <div>
            <span className="eyebrow">Explorer</span>
            <h3>Consultez la recherche et les publications du domaine.</h3>
          </div>
          <Link href="/publications" className="btn btn-primary">
            Voir les publications
          </Link>
        </div>
      </section>
    </div>
  );
}
