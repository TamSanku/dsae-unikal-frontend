/*
 * Le bandeau des partenaires, juste après l'accueil.
 *
 * Une bande horizontale de logos, à l'air libre : ni carte, ni cadre, ni nom.
 * Le défilement est continu et automatique, de droite à gauche — le visiteur
 * n'a rien à faire. La liste est écrite deux fois : quand la première copie a
 * fini de sortir, la seconde occupe exactement la même place, et la boucle
 * repart sans à-coup. La seconde copie est masquée aux lecteurs d'écran.
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
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className="partner-logo"
          key={partner.id}
          src={partner.logo}
          alt={hidden ? '' : partner.name}
          loading="lazy"
        />
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
