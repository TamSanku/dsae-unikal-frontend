'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { TeamMember } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import CatalogExplorer, { type CatalogFilter, type CatalogTab } from '@/components/CatalogExplorer';

/*
 * La liste des personnes : équipe et alumni.
 *
 * Une seule mécanique pour les deux : recherche, onglets, cartes. La page
 * Équipe onglette par catégorie (gouvernance, professeurs, assistants…),
 * la page Alumni par domaine, avec un filtre par niveau. La carte et le lien
 * de fiche sont fournis par l'appelant.
 */
export default function PeopleCatalog({
  people,
  tabs,
  tabOf,
  filters = [],
  hrefOf,
  searchPlaceholder,
  emptyLabel,
}: {
  people: TeamMember[];
  tabs: CatalogTab[];
  tabOf: (member: TeamMember) => string;
  filters?: CatalogFilter[];
  hrefOf: (member: TeamMember) => string;
  searchPlaceholder: string;
  emptyLabel: string;
}) {
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
      filters={filters}
      resultNoun="profil"
      emptyLabel={emptyLabel}
      renderItem={(member: TeamMember) => (
        <Link key={member.id} href={hrefOf(member)} className="profile-card large-card">
          <div className="profile-image-wrap">
            <Image src={withFallback(member.image)} alt={member.name} width={600} height={700} />
          </div>
          <div className="profile-body">
            {member.category && <span className="mini-tag">{member.category}</span>}
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
