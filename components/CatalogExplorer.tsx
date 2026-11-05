'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { FilterIcon, SearchIcon } from '@/components/icons';

/*
 * Le catalogue : une barre de recherche, des filtres à côté, des onglets
 * horizontaux en dessous, puis les cartes.
 *
 * Le composant ne connaît ni les publications ni l'équipe : il reçoit les
 * éléments, la façon d'en tirer le texte de recherche et l'onglet, les filtres,
 * et un rendu de carte. Chaque page garde ainsi sa carte, et la mécanique de
 * recherche et de filtrage reste écrite une seule fois.
 *
 * Rien n'est inventé : sans élément correspondant, le catalogue affiche son
 * message vide ; les onglets et les filtres viennent des listes du serveur.
 */

export type CatalogTab = { key: string; label: string };

export type CatalogFilter = {
  key: string;
  label: string;
  /** Le libellé « aucun filtre » du menu. */
  allLabel: string;
  options: string[];
  /** La valeur de l'élément pour ce filtre ; '' = non concerné. */
  value: (item: any) => string;
  /** Vrai si l'élément passe le filtre à la valeur choisie. Par défaut, on
   * compare `value(item)` à la valeur. Une liste vide = aucun filtre. */
  test?: (item: any, selected: string) => boolean;
};

export default function CatalogExplorer({
  items,
  searchText,
  searchPlaceholder = 'Rechercher…',
  tabs,
  tabOf,
  tabMatch,
  filters = [],
  renderItem,
  emptyLabel,
  resultNoun = 'résultat',
  initialTab = '',
  initialQuery = '',
  allTabKey = '',
  allTabLabel = 'Tout',
  showAllTab = true,
  groupBy,
  groupOrder,
  groupFallbackLabel = 'Autres',
  gridClassName = '',
}: {
  items: any[];
  searchText: (item: any) => string;
  searchPlaceholder?: string;
  tabs: CatalogTab[];
  tabOf: (item: any) => string;
  /** Vrai si l'élément relève de l'onglet donné. Par défaut, on compare
   * `tabOf(item)` à l'onglet. Une personne peut relever de plusieurs
   * catégories : la page Équipe s'en sert. */
  tabMatch?: (item: any, tab: string) => boolean;
  filters?: CatalogFilter[];
  renderItem: (item: any) => ReactNode;
  emptyLabel: string;
  resultNoun?: string;
  /** L'onglet ouvert d'emblée (par exemple depuis un lien du pied de page). */
  initialTab?: string;
  /** La recherche pré-remplie (par exemple depuis un mot-clé de fiche). */
  initialQuery?: string;
  /** L'onglet qui vaut « tout voir » : le choisir n'applique aucun filtre. Par
   * défaut la clé vide, celle du bouton « Tout ». Les actualités s'en servent
   * pour que « À la une » montre tout. */
  allTabKey?: string;
  /** Le libellé du bouton « tout voir » ajouté en tête. */
  allTabLabel?: string;
  /** Afficher le bouton « tout voir » ajouté en tête. Faux quand une catégorie
   * réelle joue déjà ce rôle. */
  showAllTab?: boolean;
  /** La catégorie d'un élément : le catalogue le range alors sous son nom,
   * comme un rayon d'étagère. Absent, les cartes restent dans une seule grille. */
  groupBy?: (item: any) => string;
  /** L'ordre des rayons ; un rayon inconnu vient ensuite, dans l'ordre
   * d'apparition. */
  groupOrder?: string[];
  /** Le nom du rayon des éléments sans catégorie. */
  groupFallbackLabel?: string;
  /** Une classe posée sur la grille des cartes (largeur des colonnes). */
  gridClassName?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState(initialTab || allTabKey);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  /* Les filtres restent repliés : l'icône d'entonnoir les ouvre et les referme. */
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* Un lien qui ne change que la requête (le pied de page, un mot-clé de fiche,
   * par exemple) réutilise le même composant : l'onglet et la recherche doivent
   * suivre la nouvelle adresse. */
  useEffect(() => {
    setTab(initialTab || allTabKey);
  }, [initialTab, allTabKey]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      /* L'onglet « tout voir » (la clé vide, celle de « Tout » et « À la une »)
       * n'écarte rien : il montre la liste entière. */
      if (tab && tab !== allTabKey && !(tabMatch ? tabMatch(item, tab) : tabOf(item) === tab)) return false;
      if (needle && !searchText(item).toLowerCase().includes(needle)) return false;
      for (const filter of filters) {
        const selected = chosen[filter.key] ?? '';
        if (!selected) continue;
        const passes = filter.test ? filter.test(item, selected) : filter.value(item) === selected;
        if (!passes) return false;
      }
      return true;
    });
  }, [items, query, tab, chosen, filters, tabOf, tabMatch, searchText, allTabKey]);

  const activeFilters = filters.filter((filter) => chosen[filter.key]);

  /* Les rayons : on range les éléments visibles sous leur catégorie, dans
   * l'ordre demandé (celui du serveur), puis les catégories rencontrées en
   * chemin. Un élément sans catégorie va dans « Autres », en dernier. */
  const shelves = useMemo(() => {
    if (!groupBy) return null;
    const buckets = new Map<string, any[]>();
    for (const item of visible) {
      const name = groupBy(item).trim() || groupFallbackLabel;
      const bucket = buckets.get(name);
      if (bucket) bucket.push(item);
      else buckets.set(name, [item]);
    }
    const ordered = groupOrder ?? [];
    const names = Array.from(buckets.keys()).sort((a, b) => {
      const ai = ordered.indexOf(a);
      const bi = ordered.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? ordered.length : ai) - (bi === -1 ? ordered.length : bi);
      return 0;
    });
    return names.map((name) => ({ name, items: buckets.get(name) ?? [] }));
  }, [visible, groupBy, groupOrder, groupFallbackLabel]);

  return (
    <div className="catalog">
      <div className="catalog-controls">
        <div className="catalog-search">
          <SearchIcon size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </div>

        {filters.length > 0 && (
          <button
            type="button"
            className={`catalog-filter-toggle${filtersOpen ? ' is-open' : ''}${activeFilters.length > 0 ? ' has-active' : ''}`}
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters-panel"
            onClick={() => setFiltersOpen((value) => !value)}
          >
            <FilterIcon size={17} />
            <span>Filtres</span>
            {activeFilters.length > 0 && <em className="catalog-filter-count">{activeFilters.length}</em>}
          </button>
        )}

        {filters.length > 0 && filtersOpen && (
          <div className="catalog-filters" id="catalog-filters-panel">
            {filters.map((filter) => (
              <label key={filter.key} className="catalog-filter">
                <span>{filter.label}</span>
                <select
                  value={chosen[filter.key] ?? ''}
                  onChange={(event) =>
                    setChosen((current) => ({ ...current, [filter.key]: event.target.value }))
                  }
                >
                  <option value="">{filter.allLabel}</option>
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}
      </div>

      {(tabs.length > 0 || showAllTab) && (
        <div className="catalog-tabs" role="tablist" aria-label="Filtrer par catégorie">
          {showAllTab && (
            <button
              type="button"
              role="tab"
              aria-selected={tab === allTabKey}
              className={tab === allTabKey ? 'catalog-tab active' : 'catalog-tab'}
              onClick={() => setTab(allTabKey)}
            >
              {allTabLabel}
            </button>
          )}
          {tabs.map((entry) => (
            <button
              key={entry.key}
              type="button"
              role="tab"
              aria-selected={tab === entry.key}
              className={tab === entry.key ? 'catalog-tab active' : 'catalog-tab'}
              onClick={() => setTab(entry.key)}
            >
              {entry.label}
            </button>
          ))}
        </div>
      )}

      <p className="catalog-count">
        {visible.length} {resultNoun}
        {visible.length > 1 ? 's' : ''}
        {activeFilters.length > 0 && (
          <button
            type="button"
            className="catalog-reset"
            onClick={() => setChosen({})}
          >
            Réinitialiser les filtres
          </button>
        )}
      </p>

      {visible.length === 0 ? (
        <p className="catalog-empty">{emptyLabel}</p>
      ) : shelves ? (
        <div className="catalog-shelves">
          {shelves.map((shelf) => (
            <section key={shelf.name} className="catalog-shelf">
              <div className="catalog-shelf-head">
                <h3>{shelf.name}</h3>
                <span className="catalog-shelf-count">
                  {shelf.items.length} {resultNoun}
                  {shelf.items.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className={`catalog-grid${gridClassName ? ` ${gridClassName}` : ''}`}>
                {shelf.items.map((item) => renderItem(item))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={`catalog-grid${gridClassName ? ` ${gridClassName}` : ''}`}>
          {visible.map((item) => renderItem(item))}
        </div>
      )}
    </div>
  );
}
