'use client';

import { useRef, useState } from 'react';

type IllustrationKind = 'agronomie' | 'environnement' | 'recherche';

const slides: { kind: IllustrationKind; category: string; title: string; description: string }[] = [
  {
    kind: 'agronomie',
    category: 'Formation et pratiques agricoles',
    title: 'Agronomie durable',
    description: 'Accompagner les pratiques agricoles et l’élevage par la formation et la recherche appliquée.',
  },
  {
    kind: 'environnement',
    category: 'Ressources naturelles',
    title: 'Environnement',
    description: 'Étudier les milieux naturels et promouvoir une gestion durable des ressources.',
  },
  {
    kind: 'recherche',
    category: 'Savoirs et innovation',
    title: 'Recherche scientifique',
    description: 'Faire circuler les savoirs et proposer des réponses aux besoins des communautés.',
  },
];

function Illustration({ kind }: { kind: IllustrationKind }) {
  if (kind === 'agronomie') {
    return (
      <svg viewBox="0 0 300 220" role="img" aria-label="Illustration de cultures et d’agronomie">
        <circle cx="230" cy="45" r="27" fill="#f6c85f" />
        <path d="M38 177c34-20 68-20 102 0s68 20 122 0v27H38z" fill="#d9e9c7" />
        <path d="M38 190c34-18 68-18 102 0s68 18 122 0" fill="none" stroke="#6e9c59" strokeWidth="5" strokeLinecap="round" />
        <path d="M147 176V83" fill="none" stroke="#397a51" strokeWidth="8" strokeLinecap="round" />
        <path d="M145 124c-33 1-51-17-50-43 27-2 48 12 50 43Z" fill="#6fb56c" stroke="#397a51" strokeWidth="4" />
        <path d="M151 108c4-29 25-44 51-38-1 27-18 43-51 38Z" fill="#8acb72" stroke="#397a51" strokeWidth="4" />
        <path d="M113 176v-28m74 28v-34m-97 34v-19m128 19v-24" fill="none" stroke="#397a51" strokeWidth="6" strokeLinecap="round" />
        <path d="M102 148c-13-15-12-28 0-39 13 12 14 25 0 39Zm74-6c-2-19 7-30 22-34 6 17 0 29-22 34Zm-96 11c-16-11-19-23-10-37 16 9 21 20 10 37Zm126-6c2-17 12-26 28-25 2 16-7 26-28 25Z" fill="#92c878" />
      </svg>
    );
  }

  if (kind === 'environnement') {
    return (
      <svg viewBox="0 0 300 220" role="img" aria-label="Illustration de l’environnement et de l’eau">
        <circle cx="223" cy="48" r="24" fill="#f6c85f" />
        <path d="M35 166 104 84l50 61 40-48 71 69v29H35z" fill="#cfe2df" />
        <path d="m72 122 32-38 25 31-17-7-13 9-12-5Zm93 17 29-42 34 37-19-9-14 10-15-6Z" fill="#fff" />
        <path d="M41 173c34-16 68-16 102 0s68 16 122 0v24H41z" fill="#86c9ce" />
        <path d="M55 181c25-9 46-9 68 0m34 0c22-9 45-9 69 0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <path d="M78 156V119m0 14c-21 0-31-12-29-29 18-1 29 9 29 29Zm0-8c2-18 14-27 31-24-1 17-11 25-31 24Z" fill="#6caa64" stroke="#397a51" strokeWidth="3" strokeLinejoin="round" />
        <path d="M232 117c0 15-10 24-22 24s-22-9-22-24 22-38 22-38 22 23 22 38Z" fill="#63b6c4" stroke="#287d91" strokeWidth="4" />
        <path d="M201 119c2 7 6 10 12 11" fill="none" stroke="#dff8fa" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 220" role="img" aria-label="Illustration de recherche scientifique">
      <circle cx="226" cy="47" r="26" fill="#f6c85f" />
      <path d="M64 175h174" fill="none" stroke="#8da6d4" strokeWidth="8" strokeLinecap="round" />
      <path d="M122 51h52v14h-52zm12 14v45l-35 54c-7 11 1 24 14 24h63c13 0 21-13 14-24l-35-54V65" fill="#fff" stroke="#466da8" strokeWidth="5" strokeLinejoin="round" />
      <path d="M112 145h73l18 26c3 5-1 11-7 11h-78c-6 0-10-6-7-11z" fill="#71c5bd" />
      <circle cx="142" cy="145" r="5" fill="#fff" />
      <circle cx="163" cy="157" r="4" fill="#e5f7fa" />
      <path d="M75 80c0-10 8-18 18-18m-18 38c0-10 8-18 18-18" fill="none" stroke="#7a91c4" strokeWidth="6" strokeLinecap="round" />
      <path d="M198 99c11-8 23-8 34 0m-34 15c11-8 23-8 34 0" fill="none" stroke="#71a6c5" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export default function HeroIllustrationCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nextIndex = (index + slides.length) % slides.length;
    viewport.scrollTo({ left: nextIndex * viewport.clientWidth, behavior: 'smooth' });
    setActiveIndex(nextIndex);
  };

  return (
    <section className="hero-carousel" aria-label="Illustrations du DSAE">
      <div
        className="hero-carousel-viewport"
        ref={viewportRef}
        onScroll={(event) => {
          const width = event.currentTarget.clientWidth;
          if (width > 0) setActiveIndex(Math.round(event.currentTarget.scrollLeft / width));
        }}
      >
        <div className="hero-carousel-track">
          {slides.map((slide, index) => (
            <article className={`hero-slide hero-slide-${slide.kind}`} key={slide.kind}>
              <div className="hero-illustration-wrap">
                <Illustration kind={slide.kind} />
              </div>
              <div className="hero-slide-copy">
                <span className="hero-slide-category">{slide.category}</span>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <span className="hero-slide-count">0{index + 1} / 0{slides.length}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="hero-carousel-controls">
        <button type="button" aria-label="Illustration précédente" onClick={() => goTo(activeIndex - 1)}>
          <span aria-hidden="true">←</span>
        </button>
        <div className="hero-carousel-dots" aria-label="Choisir une illustration">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.kind}
              className={index === activeIndex ? 'active' : ''}
              aria-label={`Afficher l’illustration ${index + 1} : ${slide.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <button type="button" aria-label="Illustration suivante" onClick={() => goTo(activeIndex + 1)}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
