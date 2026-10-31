import Link from 'next/link';
import { publications } from '@/lib/data';

export default function PublicationsPage() {
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
          <div className="filters-box">
            <div className="filter-item">
              <label htmlFor="search">Recherche</label>
              <input id="search" type="text" placeholder="Titre, auteur, mot-clé" />
            </div>
            <div className="filter-item">
              <label htmlFor="category">Catégorie</label>
              <select id="category">
                <option value="">Toutes</option>
                <option>Articles scientifiques</option>
                <option>Mémoires</option>
                <option>Thèses</option>
                <option>Rapports de recherche</option>
              </select>
            </div>
            <div className="filter-item">
              <label htmlFor="year">Année</label>
              <select id="year">
                <option value="">Toutes</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
            </div>
          </div>

          <div className="card-grid two-grid">
            {publications.map((publication) => (
              <Link key={publication.id} href={`/publications/${publication.id}`} className="publication-card large">
                <span className="mini-tag">{publication.category}</span>
                <h3>{publication.title}</h3>
                <p>{publication.authors}</p>
                <div className="meta-row">
                  <span>{publication.year}</span>
                  <span>{publication.discipline}</span>
                </div>
                <p className="publication-summary">{publication.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
