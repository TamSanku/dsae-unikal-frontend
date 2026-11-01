/*
 * Les trois volets de « S'engager », écrits une seule fois.
 *
 * La page en fait ses onglets, le pied de page ses liens : les deux restent
 * d'accord sur les clés et les libellés. La clé sert d'adresse (`?volet=`) et
 * de repère dans la page ; le libellé est ce que l'on lit.
 */
export const ENGAGER_TABS = [
  { key: 'partenariat', label: 'Proposer le partenariat' },
  { key: 'contact', label: 'Nous contacter' },
  { key: 'partenaires', label: 'Nos partenaires' },
] as const;

export type EngagerTabKey = (typeof ENGAGER_TABS)[number]['key'];

/** L'adresse d'un volet de « S'engager », pour un lien. */
export const engagerHref = (key: string) => `/s-engager?volet=${encodeURIComponent(key)}`;
