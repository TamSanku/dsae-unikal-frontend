import { getPublications, getTaxonomy } from '@/lib/backend';
import PublicationsCatalog from '@/components/PublicationsCatalog';
import PageHero from '@/components/PageHero';

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
  searchParams?: { domain?: string | string[]; q?: string | string[] };
}) {
  const [publications, taxonomy] = await Promise.all([getPublications(), getTaxonomy()]);
  const requested = Array.isArray(searchParams?.domain)
    ? searchParams?.domain[0]
    : searchParams?.domain;
  const initialTab = requested && taxonomy.domains.includes(requested) ? requested : '';
  const wanted = Array.isArray(searchParams?.q) ? searchParams?.q[0] : searchParams?.q;
  const initialQuery = (wanted ?? '').trim();

  return (
    <div className="page-shell">
      <PageHero title="Publications" />

      <section className="section page-enter">
        <div className="container">
          <PublicationsCatalog
            publications={publications}
            taxonomy={taxonomy}
            initialTab={initialTab}
            initialQuery={initialQuery}
          />
        </div>
      </section>
    </div>
  );
}
