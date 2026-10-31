/*
 * Les étoiles d'un avis.
 *
 * Deux usages, une seule échelle : la lecture montre une note (demi-étoile
 * comprise), la saisie laisse choisir un entier de 1 à 5. Le dessin est le
 * même, seule l'interaction change — une note lue n'est pas un bouton.
 *
 * Le remplissage se fait sans identifiant SVG : une étoile pleine est posée
 * sur une étoile vide, et rognée par la largeur de son conteneur. Un
 * pourcentage suffit, et rien ne peut entrer en collision avec une autre
 * étoile de la page.
 */

const STAR_PATH = 'M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5 6.2 20.55l1.1-6.5-4.7-4.6 6.5-.95z';

function StarGlyph({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={STAR_PATH}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Une étoile remplie à `fill` (0 à 1). */
function Star({ fill, size }: { fill: number; size: number }) {
  const percent = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <span className="star" style={{ width: size, height: size }}>
      <span className="star-base">
        <StarGlyph size={size} filled={false} />
      </span>
      <span className="star-fill" style={{ width: `${percent}%` }}>
        <StarGlyph size={size} filled />
      </span>
    </span>
  );
}

/** La note lue : `value` peut être décimale (4,67). */
export default function StarRating({
  value,
  count,
  size = 16,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  const safe = Number.isFinite(value) ? value : 0;
  /* Les étoiles se dessinent au demi-point près, mais la note écrite dit la
   * vérité : 4,67 s'affiche « 4,7 », jamais « 4,5 ». */
  const rounded = Math.round(safe * 2) / 2;
  const label = safe.toFixed(1).replace('.', ',');
  return (
    <span className="star-rating" aria-label={`Note : ${label} sur 5`}>
      <span className="star-row" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((position) => (
          <Star key={position} fill={rounded - position + 1} size={size} />
        ))}
      </span>
      {typeof count === 'number' && (
        <span className="star-count">
          {count > 0 ? `${label} · ${count} avis` : 'Aucun avis'}
        </span>
      )}
    </span>
  );
}

/** La saisie : un entier de 1 à 5, choisi à la souris ou au clavier. */
export function StarInput({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}) {
  return (
    <span className="star-input" role="radiogroup" aria-label="Votre note">
      {[1, 2, 3, 4, 5].map((position) => (
        <button
          key={position}
          type="button"
          role="radio"
          aria-checked={value === position}
          aria-label={`${position} étoile${position > 1 ? 's' : ''}`}
          className="star-button"
          onClick={() => onChange(position)}
        >
          <Star fill={value >= position ? 1 : 0} size={size} />
        </button>
      ))}
    </span>
  );
}
