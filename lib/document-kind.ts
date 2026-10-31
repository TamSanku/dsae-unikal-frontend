/*
 * Le format d'un document, deviné par son nom ou son adresse.
 *
 * Sert uniquement à choisir la visionneuse. Le nom du fichier n'est jamais
 * montré au lecteur : il ne quitte pas le serveur.
 */

export type DocumentKind = 'pdf' | 'image' | 'video' | 'audio' | 'office' | 'other';

export function documentKind(name: string, url: string): DocumentKind {
  const clean = (name || url).split('?')[0].toLowerCase();
  const extension = clean.includes('.') ? clean.slice(clean.lastIndexOf('.') + 1) : '';
  if (extension === 'pdf') return 'pdf';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'bmp', 'svg'].includes(extension)) return 'image';
  if (['mp4', 'webm', 'ogv', 'mov', 'm4v'].includes(extension)) return 'video';
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(extension)) return 'audio';
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'rtf', 'csv'].includes(extension)) return 'office';
  return 'other';
}
