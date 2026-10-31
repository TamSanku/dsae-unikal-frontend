'use client';

import { useMemo, useState, type ReactNode } from 'react';

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
  filters = [],
  renderItem,
  emptyLabel,
  resultNoun = 'résultat',
}: {
  items: any[];
  searchText: (item: any) => string;
  searchPlaceholder?: string;
  tabs: CatalogTab[];
  tabOf: (item: any) => string;
  filters?: CatalogFilter[];
  renderItem: (item: any) => ReactNode;
  emptyLabel: string;
  resultNoun?: string;
}) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('');
  const [chosen, setChosen] = useState<Record<string, string>>({});

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (tab && tabOf(item) !== tab) return false;
      if (needle && !searchText(item).toLowerCase().includes(needle)) return false;
      for (const filter of filters) {
        const selected = chosen[filter.key] ?? '';
        if (!selected) continue;
        const passes = filter.test ? filter.test(item, selected) : filter.value(item) === selected;
        if (!passes) return false;
      }
      return true;
    });
  }, [items, query, tab, chosen, filters, tabOf, searchText]);

  const activeFilters = filters.filter((filter) => chosen[filter.key]);

  return (
    <div className="catalog">
      <div className="catalog-controls">
        <div className="catalog-search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </div>

        {filters.length > 0 && (
          <div className="catalog-filters">
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

      {tabs.length > 0 && (
        <div className="catalog-tabs" role="tablist" aria-label="Filtrer par catégorie">
          <button
            type="button"
            role="tab"
            aria-selected={tab === ''}
            className={tab === '' ? 'catalog-tab active' : 'catalog-tab'}
            onClick={() => setTab('')}
          >
            Tout
          </button>
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
      ) : (
        renderItem && <div className="catalog-grid">{visible.map((item) => renderItem(item))}</div>
      )}
    </div>
  );
}
