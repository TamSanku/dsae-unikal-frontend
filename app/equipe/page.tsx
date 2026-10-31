import { getTeamMembers, getTaxonomy } from '@/lib/backend';
import EmptyState from '@/components/EmptyState';
import PeopleCatalog from '@/components/PeopleCatalog';

/*
 * L'équipe : recherche et onglets par catégorie.
 *
 * Les onglets sont les catégories du serveur (gouvernance, professeurs,
 * assistants, chargés de cours…). Une personne sans catégorie se lit sous
 * « Tout ». La recherche couvre le nom, la fonction, le département et le
 * parcours.
 */
export default async function TeamPage() {
  const [team, taxonomy] = await Promise.all([getTeamMembers(), getTaxonomy()]);

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Équipe</span>
          <h1>Responsables et acteurs scientifiques</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {team.length === 0 ? (
            <EmptyState label="L’équipe sera publiée depuis l’espace d’administration." />
          ) : (
            <PeopleCatalog
              people={team}
              tabs={taxonomy.teamCategories.map((category) => ({ key: category, label: category }))}
              tabOf={(member) => member.category}
              hrefOf={(member) => `/equipe/${member.id}`}
              searchPlaceholder="Rechercher une personne…"
              emptyLabel="Aucun profil ne correspond à cette recherche."
            />
          )}
        </div>
      </section>
    </div>
  );
}
