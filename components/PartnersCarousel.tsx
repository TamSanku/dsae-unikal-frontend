/*
 * Le bandeau des partenaires, juste après l'accueil.
 *
 * Une bande horizontale de logos, à l'air libre : ni carte, ni cadre, ni nom.
 * Le défilement est continu et automatique, de droite à gauche — le visiteur
 * n'a rien à faire. La liste est écrite deux fois : quand la première copie a
 * fini de sortir, la seconde occupe exactement la même place, et la boucle
 * repart sans à-coup. La seconde copie est masquée aux lecteurs d'écran.
 *
 * Les deux copies doivent avoir la même largeur, sinon la boucle saute : la
 * largeur d'une copie dépend donc des logos seuls, jamais de leur nombre.
 *
 * Les logos viennent de la rubrique « Partenaires » de l'espace de gestion ;
 * un partenaire sans logo publié ne paraît pas — la bande ne montre que ce qui
 * existe, jamais une image de remplacement.
 */
export type PartnerLogo = {
  id: string;
  name: string;
  logo: string;
};

function LogoRow({ partners, hidden }: { partners: PartnerLogo[]; hidden?: boolean }) {
  return (
    <div className="partners-group" aria-hidden={hidden || undefined}>
      {partners.map((partner) => (
        /* Chargement immédiat, sans `loading="lazy"` : les logos défilent par
         * transformation, or le navigateur calcule le chargement paresseux sur
         * la position de départ. Une fois la bande en mouvement, un logo encore
         * vierge reste vide à l'écran — il n'est jamais « proche du champ » au
         * sens du navigateur. La bande fait quelques dizaines de kilo-octets :
         * la charger d'un coup coûte moins qu'un logo manquant. */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="partner-logo" key={partner.id} src={partner.logo} alt={hidden ? '' : partner.name} />
      ))}
    </div>
  );
}

export default function PartnersCarousel({ partners }: { partners: PartnerLogo[] }) {
  const logos = partners.filter((partner) => partner.logo);
  if (logos.length === 0) return null;

  return (
    <section className="partners-band" aria-label="Partenaires du DSAE">
      <div className="partners-track">
        <LogoRow partners={logos} />
        <LogoRow partners={logos} hidden />
      </div>
    </section>
  );
}
