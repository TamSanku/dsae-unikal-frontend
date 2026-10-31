import { getNewsItems, getTaxonomy } from '@/lib/backend';
import EmptyState from '@/components/EmptyState';
import NewsCatalog from '@/components/NewsCatalog';

export default async function NewsPage() {
  const [news, taxonomy] = await Promise.all([getNewsItems(), getTaxonomy()]);

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Actualités</span>
          <h1>Événements, séminaires et conférences</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {news.length === 0 ? (
            <EmptyState label="Les actualités seront publiées depuis l’espace d’administration." />
          ) : (
            <NewsCatalog news={news} taxonomy={taxonomy} />
          )}
        </div>
      </section>
    </div>
  );
}
