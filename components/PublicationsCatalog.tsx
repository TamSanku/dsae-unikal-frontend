'use client';

import { useMemo } from 'react';
import type { Publication, Taxonomy } from '@/lib/backend';
import PublicationCard from '@/components/PublicationCard';
import CatalogExplorer, { type CatalogFilter } from '@/components/CatalogExplorer';

/*
 * Le catalogue des publications : recherche, onglets par domaine, filtres par
 * date et par niveau.
 *
 * Vue d'ensemble (« Tout », sans recherche) : une rangée par catégorie — le
 * domaine scientifique du document —, chacune défilant vers la droite au doigt.
 * Un onglet ou une recherche resserre la liste : le catalogue montre alors une
 * grille de cartes (une colonne sur téléphone, deux à partir de 640 px, trois
 * sur grand écran).
 *
 * Une carte ne montre que l'essentiel : la couverture, le titre, les
 * signataires, la catégorie, la date et la note. Tout le reste vit dans la
 * fiche. Les onglets sont les domaines du serveur ; les filtres reprennent la
 * date et, sous chaque domaine, le niveau d'études.
 *
 * Les documents importés d'un même lot partagent souvent la même image de
 * couverture, décorative. Quand une image revient sur plusieurs documents, la
 * carte lui préfère un fond de la couleur de la catégorie : on ne montre pas
 * dix fois la même image noire.
 */

const FALLBACK_SHELF_LABEL = 'Autres documents';

/** Les années réellement présentes, de la plus récente à la plus ancienne. */
function publicationYears(items: Publication[]): string[] {
  const years = new Set<string>();
  for (const item of items) {
    if (!item.publishedAt) continue;
    const year = new Date(item.publishedAt).getFullYear();
    if (Number.isFinite(year)) years.add(String(year));
  }
  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

export default function PublicationsCatalog({
  publications,
  taxonomy,
  sharedCovers = [],
  initialTab = '',
  initialQuery = '',
}: {
  publications: Publication[];
  taxonomy: Taxonomy;
  /** Les couvertures partagées, repérées côté serveur (`lib/covers`) : les
   * documents concernés s'affichent avec un fond de catégorie. */
  sharedCovers?: string[];
  /** Le domaine ouvert d'emblée, par exemple depuis un lien du pied de page. */
  initialTab?: string;
  /** La recherche pré-remplie, par exemple depuis un mot-clé de fiche. */
  initialQuery?: string;
}) {
  const years = publicationYears(publications);

  const shared = useMemo(() => new Set(sharedCovers), [sharedCovers]);

  const isPlaceholderCover = (publication: Publication) => {
    const cover = (publication.coverUrl ?? '').trim();
    return !cover || shared.has(cover);
  };

  /* Un filtre par domaine : on y choisit le niveau d'études. Le filtre ne
   * retient que les documents de ce domaine, à ce niveau. */
  const domainFilters: CatalogFilter[] = taxonomy.domains.map((domain) => ({
    key: `domain:${domain}`,
    label: domain,
    allLabel: 'Tous les niveaux',
    options: taxonomy.levels,
    value: (item: Publication) => item.level,
    test: (item: Publication, selected: string) => item.domain === domain && item.level === selected,
  }));

  const filters: CatalogFilter[] = [];
  if (years.length > 0) {
    filters.push({
      key: 'date',
      label: 'Date de publication',
      allLabel: 'Toutes les dates',
      options: years,
      value: (item: Publication) =>
        item.publishedAt ? String(new Date(item.publishedAt).getFullYear()) : '',
    });
  }
  filters.push(...domainFilters);

  /* Les rayons : une rangée par domaine, dans l'ordre du serveur, puis les
   * documents sans domaine connu, pour n'en perdre aucun. */
  const groupOrder = [...taxonomy.domains, FALLBACK_SHELF_LABEL];

  return (
    <CatalogExplorer
      items={publications}
      searchPlaceholder="Rechercher…"
      searchText={(item: Publication) =>
        [item.title, item.subtitle, item.summary, item.authors, item.category, item.domain, item.level, ...(item.keywords ?? [])]
          .filter(Boolean)
          .join(' ')}
      tabs={taxonomy.domains.map((domain) => ({ key: domain, label: domain }))}
      tabOf={(item: Publication) => item.domain}
      filters={filters}
      initialTab={initialTab}
      initialQuery={initialQuery}
      resultNoun="document"
      emptyLabel="Aucun document ne correspond à cette recherche. Modifiez les mots-clés ou les filtres."
      groupBy={(item: Publication) => (item.domain ?? '').trim() || FALLBACK_SHELF_LABEL}
      groupOrder={groupOrder}
      groupFallbackLabel={FALLBACK_SHELF_LABEL}
      gridClassName="pub-grid"
      renderItem={(publication: Publication) => (
        <PublicationCard
          key={publication.id}
          publication={publication}
          placeholder={isPlaceholderCover(publication)}
        />
      )}
    />
  );
}
