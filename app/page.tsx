import Link from 'next/link';
import Image from 'next/image';
import { getTeamMembers, getPublications, getResearchAreas, getNewsItems } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import EmptyState from '@/components/EmptyState';

export default async function HomePage() {
  const [team, publications, research, news] = await Promise.all([
    getTeamMembers(),
    getPublications(),
    getResearchAreas(),
    getNewsItems(),
  ]);

  const featuredTeam = team.slice(0, 3);
  const recentPublications = publications.slice(0, 3);

  return (
    <>
      <section className="hero-shell">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Faculté scientifique</span>
            <h1>Université de Kalemie (UNIKAL)</h1>
            <h2>Portail scientifique de la faculté</h2>
            <p>
              Un espace académique dédié à la recherche, à la production scientifique, à la formation
              et à la diffusion des connaissances au service du développement intellectuel et
              sociétal.
            </p>
            <div className="hero-actions">
              <Link href="/a-propos" className="btn btn-primary">
                Découvrir la faculté
              </Link>
              <Link href="/publications" className="btn btn-secondary">
                Explorer les publications
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{String(research.length).padStart(2, '0')}</strong>
                <span>axes de recherche</span>
              </div>
              <div>
                <strong>{publications.length}</strong>
                <span>publications</span>
              </div>
              <div>
                <strong>{team.length}</strong>
                <span>membres</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card card-glow">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Campus universitaire"
                width={960}
                height={1200}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Présentation</span>
            <h3>Une faculté engagée dans l’excellence scientifique</h3>
          </div>

          <div className="feature-split">
            <div className="feature-copy">
              <p>
                La faculté scientifique de l’Université de Kalemie (UNIKAL) constitue un espace de
                formation, de production et de diffusion des savoirs. Notre mission consiste à
                promouvoir des enseignements de qualité, à soutenir la recherche et à accompagner les
                étudiants, enseignants et chercheurs dans la transformation des connaissances en
                solutions concrètes pour la société.
              </p>
              <div className="pill-list">
                <span>Mission</span>
                <span>Vision</span>
                <span>Innovation</span>
                <span>Développement</span>
              </div>
              <Link href="/a-propos" className="btn btn-primary mt-2">
                En savoir plus
              </Link>
            </div>
            <div className="feature-image">
              <Image
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80"
                alt="Laboratoire scientifique"
                width={900}
                height={700}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">UNIKAL</span>
            <h3>Une université au service du savoir et du développement</h3>
          </div>

          <div className="feature-split reverse">
            <div className="feature-image">
              <Image
                src="https://images.unsplash.com/photo-1562771382-4d47f2ef6de6?auto=format&fit=crop&w=1000&q=80"
                alt="Université de Kalemie"
                width={900}
                height={700}
              />
            </div>
            <div className="feature-copy">
              <p>
                L’Université de Kalemie (UNIKAL) s’inscrit dans une dynamique de structuration des
                savoirs, de transformation des formations et d’appui à la recherche. Son organisation
                vise à rapprocher disciplines, unités de recherche et acteurs académiques pour une
                meilleure contribution au développement local et national.
              </p>
              <Link href="/universite" className="btn btn-primary mt-2">
                Découvrir l’université
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading split-head">
            <div>
              <span className="eyebrow">Équipe</span>
              <h3>Direction et acteurs académiques</h3>
            </div>
            <Link href="/equipe" className="text-link">
              Voir toute l’équipe →
            </Link>
          </div>

          {featuredTeam.length === 0 ? (
            <EmptyState label="L’équipe sera publiée depuis l’espace d’administration." />
          ) : (
          <div className="card-grid three-grid">
            {featuredTeam.map((member) => (
              <Link key={member.id} href={`/equipe/${member.id}`} className="profile-card">
                <div className="profile-image-wrap">
                  <Image src={withFallback(member.image)} alt={member.name} width={600} height={700} />
                </div>
                <div className="profile-body">
                  {member.category && <span className="mini-tag">{member.category}</span>}
                  <h4>{member.name}</h4>
                  {member.role && <p className="role">{member.role}</p>}
                  {member.department && <p>{member.department}</p>}
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <div className="section-heading split-head">
            <div>
              <span className="eyebrow">Recherche</span>
              <h3>Axes scientifiques et projets</h3>
            </div>
            <Link href="/recherche" className="text-link">
              Explorer la recherche →
            </Link>
          </div>

          {research.length === 0 ? (
            <EmptyState label="Les axes de recherche seront publiés depuis l’espace d’administration." />
          ) : (
          <div className="card-grid four-grid">
            {research.slice(0, 4).map((area) => (
              <Link key={area.slug} href={`/recherche/${area.slug}`} className="research-card">
                <span className="mini-tag">{area.category}</span>
                <h4>{area.title}</h4>
                <p>{area.summary}</p>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading split-head">
            <div>
              <span className="eyebrow">Publications</span>
              <h3>Productions scientifiques récentes</h3>
            </div>
            <Link href="/publications" className="text-link">
              Voir toutes les publications →
            </Link>
          </div>

          {recentPublications.length === 0 ? (
            <EmptyState label="Les publications seront publiées depuis l’espace d’administration." />
          ) : (
          <div className="card-grid three-grid">
            {recentPublications.map((publication) => (
              <Link key={publication.id} href={`/publications/${publication.id}`} className="publication-card">
                {publication.category && <span className="mini-tag">{publication.category}</span>}
                <h4>{publication.title}</h4>
                {publication.authors && <p>{publication.authors}</p>}
                <div className="meta-row">
                  {publication.year > 0 && <span>{publication.year}</span>}
                  {publication.discipline && <span>{publication.discipline}</span>}
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="section alt-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Actualités</span>
            <h3>Conférences, séminaires et événements scientifiques</h3>
          </div>

          {news.length === 0 ? (
            <EmptyState label="Les actualités seront publiées depuis l’espace d’administration." />
          ) : (
          <div className="card-grid three-grid">
            {news.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/actualites/${item.slug}`} className="news-card">
                <div className="news-image">
                  <Image src={withFallback(item.image)} alt={item.title} width={800} height={520} />
                </div>
                <div className="news-body">
                  {item.category && <span className="mini-tag">{item.category}</span>}
                  <h4>{item.title}</h4>
                  {item.excerpt && <p>{item.excerpt}</p>}
                  {item.date && <span className="date-label">{item.date}</span>}
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>

      <section className="section cta-band">
        <div className="container cta-content">
          <div>
            <span className="eyebrow">Appel à la communauté scientifique</span>
            <h3>Découvrez les travaux, partagez les savoirs et contribuez à l’avancée scientifique.</h3>
          </div>
          <Link href="/publications" className="btn btn-primary">
            Découvrir les publications
          </Link>
        </div>
      </section>
    </>
  );
}
