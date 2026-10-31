import Image from 'next/image';

/*
 * La couverture d'un document, au format A4.
 *
 * Un document n'est pas une vignette d'actualité : il se présente comme une
 * page — un rapport 1 / 1,414 (210 × 297 mm). Quand une image de couverture a
 * été publiée, elle remplit la page. Sans image, la page ne porte que ce que le
 * document dit vraiment : son titre et ses signataires. Rien d'autre n'y est
 * ajouté — ni type, ni ornement — pour que la carte reste sobre.
 */
export default function PublicationCover({
  title,
  authors,
  image,
  size = 'card',
}: {
  title: string;
  authors?: string;
  image?: string | null;
  size?: 'card' | 'page';
}) {
  const cover = (image ?? '').trim();

  return (
    <div className={`publication-cover publication-cover-${size}`}>
      {cover ? (
        <Image
          src={cover}
          alt={`Couverture — ${title}`}
          fill
          sizes={size === 'page' ? '(max-width: 980px) 100vw, 460px' : '(max-width: 980px) 100vw, 420px'}
        />
      ) : (
        <div className="publication-cover-sheet" aria-hidden={false}>
          <span className="publication-cover-title">{title}</span>
          {authors ? <span className="publication-cover-author">{authors}</span> : null}
        </div>
      )}
    </div>
  );
}
