import type { Publication } from '@/lib/backend';

/*
 * Les étagères du catalogue des publications.
 *
 * Un document se range selon sa **nature** : un article scientifique, un
 * mémoire (de graduat, de licence, de master), une thèse. C'est le classement
 * qu'un lecteur attend d'une bibliothèque ; le domaine scientifique, lui,
 * traverse toutes les étagères et sert de filtre, pas de rayon.
 *
 * L'ordre suit celui d'une étagère : les articles d'abord, puis les travaux
 * d'étudiants du diplôme le plus modeste au plus élevé. « Autres documents »
 * ferme la marche pour ne rien perdre.
 *
 * Le rattachement d'un mémoire à PADEM ou au LMD se lit dans le niveau
 * d'études (« Licence 3 », « Master 2 »…) ou, à défaut, dans la faculté. Tant
 * que le backend ne pose pas ce repère, un mémoire sans système connu tombe
 * dans « Autres documents » : on ne devine pas un diplôme.
 */

export const SHELVES: string[] = [
  'Articles scientifiques',
  'Mémoires de graduats (PADEM)',
  'Mémoires de licence (PADEM)',
  'Mémoires de licence (LMD)',
  'Mémoires de masters (LMD)',
  'Thèses',
  'Autres documents',
];

export const OTHER_SHELF_LABEL = 'Autres documents';

function normalize(value: string | null | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Le libellé de l'étagère d'un document, d'après sa nature et son niveau. */
export function publicationShelf(publication: Publication): string {
  const category = normalize(publication.category);
  /* Tout le texte disponible, sans accents : le système d'études (PADEM, LMD)
   * et le diplôme (graduat, licence, master) peuvent être écrits dans la
   * catégorie, le niveau ou la faculté. La catégorie du serveur
   * « Mémoire et thèse » ne tranche pas : c'est le niveau qui le fait. */
  const text = `${category} ${normalize(publication.level)} ${normalize(publication.faculty)}`;
  const has = (word: string) => text.includes(word);

  if (category.includes('article') || category.includes('revue de litterature')) {
    return 'Articles scientifiques';
  }

  const isDissertation = has('memoire') || has('these') || has('dissertation');
  if (!isDissertation) return OTHER_SHELF_LABEL;

  /* Une thèse : le doctorat le dit, ou bien le mot « thèse » sans « mémoire »
   * (le libellé « Mémoire et thèse » contient les deux et ne tranche pas). */
  if (has('doctorat') || has('phd')) return 'Thèses';
  if ((has('these') || has('dissertation')) && !has('memoire')) return 'Thèses';

  /* Un mémoire : le diplôme décide de l'étagère. Le graduat et le master
   * n'existent que sous un seul système ; la licence existe sous les deux. */
  if (has('graduat')) return 'Mémoires de graduats (PADEM)';
  if (has('master')) return 'Mémoires de masters (LMD)';
  if (has('licence')) {
    return has('padem') ? 'Mémoires de licence (PADEM)' : 'Mémoires de licence (LMD)';
  }

  return OTHER_SHELF_LABEL;
}

/** L'ordre des étagères, tel que le catalogue les présente. */
export const SHELF_ORDER: string[] = SHELVES;
