import type { SiteLogo } from '@/lib/backend';

/*
 * Le repère du portail, en tête et en pied de page.
 *
 * Le logo publié depuis l'espace de gestion remplace le repère écrit « DSAE ».
 * Sans logo, le repère écrit reste : le portail n'affiche jamais une image
 * inventée. L'image est servie telle quelle (`<img>`) : l'adresse vient du
 * backend, elle ne doit pas dépendre de la liste blanche de `next/image`.
 */
export default function BrandMark({ logo }: { logo?: SiteLogo | null }) {
  if (logo?.url) {
    return (
      <span className="brand-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.url} alt={logo.alt || 'DSAE UNIKAL'} />
      </span>
    );
  }
  return <span className="brand-mark">DSAE</span>;
}
