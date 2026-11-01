'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  collectionLabel,
  resultHref,
  searchSite,
  type GlobalSearchResult,
} from '@/lib/backend';
import { SearchIcon } from '@/components/icons';

/*
 * La recherche globale, ouverte depuis la loupe de l'en-tête.
 *
 * Un clic sur la loupe déplie un champ posé sous la barre : on tape un mot, le
 * portail interroge toutes les rubriques et montre les fiches qui correspondent.
 * Chaque résultat mène à sa fiche (actualité, publication, membre, alumni…).
 *
 * Le champ n'interroge le serveur qu'après une courte pause — on ne lance pas
 * une requête par frappe. Une requête périmée est ignorée : seule la dernière
 * compte. La liste ne montre jamais de contenu inventé ; sans réponse, elle
 * affiche franchement qu'il n'y a rien.
 */
export default function SiteSearch() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  /* Le numéro de la dernière requête : une réponse plus ancienne est ignorée. */
  const requestId = useRef(0);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setTouched(false);
  }, []);

  /* La loupe s'ouvre et se ferme au clavier : Échap referme, Ctrl/⌘+K ouvre. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close]);

  /* Refermer le panneau quand on change de page. */
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /* La requête part après une pause de 250 ms : on épargne le serveur et le
   * lecteur, qui tape encore. */
  useEffect(() => {
    const value = query.trim();
    if (!value) {
      setResults([]);
      setLoading(false);
      setTouched(false);
      return;
    }
    setLoading(true);
    setTouched(true);
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      const found = await searchSite(value);
      if (id !== requestId.current) return;
      setResults(found);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className={`site-search${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="site-search-toggle"
        aria-label={open ? 'Fermer la recherche' : 'Rechercher dans le site'}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <SearchIcon size={18} />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="site-search-backdrop"
            aria-label="Fermer la recherche"
            onClick={close}
          />
          <div className="site-search-panel" role="dialog" aria-label="Recherche globale">
            <div className="site-search-field">
              <SearchIcon size={18} />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher une actualité, une publication, un profil…"
                aria-label="Rechercher dans le site"
              />
            </div>

            {touched && (
              <div className="site-search-results" aria-live="polite">
                {loading ? (
                  <p className="site-search-note">Recherche en cours…</p>
                ) : results.length === 0 ? (
                  <p className="site-search-note">
                    Aucun résultat pour « {query.trim()} ». Essayez un autre mot.
                  </p>
                ) : (
                  <>
                    <p className="site-search-note">
                      {results.length} résultat{results.length > 1 ? 's' : ''}
                    </p>
                    <ul>
                      {results.map((result) => (
                        <li key={`${result.collection}-${result.id}`}>
                          <Link href={resultHref(result)} onClick={close} className="site-search-result">
                            <span className="site-search-badge">{collectionLabel(result.collection)}</span>
                            <span className="site-search-copy">
                              <strong>{result.title}</strong>
                              {(result.summary || result.subtitle) && (
                                <small>{result.summary || result.subtitle}</small>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
