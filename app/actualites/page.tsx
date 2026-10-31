import { getNewsItems, getTaxonomy } from '@/lib/backend';
import NewsCatalog from '@/components/NewsCatalog';

/*
 * Le fil des actualités.
 *
 * La barre de recherche et les onglets restent visibles même quand rien n'est
 * encore publié : la page montre la rubrique telle qu'elle est, et son message
 * vide le dit franchement. Rien n'est inventé.
 */
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
          <NewsCatalog
            news={news}
            taxonomy={taxonomy}
            emptyLabel={
              news.length === 0
                ? 'Les actualités seront publiées depuis l’espace d’administration.'
                : 'Aucune actualité ne correspond à cette recherche.'
            }
          />
        </div>
      </section>
    </div>
  );
}
