import { getTeamMembers, getTaxonomy } from '@/lib/backend';
import PeopleCatalog from '@/components/PeopleCatalog';
import PageHero from '@/components/PageHero';

/*
 * L'équipe : recherche et onglets par catégorie.
 *
 * Les onglets sont les catégories du serveur (gouvernance, professeurs,
 * assistants, chargés de cours…). Une personne sans catégorie se lit sous
 * « Tout ». La recherche couvre le nom, la fonction, le département et le
 * parcours. La barre et les onglets restent visibles même sans contenu.
 */
export default async function TeamPage({
  searchParams,
}: {
  searchParams?: { category?: string | string[] };
}) {
  const [team, taxonomy] = await Promise.all([getTeamMembers(), getTaxonomy()]);
  const requested = Array.isArray(searchParams?.category)
    ? searchParams?.category[0]
    : searchParams?.category;
  const initialTab = requested && taxonomy.teamCategories.includes(requested) ? requested : '';

  return (
    <div className="page-shell">
      <PageHero title="Équipe" />

      <section className="section page-enter">
        <div className="container">
          <PeopleCatalog
            people={team}
            variant="team"
            taxonomy={taxonomy}
            initialTab={initialTab}
            searchPlaceholder="Rechercher une personne…"
            emptyLabel={
              team.length === 0
                ? 'L’équipe sera publiée depuis l’espace d’administration.'
                : 'Aucun profil ne correspond à cette recherche.'
            }
          />
        </div>
      </section>
    </div>
  );
}
