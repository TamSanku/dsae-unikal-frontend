'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/*
 * La recherche dans le document, quel que soit son format.
 *
 * On parcourt le texte réellement affiché, et on marque les correspondances
 * avec l'API « Custom Highlight » du navigateur. Le document n'est donc jamais
 * modifié : on ne découpe pas les nœuds de texte, on ne réécrit pas le HTML.
 * C'est ce qui rend la recherche sûre — un document venu de l'extérieur n'est
 * pas retouché — et suffisante pour tous les formats à la fois : PDF (couche de
 * texte), Word converti, classeur, texte brut.
 *
 * La recherche est visuelle et temporaire : elle ne se confond pas avec les
 * annotations du visiteur, qui sont, elles, des gestes gardés.
 */

export type SearchHit = {
  /** La page, quand le format en a (PDF). 0 sinon. */
  page: number;
  /** Le texte de la correspondance, tel qu'il est affiché. */
  text: string;
  range: Range;
};

const ALL_HIGHLIGHT = 'reader-find';
const ACTIVE_HIGHLIGHT = 'reader-find-current';

/* L'API n'existe pas partout (Firefox, Safari). On le détecte une fois : sans
 * elle, la recherche compte et défile, mais ne colore pas. Le compte et les
 * flèches restent donc utiles. */
function highlightApiAvailable(): boolean {
  return typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';
}

/** Le nœud de texte est-il dans un élément qu'on ne cherche pas ? */
function isSkipped(node: Node): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  /* La barre du lecteur, les avis, les messages : ce n'est pas le document. */
  if (parent.closest('[data-search-skip]')) return true;
  const style = window.getComputedStyle(parent);
  return style.display === 'none' || style.visibility === 'hidden';
}

/** Tous les nœuds de texte visibles sous `root`, dans l'ordre de lecture. */
function textNodes(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const value = node.nodeValue ?? '';
      if (!value.trim()) return NodeFilter.FILTER_REJECT;
      if (isSkipped(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** La page d'un nœud, quand le document est paginé. */
function pageOf(node: Node): number {
  const element = node.parentElement?.closest<HTMLElement>('[data-reader-page]');
  return element ? Number(element.dataset.readerPage) + 1 : 0;
}

/*
 * La racine est passée par référence, et non par valeur : le cadre du lecteur
 * n'existe pas encore quand le crochet est appelé pour la première fois. La
 * référence, elle, est la même du début à la fin ; on lit son contenu au moment
 * du calcul.
 */
export function useDocumentSearch(rootRef: RefObject<HTMLElement | null>, query: string) {
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(1);
  /* Le document se remplit par étapes (les pages du PDF arrivent l'une après
   * l'autre) : tant qu'il bouge, le compte n'est pas définitif. On le dit. */
  const [pending, setPending] = useState(false);
  const rangesRef = useRef<SearchHit[]>([]);

  /* Les correspondances sont recalculées quand le mot change, et quand le
   * document change de contenu : une page qui arrive peut contenir le mot. */
  const recompute = useCallback(() => {
    const needle = query.trim();
    const root = rootRef.current;
    if (!root || !needle) {
      rangesRef.current = [];
      setHits([]);
      return;
    }

    const pattern = new RegExp(escapeRegExp(needle), 'gi');
    const found: SearchHit[] = [];

    for (const node of textNodes(root)) {
      const text = node.nodeValue ?? '';
      /* Un mot ne se coupe pas entre deux nœuds : on cherche donc dans chaque
       * nœud, ce qui correspond à une portion de texte affichée. */
      let match = pattern.exec(text);
      while (match) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        found.push({ page: pageOf(node), text: match[0], range });
        if (match[0].length === 0) pattern.lastIndex += 1;
        match = pattern.exec(text);
      }
      pattern.lastIndex = 0;
    }

    rangesRef.current = found;
    setHits(found);
  }, [rootRef, query]);

  /* Le contenu du lecteur peut changer après coup (pages du PDF, feuilles d'un
   * classeur). On réobserve, avec un court délai : un rendu complet déclenche
   * des dizaines de mutations, on n'en recalcule qu'une fois. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !query.trim()) {
      setPending(false);
      return;
    }
    setPending(true);
    let timer = 0;
    const settle = () => {
      setPending(false);
      recompute();
    };
    timer = window.setTimeout(settle, 220);

    const observer = new MutationObserver(() => {
      setPending(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 220);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      setPending(false);
    };
  }, [rootRef, query, recompute]);

  /* Le rang courant revient au début à chaque nouveau mot. */
  useEffect(() => {
    setActive(1);
  }, [query]);

  /* On colore toutes les correspondances, et la courante plus franchement :
   * on voit où l'on est dans le document, pas seulement dans le compte. */
  useEffect(() => {
    if (!highlightApiAvailable()) return;
    const all = new Highlight();
    const current = new Highlight();
    hits.forEach((hit, index) => {
      if (index === active - 1) current.add(hit.range);
      else all.add(hit.range);
    });
    CSS.highlights.set(ALL_HIGHLIGHT, all);
    CSS.highlights.set(ACTIVE_HIGHLIGHT, current);
    return () => {
      CSS.highlights.delete(ALL_HIGHLIGHT);
      CSS.highlights.delete(ACTIVE_HIGHLIGHT);
    };
  }, [hits, active]);

  /* Le résultat courant est amené sous les yeux : c'est tout l'intérêt des
   * flèches. On centre plutôt que de coller en haut, pour garder le contexte. */
  const scrollToActive = useCallback((index: number) => {
    const hit = rangesRef.current[index - 1];
    if (!hit) return;
    const element = hit.range.startContainer.parentElement;
    element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  const step = useCallback(
    (delta: number) => {
      const total = rangesRef.current.length;
      if (total === 0) return;
      /* On boucle : après le dernier, on revient au premier. */
      const next = ((active - 1 + delta) % total + total) % total + 1;
      setActive(next);
      scrollToActive(next);
    },
    [active, scrollToActive]
  );

  /* Aller à un résultat précis (le premier, à la frappe). */
  useEffect(() => {
    if (hits.length === 0) return;
    scrollToActive(1);
    /* On ne dépend que du nombre de résultats : rejouer le défilement à chaque
     * frappe ferait sauter la page sous les doigts. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hits.length]);

  return { hits, active, pending, step, setActive, scrollToActive };
}
