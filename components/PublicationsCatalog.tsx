'use client';

import Link from 'next/link';
import type { Publication, Taxonomy } from '@/lib/backend';
import AuthorList from '@/components/AuthorList';
import PublicationCover from '@/components/PublicationCover';
import StarRating from '@/components/StarRating';
import CatalogExplorer, { type CatalogFilter } from '@/components/CatalogExplorer';

/*
 * Le catalogue des publications : recherche, onglets par domaine, filtres par
 * date et par niveau.
 *
 * Une carte ne montre que l'essentiel : la couverture, le titre, le signataire,
 * la date et les étoiles. Tout le reste vit dans la fiche. Les onglets sont les
 * domaines scientifiques du serveur ; les filtres reprennent la date et, sous
 * chaque domaine, le niveau d'études.
 *
 * Les documents se rangent par étagère : une section par catégorie (le type de
 * document, « Article de recherche », « Mémoire et thèse »…), dans l'ordre du
 * serveur. Chaque rayon porte son nom et son compte, et ses cartes se
 * disposent sur six colonnes au bureau, trois à quatre sur tablette et deux
 * sur téléphone (voir `.catalog-grid` et sa classe `documents-grid`).
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
  initialTab = '',
  initialQuery = '',
}: {
  publications: Publication[];
  taxonomy: Taxonomy;
  /** Le domaine ouvert d'emblée, par exemple depuis un lien du pied de page. */
  initialTab?: string;
  /** La recherche pré-remplie, par exemple depuis un mot-clé de fiche. */
  initialQuery?: string;
}) {
  const years = publicationYears(publications);

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

  return (
    <CatalogExplorer
      items={publications}
      searchPlaceholder="Rechercher un document, un auteur, un mot-clé…"
      searchText={(item: Publication) =>
        [item.title, item.subtitle, item.summary, item.authors, item.category, item.domain, item.level, ...(item.keywords ?? [])]
          .filter(Boolean)
          .join(' ')
      }
      tabs={taxonomy.domains.map((domain) => ({ key: domain, label: domain }))}
      tabOf={(item: Publication) => item.domain}
      filters={filters}
      initialTab={initialTab}
      initialQuery={initialQuery}
      resultNoun="document"
      emptyLabel="Aucun document ne correspond à cette recherche. Modifiez les mots-clés ou les filtres."
      groupBy={(item: Publication) => item.category}
      groupOrder={taxonomy.publicationCategories}
      groupFallbackLabel="Autres documents"
      gridClassName="documents-grid"
      renderItem={(publication: Publication) => (
        <article key={publication.id} className="publication-card large publication-card-cover">
          <Link
            href={`/publications/${publication.id}`}
            className="publication-cover-link"
            aria-label={`Ouvrir « ${publication.title} »`}
          >
            <PublicationCover title={publication.title} image={publication.coverUrl} />
          </Link>

          <div className="publication-card-body">
            <h3>
              <Link href={`/publications/${publication.id}`}>{publication.title}</Link>
            </h3>
            <AuthorList authors={publication.authorsList} />
            {(publication.domain || publication.level) && (
              <p className="publication-tags">
                {publication.domain && <span className="mini-tag">{publication.domain}</span>}
                {publication.level && <span className="mini-tag ghost">{publication.level}</span>}
              </p>
            )}
            {publication.publishedLabel && <p className="publication-date">{publication.publishedLabel}</p>}
            <StarRating
              value={publication.reviewSummary.average}
              count={publication.reviewSummary.count}
            />
          </div>
        </article>
      )}
    />
  );
}
