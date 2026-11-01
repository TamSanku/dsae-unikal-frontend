import Link from 'next/link';
import { getAlumni, getTaxonomy } from '@/lib/backend';
import PeopleCatalog from '@/components/PeopleCatalog';
import PageHero from '@/components/PageHero';

/*
 * Les Alumni : les diplômés du domaine.
 *
 * Recherche, onglets par domaine scientifique et filtre par niveau d'études.
 * La matière vient de la rubrique `dsae-alumni` du backoffice ; tant qu'elle
 * est vide, la page le dit plutôt que de montrer un exemple.
 *
 * Le paramètre `domain` ouvre d'emblée l'onglet correspondant : le pied de page
 * s'en sert pour ses liens. Un domaine inconnu est ignoré — on retombe sur
 * « Tous ».
 */
export default async function AlumniPage({
  searchParams,
}: {
  searchParams?: { domain?: string | string[] };
}) {
  const [alumni, taxonomy] = await Promise.all([getAlumni(), getTaxonomy()]);
  const requested = Array.isArray(searchParams?.domain)
    ? searchParams?.domain[0]
    : searchParams?.domain;
  const initialTab =
    requested && taxonomy.domains.includes(requested) ? requested : '';

  return (
    <div className="page-shell">
      <PageHero title="Alumni" />

      <section className="section page-enter">
        <div className="container">
          <PeopleCatalog
            people={alumni}
            variant="alumni"
            taxonomy={taxonomy}
            initialTab={initialTab}
            searchPlaceholder="Rechercher un alumni…"
            emptyLabel={
              alumni.length === 0
                ? 'Les Alumni seront publiés depuis l’espace d’administration.'
                : 'Aucun alumni ne correspond à cette recherche.'
            }
          />
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
