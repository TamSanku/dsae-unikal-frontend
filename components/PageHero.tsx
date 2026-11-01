'use client';

/*
 * Le bandeau de tête des pages intérieures.
 *
 * Le héros ne porte plus que le nom de la page : la même suite de mots
 * apparaissait deux fois (une petite étiquette, puis un grand titre qui la
 * répétait autrement). Il ne reste que le nom, écrit une fois.
 *
 * Le nom s'écrit lettre à lettre dans un dégradé qui glisse sans fin : chaque
 * lettre reçoit le même dégradé mais démarre à un instant différent, ce qui
 * dessine une vague de couleur qui traverse le mot. Les retards sont négatifs
 * pour que la vague soit déjà en cours à l'affichage — pas d'attente au
 * chargement. Le retard suit la position réelle de la lettre dans le titre,
 * espaces compris, pour que la vague reste continue d'un mot à l'autre.
 *
 * Les lettres sont groupées par mot : un titre long se replie donc entre les
 * mots, jamais au milieu d'un mot (« Politique de confidentialité » ne se coupe
 * pas en « Politiqu / e »). L'espace entre les mots vient d'un `gap`, pas d'un
 * caractère.
 *
 * `aria-label` porte le nom entier : les lettres sont décoratives, un lecteur
 * d'écran lit le titre d'un seul tenant et non lettre par lettre.
 */
export default function PageHero({ title }: { title: string }) {
  let position = -1;

  return (
    <section className="page-hero small-hero">
      <div className="container page-hero-inner">
        <h1 className="page-hero-title" aria-label={title}>
          {title.split(' ').map((word, wordIndex) => (
            <span className="page-hero-word" key={`${wordIndex}-${word}`} aria-hidden="true">
              {Array.from(word).map((char, charIndex) => {
                position += 1;
                return (
                  <span
                    key={`${charIndex}-${char}`}
                    className="page-hero-char"
                    style={{ animationDelay: `${position * -70}ms` }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
