'use client';

import { useMemo } from 'react';
import type { Publication, Taxonomy } from '@/lib/backend';
import PublicationCard from '@/components/PublicationCard';
import CatalogExplorer, { type CatalogFilter } from '@/components/CatalogExplorer';
import { SHELVES, OTHER_SHELF_LABEL, publicationShelf, shelfKey } from '@/lib/shelves';

/*
 * Le catalogue des publications : recherche, filtres par domaine, par date et
 * par niveau.
 *
 * Vue d'ensemble : un rayon par **nature** de document — articles
 * scientifiques, mémoires (de graduat, de licence, de master), thèses —, les
 * uns sous les autres, chacun sous son nom et avec son lien « Voir plus » vers
 * la page du rayon. Une recherche ou un filtre resserre la liste : le catalogue
 * montre alors une grille de cartes (deux blocs sur téléphone, trois sur
 * tablette, quatre puis six sur grand écran).
 *
 * Il n'y a plus d'onglets : le rayon est le seul classement. C'est « Voir
 * plus » qui ouvre la vue complète d'un rayon, sur sa propre page.
 *
 * Une carte ne montre que l'essentiel : la couverture, le titre, les
 * signataires, la date et la note. La nature du document est portée par le nom
 * du rayon, pas répétée sur chaque carte ; le reste vit dans la fiche.
 *
 * La couverture est celle publiée dans l'espace de gestion : aucune image n'est
 * remplacée côté portail.
 */

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
  initialQuery = '',
  initialDomain = '',
}: {
  publications: Publication[];
  taxonomy: Taxonomy;
  /** La recherche pré-remplie, par exemple depuis un mot-clé de fiche. */
  initialQuery?: string;
  /** Le domaine ouvert d'emblée, par exemple depuis un lien du pied de page :
   * il s'applique en filtre. */
  initialDomain?: string;
}) {
  const years = publicationYears(publications);

  /* L'objet doit garder son identité d'un rendu à l'autre : sans cela, le
   * catalogue croirait à un changement d'adresse et remettrait les filtres à
   * zéro à chaque frappe. */
  const initialFilters = useMemo(
    () => (initialDomain ? { domain: initialDomain } : undefined),
    [initialDomain],
  );

  /* Les filtres : la date de publication, le domaine scientifique et le niveau
   * d'études. Le domaine se choisit ici, et un lien du pied de page peut le
   * pré-sélectionner. */
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
  if (taxonomy.domains.length > 0) {
    filters.push({
      key: 'domain',
      label: 'Domaine',
      allLabel: 'Tous les domaines',
      options: taxonomy.domains,
      value: (item: Publication) => item.domain,
    });
  }
  if (taxonomy.levels.length > 0) {
    filters.push({
      key: 'level',
      label: "Niveau d'études",
      allLabel: 'Tous les niveaux',
      options: taxonomy.levels,
      value: (item: Publication) => item.level,
    });
  }

  return (
    <CatalogExplorer
      items={publications}
      searchPlaceholder="Rechercher…"
      searchText={(item: Publication) =>
        [item.title, item.subtitle, item.summary, item.authors, item.category, item.domain, item.level, ...(item.keywords ?? [])]
          .filter(Boolean)
          .join(' ')}
      filters={filters}
      initialQuery={initialQuery}
      initialFilters={initialFilters}
      showAllTab={false}
      resultNoun="document"
      emptyLabel="Aucun document ne correspond à cette recherche. Modifiez les mots-clés ou les filtres."
      groupBy={(item: Publication) => publicationShelf(item)}
      groupOrder={SHELVES}
      groupFallbackLabel={OTHER_SHELF_LABEL}
      gridClassName="pub-grid"
      shelfHref={(shelfName) => `/publications/rayon/${shelfKey(shelfName)}`}
      renderItem={(publication: Publication) => (
        <PublicationCard key={publication.id} publication={publication} />
      )}
    />
  );
}
