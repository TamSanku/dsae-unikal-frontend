import { getPublications, getTaxonomy } from '@/lib/backend';
import EmptyState from '@/components/EmptyState';
import PublicationsCatalog from '@/components/PublicationsCatalog';

/*
 * Le catalogue des publications.
 *
 * La recherche, les onglets par domaine et les filtres vivent dans le
 * catalogue ; la page ne fait que charger la matière réelle et la lui confier.
 */
export default async function PublicationsPage() {
  const [publications, taxonomy] = await Promise.all([getPublications(), getTaxonomy()]);

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
          {publications.length === 0 ? (
            <EmptyState label="Les publications seront publiées depuis l’espace d’administration." />
          ) : (
            <PublicationsCatalog publications={publications} taxonomy={taxonomy} />
          )}
        </div>
      </section>
    </div>
  );
}
