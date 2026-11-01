import { getPublications, getTaxonomy } from '@/lib/backend';
import PublicationsCatalog from '@/components/PublicationsCatalog';

/*
 * Le catalogue des publications.
 *
 * La recherche, les onglets par domaine et les filtres vivent dans le
 * catalogue ; la page ne fait que charger la matière réelle et la lui confier.
 * La barre et les onglets restent visibles même sans document publié.
 */
export default async function PublicationsPage({
  searchParams,
}: {
  searchParams?: { domain?: string | string[] };
}) {
  const [publications, taxonomy] = await Promise.all([getPublications(), getTaxonomy()]);
  const requested = Array.isArray(searchParams?.domain)
    ? searchParams?.domain[0]
    : searchParams?.domain;
  const initialTab = requested && taxonomy.domains.includes(requested) ? requested : '';

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
          <PublicationsCatalog
            publications={publications}
            taxonomy={taxonomy}
            initialTab={initialTab}
          />
        </div>
      </section>
    </div>
  );
}
