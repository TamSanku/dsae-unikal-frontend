'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/*
 * Ce que le lecteur retient d'une visite à l'autre : les annotations du
 * visiteur, et où il en était.
 *
 * Tout reste dans le navigateur de la personne qui lit — rien ne part au
 * serveur. Une annotation est un geste personnel sur un document, pas une
 * donnée du portail : elle n'a pas à être publiée, ni mesurée, ni rattachée à
 * qui que ce soit. C'est aussi ce qui la rend immédiate : pas d'attente réseau
 * entre la sélection et le trait.
 *
 * Une annotation se garde par document, et se repère par la page plus des
 * rectangles **en fraction de la page** (0 à 1). Le zoom change la taille
 * dessinée sans changer ces fractions : un surlignage posé à 100 % tombe donc
 * juste à 200 %, sans qu'on ait à le recalculer.
 *
 * Le stockage peut refuser d'écrire (navigation privée, quota plein) : dans ce
 * cas la lecture continue, simplement sans mémoire. Un échec de stockage ne
 * doit jamais empêcher de lire.
 */

export type NoteTool = 'highlight' | 'underline' | 'strike';

/* Les outils du lecteur. « erase » n'est pas un type d'annotation : c'est le
 * mode où un clic retire un trait, au lieu d'en poser un. */
export type ReaderTool = NoteTool | 'erase';

/* L'outil actif, quand il y en a un. La recherche est un mode à part, qui
 * n'écrit pas dans le document : elle n'apparaît donc pas ici. */
export const NOTE_TOOLS: NoteTool[] = ['highlight', 'underline', 'strike'];

/** Un rectangle en fraction de la page : 0 = bord gauche/haut, 1 = bord droit/bas. */
export type NoteRect = { x: number; y: number; w: number; h: number };

export type Note = {
  id: string;
  page: number;
  kind: NoteTool;
  /** Une ligne de texte sélectionnée donne un rectangle ; un paragraphe, plusieurs. */
  rects: NoteRect[];
};

export type ReadingProgress = {
  page: number;
  total: number;
  zoomIndex: number;
};

const NOTES_PREFIX = 'dsae:lecteur:notes:';
const PROGRESS_PREFIX = 'dsae:lecteur:progression:';

/*
 * Une clé courte et stable pour un document.
 *
 * L'adresse du média porte un identifiant, mais elle peut aussi porter une
 * chaîne de requête ou changer d'hôte selon l'environnement : on la hache, ce
 * qui donne la même clé partout pour le même document.
 */
export function documentKey(url: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < url.length; index += 1) {
    hash ^= url.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function read<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    /* Données illisibles ou stockage refusé : on repart de zéro. */
    return null;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Quota plein ou navigation privée : la lecture continue sans mémoire. */
  }
}

/** Les annotations d'un document, et les gestes pour les tenir à jour. */
export function useReaderNotes(key: string) {
  const storageKey = NOTES_PREFIX + key;
  const [notes, setNotes] = useState<Note[]>([]);

  /* La lecture initiale se fait après le montage : le rendu serveur ne voit pas
   * le stockage du navigateur, et un premier rendu qui divergerait ferait
   * clignoter la page. */
  useEffect(() => {
    setNotes(read<Note[]>(storageKey) ?? []);
  }, [storageKey]);

  const persist = useCallback(
    (next: Note[]) => {
      setNotes(next);
      write(storageKey, next);
    },
    [storageKey]
  );

  /* Un seul appel peut poser plusieurs annotations : une sélection qui
   * traverse une page donne un groupe par page. Tout passe par un seul
   * enregistrement, sinon le dernier appel écraserait les précédents — chacun
   * partant de la même liste, pas encore mise à jour. */
  const addNotes = useCallback(
    (groups: { page: number; kind: NoteTool; rects: NoteRect[] }[]) => {
      const fresh = groups
        .filter((group) => group.rects.length > 0)
        .map((group) => ({
          id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          page: group.page,
          kind: group.kind,
          rects: group.rects,
        }));
      if (fresh.length === 0) return;
      persist([...notes, ...fresh]);
    },
    [notes, persist]
  );

  const eraseNote = useCallback(
    (id: string) => persist(notes.filter((note) => note.id !== id)),
    [notes, persist]
  );

  const clearNotes = useCallback(() => persist([]), [persist]);

  /* Les annotations de la page affichée : c'est tout ce qu'une page a besoin de
   * connaître, et le tri évite de reparcourir la liste à chaque rendu. */
  const byPage = useMemo(() => {
    const map = new Map<number, Note[]>();
    for (const note of notes) {
      const list = map.get(note.page);
      if (list) list.push(note);
      else map.set(note.page, [note]);
    }
    return map;
  }, [notes]);

  return { notes, byPage, addNotes, eraseNote, clearNotes };
}

/** Où le visiteur en était dans un document. */
export function useReadingProgress(key: string) {
  const storageKey = PROGRESS_PREFIX + key;
  const [restored, setRestored] = useState<ReadingProgress | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = read<ReadingProgress>(storageKey);
    /* Une page unique ne se « reprend » pas : il n'y a rien à reprendre. */
    setRestored(saved && saved.page > 1 ? saved : null);
    setLoaded(true);
  }, [storageKey]);

  const save = useCallback(
    (progress: ReadingProgress) => {
      write(storageKey, progress);
    },
    [storageKey]
  );

  const forget = useCallback(() => {
    setRestored(null);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* Rien à faire : l'effacement a échoué, la lecture continue. */
    }
  }, [storageKey]);

  return { restored, loaded, save, forget };
}

/*
 * La position de défilement, pour les formats qui se lisent au kilomètre —
 * Word, classeur, texte — et non page par page. On garde une fraction (0 à 1)
 * de la hauteur parcourue, et non un nombre de pixels : la même reprise tombe
 * donc juste à n'importe quelle largeur d'écran.
 */
const SCROLL_PREFIX = 'dsae:lecteur:defilement:';

export function readScroll(key: string): number | null {
  const value = read<number>(SCROLL_PREFIX + key);
  return typeof value === 'number' && value > 0.02 ? value : null;
}

export function writeScroll(key: string, ratio: number): void {
  write(SCROLL_PREFIX + key, Math.min(1, Math.max(0, ratio)));
}

/*
 * La position de la recherche, gardée pendant la session seulement.
 *
 * C'est une commodité, pas une donnée de lecture : on la range dans
 * `sessionStorage`, qui disparaît avec l'onglet. Un mot cherché pour un besoin
 * précis n'a pas à être retrouvé des semaines plus tard, ni conservé à côté des
 * annotations, qui sont des gestes volontaires.
 */
export type SearchState = {
  /** Le mot cherché, tel que tapé. */
  query: string;
  /** La page du résultat courant, quand le format en a. */
  page: number;
  /** Le rang du résultat courant, à partir de 1. */
  index: number;
};

const SEARCH_PREFIX = 'dsae:lecteur:recherche:';

export function readSearch(key: string): SearchState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(SEARCH_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SearchState;
    return typeof parsed?.query === 'string' && parsed.query ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSearch(key: string, state: SearchState): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SEARCH_PREFIX + key, JSON.stringify(state));
  } catch {
    /* Sans mémoire de recherche, on cherche quand même. */
  }
}

export function clearSearch(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(SEARCH_PREFIX + key);
  } catch {
    /* Rien à faire. */
  }
}

/*
 * Le texte d'un nœud, découpé par rapport au mot cherché.
 *
 * Une recherche naïve qui ne renvoie que « trouvé / pas trouvé » oblige à
 * relire la page entière pour trouver le mot. On rend donc les morceaux : ce
 * qui précède, ce qui correspond, ce qui suit. La mise en évidence devient un
 * simple rendu, et le décompte se fait sur la même base que l'affichage — les
 * deux ne peuvent pas diverger.
 */
export type TextChunk = { text: string; match: boolean };

/*
 * Un mot cherche est du texte, pas un motif : on neutralise donc ce qui aurait
 * un sens dans une expression reguliere. Une recherche sur « (2026) » doit
 * trouver la parenthese, pas creer un groupe.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function splitByQuery(text: string, query: string): TextChunk[] {
  if (!query) return [{ text, match: false }];
  const pattern = new RegExp(escapeRegExp(query), 'gi');
  const chunks: TextChunk[] = [];
  let last = 0;
  let found = pattern.exec(text);
  while (found) {
    const start = found.index;
    if (start > last) chunks.push({ text: text.slice(last, start), match: false });
    chunks.push({ text: found[0], match: true });
    last = start + found[0].length;
    /* Un mot vide ferait tourner la boucle sans avancer : on force le pas. */
    if (found[0].length === 0) pattern.lastIndex += 1;
    found = pattern.exec(text);
  }
  if (last < text.length) chunks.push({ text: text.slice(last), match: false });
  return chunks.length ? chunks : [{ text, match: false }];
}

/** Combien de fois le mot apparait dans un texte. */
export function countMatches(text: string, query: string): number {
  if (!query) return 0;
  return (text.match(new RegExp(escapeRegExp(query), 'gi')) ?? []).length;
}
