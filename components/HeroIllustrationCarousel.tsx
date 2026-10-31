'use client';

import { useRef, useState } from 'react';

type IllustrationKind = 'agronomie' | 'environnement' | 'recherche' | 'universite' | 'savoirs' | 'developpement';

const dsaeSlides: { kind: IllustrationKind; category: string; title: string; description: string }[] = [
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

const universitySlides: { kind: IllustrationKind; category: string; title: string; description: string }[] = [
  {
    kind: 'universite',
    category: 'Formation universitaire',
    title: 'Apprendre et transmettre',
    description: 'Former des étudiants et accompagner les parcours académiques au service de la société.',
  },
  {
    kind: 'savoirs',
    category: 'Savoirs et recherche',
    title: 'Faire grandir les connaissances',
    description: 'Rapprocher les disciplines, les unités de recherche et les acteurs académiques.',
  },
  {
    kind: 'developpement',
    category: 'Communautés et territoire',
    title: 'Contribuer au développement',
    description: 'Mettre la formation et la recherche en lien avec les besoins locaux et nationaux.',
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

  if (kind === 'universite') {
    return (
      <svg viewBox="0 0 300 220" role="img" aria-label="Illustration d’un établissement universitaire">
        <circle cx="233" cy="42" r="23" fill="#f6c85f" />
        <path d="M40 177h220v22H40z" fill="#c8d7ee" />
        <path d="M56 94 150 45l94 49H56Z" fill="#7592c5" stroke="#45699f" strokeWidth="5" strokeLinejoin="round" />
        <path d="M72 98h156v77H72z" fill="#fff" stroke="#45699f" strokeWidth="5" />
        <path d="M93 104v65m38-65v65m38-65v65m38-65v65" stroke="#6683b3" strokeWidth="9" />
        <path d="M62 177h176" stroke="#45699f" strokeWidth="7" strokeLinecap="round" />
        <path d="M129 145v-24c0-12 9-21 21-21s21 9 21 21v24" fill="#a8c5e8" stroke="#45699f" strokeWidth="4" />
        <path d="M142 146v-22a8 8 0 0 1 16 0v22" fill="#eef5ff" />
      </svg>
    );
  }

  if (kind === 'savoirs') {
    return (
      <svg viewBox="0 0 300 220" role="img" aria-label="Illustration d’un livre ouvert et du savoir">
        <circle cx="221" cy="48" r="23" fill="#f6c85f" />
        <path d="M42 64c42-12 76-5 108 18v105c-32-22-67-29-108-18V64Zm216 0c-42-12-76-5-108 18v105c32-22 67-29 108-18V64Z" fill="#fff" stroke="#5877ad" strokeWidth="5" strokeLinejoin="round" />
        <path d="M64 91c27-6 51-2 70 10m-70 17c27-6 51-2 70 10m-70 17c24-5 47-2 68 9m72-46c8-5 17-8 28-10m-28 27c8-5 17-8 28-10m-28 27c8-5 17-8 28-10" fill="none" stroke="#9db0d0" strokeWidth="5" strokeLinecap="round" />
        <path d="M150 81v106" stroke="#5877ad" strokeWidth="5" />
        <path d="M150 45V27m-27 24-12-12m66 12 12-12" stroke="#e4ae42" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'developpement') {
    return (
      <svg viewBox="0 0 300 220" role="img" aria-label="Illustration de personnes et de développement communautaire">
        <path d="M34 179h232" stroke="#7c9ebc" strokeWidth="7" strokeLinecap="round" />
        <path d="M47 179v-54h54v54m98 0v-66h53v66" fill="#d6e5f2" stroke="#6384aa" strokeWidth="4" />
        <path d="M58 139h13m16 0h5m112-9h13m15 0h6m-161 25h13m16 0h5m112-5h13m15 0h6" stroke="#86a4c6" strokeWidth="5" strokeLinecap="round" />
        <circle cx="142" cy="98" r="17" fill="#f0bb7a" />
        <path d="M112 157v-18c0-16 13-29 30-29s30 13 30 29v18" fill="#6ea5a0" />
        <circle cx="105" cy="112" r="13" fill="#e5b17e" />
        <path d="M83 158v-13c0-12 10-22 22-22 6 0 11 2 15 6" fill="#83ad72" />
        <circle cx="197" cy="112" r="13" fill="#e5b17e" />
        <path d="M217 158v-13c0-12-10-22-22-22-6 0-11 2-15 6" fill="#8398c2" />
        <path d="M131 78c4-17 29-21 39-5" fill="none" stroke="#66814f" strokeWidth="6" strokeLinecap="round" />
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

export default function HeroIllustrationCarousel({ variant = 'dsae' }: { variant?: 'dsae' | 'universite' }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = variant === 'universite' ? universitySlides : dsaeSlides;

  const goTo = (index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const nextIndex = (index + slides.length) % slides.length;
    viewport.scrollTo({ left: nextIndex * viewport.clientWidth, behavior: 'smooth' });
    setActiveIndex(nextIndex);
  };

  return (
    <section
      className={`hero-carousel ${variant === 'universite' ? 'university-carousel' : ''}`}
      aria-label={variant === 'universite' ? 'Illustrations de l’Université de Kalemie' : 'Illustrations du DSAE'}
    >
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
