/*
 * L'aide et le support, écrits une seule fois.
 *
 * La page en fait ses sections, l'en-tête son sous-menu, le pied de page ses
 * liens : les trois restent d'accord sur les clés et les libellés. La clé sert
 * d'ancre dans la page (`/aide#guides`) ; le libellé est ce que l'on lit.
 */
export const AIDE_LINKS = [
  { key: 'faq', label: 'FAQ', href: '/aide#faq' },
  { key: 'guides', label: 'Guides d’utilisation', href: '/aide#guides' },
  { key: 'signaler', label: 'Signaler un problème', href: '/aide#signaler' },
] as const;

export type AideLinkKey = (typeof AIDE_LINKS)[number]['key'];
