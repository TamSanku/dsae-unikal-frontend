/*
 * Le format d'un document, deviné par son nom ou son adresse.
 *
 * Sert uniquement à choisir la visionneuse. Le nom du fichier n'est jamais
 * montré au lecteur : il ne quitte pas le serveur.
 *
 * `word` et `excel` désignent les formats qu'une bibliothèque du navigateur
 * sait réellement ouvrir — c'est ce qui décide entre « converti dans la page »
 * et « confié à la visionneuse en ligne ». Le `.doc` et le `.rtf` n'y sont donc
 * pas : mammoth ne lit que le format OOXML (`.docx`), et un ancien `.doc` lui
 * arrive comme un fichier illisible. Ils passent par la visionneuse en ligne,
 * qui les affiche vraiment.
 */

export type DocumentKind =
  | 'pdf'
  | 'word'
  | 'excel'
  | 'office'
  | 'image'
  | 'video'
  | 'audio'
  | 'text'
  | 'other';

/** L'extension, sans le point. Le nom d'abord : il est plus sûr que l'adresse,
 * qui peut porter une chaîne de requête ou un fragment. */
export function documentExtension(name: string, url: string): string {
  const clean = (name || url).split('?')[0].split('#')[0].trim().toLowerCase();
  return clean.includes('.') ? clean.slice(clean.lastIndexOf('.') + 1) : '';
}

export function documentKind(name: string, url: string): DocumentKind {
  const extension = documentExtension(name, url);

  if (extension === 'pdf') return 'pdf';

  /* Le format OOXML que mammoth convertit en HTML lisible. */
  if (['docx', 'docm'].includes(extension)) return 'word';

  /* Les classeurs que SheetJS lit, CSV compris : une seule feuille, mais des
   * lignes et des colonnes comme les autres. */
  if (['xlsx', 'xlsm', 'xlsb', 'xls', 'ods', 'csv'].includes(extension)) return 'excel';

  /* Les diaporamas, plus les formats bureautiques qu'aucune bibliothèque du
   * navigateur ne sait lire : la visionneuse Office en ligne les affiche. */
  if (['ppt', 'pptx', 'pps', 'ppsx', 'odp', 'doc', 'rtf', 'odt'].includes(extension)) return 'office';

  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'bmp', 'svg'].includes(extension)) return 'image';
  if (['mp4', 'webm', 'ogv', 'mov', 'm4v'].includes(extension)) return 'video';
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(extension)) return 'audio';
  if (['txt', 'md', 'log', 'json', 'xml', 'yml', 'yaml'].includes(extension)) return 'text';

  return 'other';
}
