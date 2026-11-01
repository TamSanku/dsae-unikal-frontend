'use client';

import { useRef } from 'react';

/*
 * Le bandeau des partenaires, juste après l'accueil.
 *
 * Un carrousel horizontal des logos des institutions partenaires. Les logos
 * viennent de la rubrique « Partenaires » de l'espace de gestion : rien n'est
 * inventé. Un partenaire sans logo publié montre son nom, jamais une image de
 * remplacement — la bande reste honnête.
 */
export type PartnerLogo = {
  id: string;
  name: string;
  nature: string;
  location: string;
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

  if (partners.length === 0) return null;

  return (
    <section className="partners-band" aria-label="Partenaires du DSAE">
      <div className="container partners-band-inner">
        <div className="partners-band-head">
          <span className="eyebrow">Partenaires</span>
          <h3>Les institutions qui accompagnent le DSAE</h3>
        </div>

        <div className="partners-track" ref={trackRef} tabIndex={0} aria-label="Logos des partenaires">
          {partners.map((partner) => (
            <article className="partner-logo-card" key={partner.id}>
              <div className="partner-logo-frame">
                {partner.logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={partner.logo} alt={partner.name} loading="lazy" />
                ) : (
                  <span className="partner-logo-text">{partner.name}</span>
                )}
              </div>
              <div className="partner-logo-meta">
                <strong>{partner.name}</strong>
                {partner.nature ? <span>{partner.nature}</span> : null}
              </div>
            </article>
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
