'use client';

import { useRef } from 'react';

/*
 * Le bandeau des partenaires, juste après l'accueil.
 *
 * Une bande horizontale de logos, à l'air libre : ni carte, ni cadre, ni nom.
 * Le logo se pose sur la couleur de fond de la bande, comme s'il y était
 * imprimé. Les logos viennent de la rubrique « Partenaires » de l'espace de
 * gestion ; un partenaire sans logo publié ne paraît pas — la bande ne montre
 * que ce qui existe, jamais une image de remplacement.
 */
export type PartnerLogo = {
  id: string;
  name: string;
  logo: string;
};

export default function PartnersCarousel({ partners }: { partners: PartnerLogo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(track.clientWidth * 0.8, 240);
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  const logos = partners.filter((partner) => partner.logo);
  if (logos.length === 0) return null;

  return (
    <section className="partners-band" aria-label="Partenaires du DSAE">
      <div className="container partners-band-inner">
        <div className="partners-track" ref={trackRef} tabIndex={0} aria-label="Logos des partenaires">
          {logos.map((partner) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className="partner-logo" key={partner.id} src={partner.logo} alt={partner.name} loading="lazy" />
          ))}
        </div>

        <div className="partners-carousel-controls">
          <button type="button" aria-label="Partenaires précédents" onClick={() => step(-1)}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" aria-label="Partenaires suivants" onClick={() => step(1)}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
