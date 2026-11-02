/*
 * La référence bibliographique d'une publication, écrite pour être recopiée.
 *
 * Le portail ne connaît pas le nom de la revue : il n'a donc pas à l'inventer.
 * Une référence se compose avec ce qui existe — les auteurs, l'année, le titre,
 * le domaine — et laisse de côté ce qui manque. Une référence honnête et
 * incomplète vaut mieux qu'une référence complète et fausse.
 *
 * Deux formats, parce qu'ils ne servent pas à la même chose : le texte APA se
 * colle dans un manuscrit, le BibTeX s'importe dans un gestionnaire de
 * références. Les deux partent des mêmes données, pour ne pas diverger.
 */

export type CitationData = {
  title: string;
  authors: string[];
  year: number;
  /** Le portail, cité comme contenant : c'est lui qui publie. */
  siteName: string;
  /** L'adresse de la fiche, pour retrouver la source. */
  url: string;
  /** Le domaine scientifique, quand il est renseigné. */
  domain?: string;
};

/* Les particules qui restent avec le nom de famille : « van der Berg » se
 * classe à « van der Berg », pas à « Berg ». */
const NOBILIARY_PARTICLES = new Set([
  'da', 'das', 'de', 'del', 'della', 'der', 'di', 'dos', 'du', 'la', 'le', 'van', 'von',
]);

/** « Gédéon Sabwe Tshama » devient « Tshama, G. S. ». */
export function formatAuthorApa(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];

  /* On remonte depuis la fin tant que les mots sont des particules : le nom de
   * famille peut en compter plusieurs. */
  let familyStart = parts.length - 1;
  while (familyStart > 0 && NOBILIARY_PARTICLES.has(parts[familyStart - 1].toLowerCase())) {
    familyStart -= 1;
  }

  const family = parts.slice(familyStart).join(' ');
  const initials = parts
    .slice(0, familyStart)
    .map((part) => `${part[0].toUpperCase()}.`)
    .join(' ');
  return initials ? `${family}, ${initials}` : family;
}

/*
 * Les auteurs, à la manière APA : « A », « A et B », « A, B et C ». Le dernier
 * se joint par « et », les précédents se séparent par des virgules.
 *
 * Au-delà de vingt, la règle APA demande de couper après le dix-neuvième — mais
 * une publication scientifique en compte rarement autant, et une liste coupée
 * sans le dire serait pire qu'une liste complète.
 */
export function formatAuthorsApa(authors: string[]): string {
  const list = authors.map(formatAuthorApa).filter(Boolean);
  if (list.length === 0) return '';
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(', ')} et ${list[list.length - 1]}`;
}

/** « (2026) », ou rien du tout si l'année n'est pas renseignée. */
function apaYear(year: number): string {
  return year > 0 ? `(${year})` : '(s. d.)';
}

/*
 * La référence APA 7, telle qu'elle se colle dans une bibliographie :
 *
 *   Kabash, C. K., Tshama, G. S. et Igugu, O. (2026). Titre de l'article.
 *   DSAE UNIKAL — Agroéconomie https://…
 *
 * Le portail publie en français : la conjonction est donc « et », et non le
 * « & » de la version anglaise du format.
 */
export function citationApa(data: CitationData): string {
  const authors = formatAuthorsApa(data.authors);
  const parts: string[] = [];

  if (authors) parts.push(authors);
  parts.push(apaYear(data.year));
  parts.push(`${data.title.replace(/\.$/, '')}.`);

  const container = data.domain ? `${data.siteName} — ${data.domain}` : data.siteName;
  parts.push(container);

  return `${parts.join(' ')} ${data.url}`.replace(/\s+/g, ' ').trim();
}

/** Une clé BibTeX : le nom du premier auteur, l'année, et un mot du titre. */
export function bibtexKey(data: CitationData): string {
  const first = data.authors[0] ? formatAuthorApa(data.authors[0]) : 'dsae';
  const family = first.split(',')[0].replace(/[^A-Za-zÀ-ÿ]/g, '');
  const year = data.year > 0 ? String(data.year) : 'sansdate';
  /* Le premier mot un peu long du titre : « Bushmeat », « Cartographie »… On
   * écarte la ponctuation sans toucher aux lettres accentuées. */
  const word = data.title
    .split(/\s+/)
    .map((token) => token.replace(/[^0-9A-Za-zÀ-ÖØ-öø-ÿ]/g, ''))
    .find((token) => token.length > 4);

  return [family, year, word].filter(Boolean).join('');
}

/** Échappe ce qui a un sens en BibTeX, et rien d'autre. */
function bibtexValue(value: string): string {
  return value.replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
}

/*
 * La fiche BibTeX, prête à être enregistrée en `.bib`.
 *
 * Le type est `@misc` : le portail publie des documents de nature variée —
 * articles, mémoires, rapports — et `@misc` est le seul type qui ne présume
 * rien. Les champs vides sont omis plutôt que laissés à blanc.
 */
export function citationBibtex(data: CitationData): string {
  const authors = data.authors.filter(Boolean).join(' and ');
  const fields: [string, string][] = [];

  if (authors) fields.push(['author', authors]);
  fields.push(['title', bibtexValue(data.title)]);
  if (data.year > 0) fields.push(['year', String(data.year)]);
  fields.push(['howpublished', `\\url{${data.url}}`]);
  if (data.domain) fields.push(['keywords', bibtexValue(data.domain)]);
  fields.push(['note', bibtexValue(data.siteName)]);

  const body = fields
    .map(([name, value]) => `  ${name} = {${value}}`)
    .join(',\n');

  return `@misc{${bibtexKey(data)},\n${body}\n}\n`;
}
