import Image from 'next/image';

/*
 * La couverture d'un document, au format A4.
 *
 * Un document n'est pas une vignette d'actualité : il se présente comme une
 * page — un rapport 1 / 1,414 (210 × 297 mm). Quand une image de couverture a
 * été publiée, elle remplit la page. Sans image, la page porte ce que le
 * document dit vraiment : son titre, ses signataires, son type. Rien n'est
 * inventé — une couverture sans image reste la couverture du même document.
 */
export default function PublicationCover({
  title,
  authors,
  category,
  image,
  size = 'card',
}: {
  title: string;
  authors?: string;
  category?: string;
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
          {category ? <span className="publication-cover-tag">{category}</span> : null}
          <span className="publication-cover-title">{title}</span>
          {authors ? <span className="publication-cover-author">{authors}</span> : null}
        </div>
      )}
    </div>
  );
}
