/*
 * L'image d'attente d'une personne ou d'une actualité dont la photo n'a pas
 * encore été renseignée. Elle est générée localement : aucune photo inventée
 * n'est téléchargée d'un service extérieur.
 */
export const placeholderImage = '/placeholder.svg';

export const withFallback = (url?: string | null) => (url && url.trim() ? url : placeholderImage);
