import Link from 'next/link';
import { getAlumni, getTaxonomy } from '@/lib/backend';
import EmptyState from '@/components/EmptyState';
import PeopleCatalog from '@/components/PeopleCatalog';
import type { CatalogFilter } from '@/components/CatalogExplorer';

/*
 * Les Alumni : les diplômés du domaine.
 *
 * Recherche, onglets par domaine scientifique et filtre par niveau d'études.
 * La matière vient de la rubrique `dsae-alumni` du backoffice ; tant qu'elle
 * est vide, la page le dit plutôt que de montrer un exemple.
 */
export default async function AlumniPage() {
  const [alumni, taxonomy] = await Promise.all([getAlumni(), getTaxonomy()]);

  const filters: CatalogFilter[] = taxonomy.domains.map((domain) => ({
    key: `domain:${domain}`,
    label: domain,
    allLabel: 'Tous les niveaux',
    options: taxonomy.levels,
    value: (member) => member.level,
    test: (member, selected) => member.domain === domain && member.level === selected,
  }));

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Alumni</span>
          <h1>Les diplômés du domaine</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {alumni.length === 0 ? (
            <EmptyState label="Les Alumni seront publiés depuis l’espace d’administration." />
          ) : (
            <PeopleCatalog
              people={alumni}
              tabs={taxonomy.domains.map((domain) => ({ key: domain, label: domain }))}
              tabOf={(member) => member.domain}
              filters={filters}
              hrefOf={(member) => `/alumni/${member.id}`}
              searchPlaceholder="Rechercher un alumni…"
              emptyLabel="Aucun alumni ne correspond à cette recherche."
            />
          )}
        </div>
      </section>

      <section className="section cta-band small">
        <div className="container cta-content">
          <div>
            <span className="eyebrow">S’engager</span>
            <h3>Vous êtes diplômé du DSAE ? Faites-vous connaître.</h3>
          </div>
          <Link href="/s-engager" className="btn btn-primary">
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}
