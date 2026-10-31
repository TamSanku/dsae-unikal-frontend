import { getPublications, getTaxonomy } from '@/lib/backend';
import PublicationsCatalog from '@/components/PublicationsCatalog';

/*
 * Le catalogue des publications.
 *
 * La recherche, les onglets par domaine et les filtres vivent dans le
 * catalogue ; la page ne fait que charger la matière réelle et la lui confier.
 * La barre et les onglets restent visibles même sans document publié.
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
          <PublicationsCatalog publications={publications} taxonomy={taxonomy} />
        </div>
      </section>
    </div>
  );
}
