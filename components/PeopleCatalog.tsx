'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { TeamMember, Taxonomy } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import CatalogExplorer, { type CatalogFilter } from '@/components/CatalogExplorer';

/*
 * La liste des personnes : équipe et alumni.
 *
 * Une seule mécanique pour les deux : recherche, onglets, cartes. La page
 * Équipe onglette par catégorie (gouvernance, professeurs, assistants…),
 * la page Alumni par domaine, avec un filtre par niveau.
 *
 * Tout se dérive ici, à partir du registre du serveur (`taxonomy`) : les
 * onglets, le chemin de la fiche et les filtres. Ce composant est client — il
 * ne peut donc pas recevoir de fonction d'une page serveur ; il ne reçoit que
 * des données.
 */
export default function PeopleCatalog({
  people,
  variant,
  taxonomy,
  searchPlaceholder,
  emptyLabel,
  initialTab = '',
}: {
  people: TeamMember[];
  variant: 'team' | 'alumni';
  taxonomy: Taxonomy;
  searchPlaceholder: string;
  emptyLabel: string;
  /** L'onglet ouvert d'emblée, par exemple depuis un lien du pied de page. */
  initialTab?: string;
}) {
  const isAlumni = variant === 'alumni';

  const tabs = (isAlumni ? taxonomy.domains : taxonomy.teamCategories).map((entry) => ({
    key: entry,
    label: entry,
  }));

  const tabOf = (member: TeamMember) => (isAlumni ? member.domain : member.category);

  /* L'équipe onglette par catégorie, et une personne peut en relever plusieurs :
   * elle apparaît alors sous chacune de ses catégories. */
  const tabMatch = isAlumni
    ? undefined
    : (member: TeamMember, tab: string) => (member.categories ?? []).includes(tab);

  const hrefOf = (member: TeamMember) => (isAlumni ? `/alumni/${member.id}` : `/equipe/${member.id}`);

  /* Un filtre par domaine : on y choisit le niveau d'études. Seuls les alumni
   * portent un niveau ; l'équipe n'a donc pas de filtre. */
  const filters: CatalogFilter[] = isAlumni
    ? taxonomy.domains.map((domain) => ({
        key: `domain:${domain}`,
        label: domain,
        allLabel: 'Tous les niveaux',
        options: taxonomy.levels,
        value: (member: TeamMember) => member.level,
        test: (member: TeamMember, selected: string) => member.domain === domain && member.level === selected,
      }))
    : [];

  return (
    <CatalogExplorer
      items={people}
      searchPlaceholder={searchPlaceholder}
      searchText={(member: TeamMember) =>
        [member.name, member.role, member.department, member.specialty, member.bio, member.category, member.domain, member.level]
          .filter(Boolean)
          .join(' ')
      }
      tabs={tabs}
      tabOf={tabOf}
      tabMatch={tabMatch}
      filters={filters}
      initialTab={initialTab}
      resultNoun="profil"
      emptyLabel={emptyLabel}
      renderItem={(member: TeamMember) => (
        <Link key={member.id} href={hrefOf(member)} className="profile-card large-card">
          <div className="profile-image-wrap">
            <Image src={withFallback(member.image)} alt={member.name} width={600} height={700} />
          </div>
          <div className="profile-body">
            {(member.categories ?? []).map((category) => (
              <span className="mini-tag" key={category}>{category}</span>
            ))}
            <h4>{member.name}</h4>
            {member.role && <p className="role">{member.role}</p>}
            {member.department && <p>{member.department}</p>}
            {(member.domain || member.level) && (
              <p className="publication-tags">
                {member.domain && <span className="mini-tag">{member.domain}</span>}
                {member.level && <span className="mini-tag ghost">{member.level}</span>}
              </p>
            )}
          </div>
        </Link>
      )}
    />
  );
}
