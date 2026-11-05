import { getPublications, getTaxonomy } from '@/lib/backend';
import PublicationsCatalog from '@/components/PublicationsCatalog';
import PageHero from '@/components/PageHero';

/*
 * Le catalogue des publications.
 *
 * La recherche et les filtres vivent dans le catalogue ; la page ne fait que
 * charger la matière réelle et la lui confier. La barre et les filtres restent
 * visibles même sans document publié.
 *
 * Un lien du pied de page vise un **domaine** (`/publications?domain=…`) : ce
 * domaine devient un filtre choisi d'emblée.
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
  const initialDomain = requested && taxonomy.domains.includes(requested) ? requested : '';
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
            initialDomain={initialDomain}
            initialQuery={initialQuery}
          />
        </div>
      </section>
    </div>
  );
}
