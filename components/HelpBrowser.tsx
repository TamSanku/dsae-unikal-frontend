'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { SearchIcon } from '@/components/icons';

/*
 * Le navigateur de l'aide : une barre de recherche posée au-dessus d'une longue
 * liste, groupée par thème. Elle ne fait que resserrer ce qui est déjà là —
 * rien n'est demandé au serveur, et aucun contenu n'est inventé.
 *
 * La comparaison ignore les accents et la casse : « equipe » retrouve
 * « Équipe », « ou » retrouve « où ». Chaque mot tapé doit se retrouver dans
 * l'entrée (titre + texte cherchable) ; les mots se cumulent donc. Un compteur
 * dit combien d'entrées restent, et un bouton remet tout à zéro.
 *
 * Les textes riches (les liens internes d'une réponse, les étapes d'un guide)
 * sont écrits par la page et passés en `body` : ce composant ne gère que la
 * recherche, le regroupement et l'affichage.
 */

/** Réduit un texte à sa forme comparable : sans accents, en minuscules. */
function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export type HelpEntry = {
  key: string;
  /** Le titre affiché : la question, ou le titre du guide. */
  title: string;
  /** Le texte dans lequel on cherche, en clair (titre + réponse ou étapes). */
  searchText: string;
  /** Le corps affiché sous le titre. */
  body: ReactNode;
};

export type HelpGroup = {
  key: string;
  label: string;
  entries: HelpEntry[];
};

export default function HelpBrowser({
  groups,
  placeholder,
  noun,
  variant,
  emptyHint,
}: {
  groups: HelpGroup[];
  placeholder: string;
  /** Le nom de ce que l'on compte, au singulier : « question », « guide ». */
  noun: string;
  /** La forme d'une entrée : une question repliable, ou une fiche de guide. */
  variant: 'faq' | 'guide';
  emptyHint: string;
}) {
  const [query, setQuery] = useState('');

  const terms = useMemo(() => fold(query).split(/\s+/).filter(Boolean), [query]);
  const filtering = terms.length > 0;

  const total = useMemo(
    () => groups.reduce((sum, group) => sum + group.entries.length, 0),
    [groups],
  );

  /* Les groupes visibles, réduits aux entrées qui portent tous les mots tapés.
   * Sans mot, tout reste. Un groupe dont plus rien ne reste disparaît. */
  const visible = useMemo(() => {
    if (!filtering) return groups;
    return groups
      .map((group) => ({
        ...group,
        entries: group.entries.filter((entry) => {
          const haystack = fold(entry.searchText);
          return terms.every((term) => haystack.includes(term));
        }),
      }))
      .filter((group) => group.entries.length > 0);
  }, [groups, filtering, terms]);

  const count = visible.reduce((sum, group) => sum + group.entries.length, 0);

  return (
    <div className="help-browser">
      <div className="help-search">
        <div className="help-search-field">
          <SearchIcon size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          {filtering && (
            <button type="button" className="help-search-clear" onClick={() => setQuery('')}>
              Effacer
            </button>
          )}
        </div>
        <p className="help-search-count" aria-live="polite">
          {filtering
            ? count === 0
              ? `Aucun résultat pour « ${query.trim()} ».`
              : `${count} ${noun}${count > 1 ? 's' : ''} sur ${total}`
            : `${total} ${noun}${total > 1 ? 's' : ''}`}
        </p>
      </div>

      {count === 0 ? (
        <p className="help-empty">{emptyHint}</p>
      ) : (
        visible.map((group) => (
          <section className="help-group" key={group.key} aria-label={group.label}>
            <h4 className="help-group-title">
              {group.label}
              <span className="help-group-count">{group.entries.length}</span>
            </h4>

            {variant === 'faq' ? (
              <div className="faq-list">
                {group.entries.map((entry) => (
                  <details className="faq-item" key={entry.key}>
                    <summary>{entry.title}</summary>
                    <div className="faq-answer">{entry.body}</div>
                  </details>
                ))}
              </div>
            ) : (
              <div className="help-guide-grid">
                {group.entries.map((entry) => (
                  <article className="info-card help-guide" key={entry.key}>
                    <h5>{entry.title}</h5>
                    {entry.body}
                  </article>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}
