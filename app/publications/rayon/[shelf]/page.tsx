import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublications } from '@/lib/backend';
import { publicationShelf, shelfKey, shelfLabel, SHELVES } from '@/lib/shelves';
import PublicationCard from '@/components/PublicationCard';
import PageHero from '@/components/PageHero';

/*
 * La vue complète d'un rayon : « Voir plus » y mène.
 *
 * La page porte son en-tête (le bandeau, puis le lien de retour et le compte),
 * la grille de tous les documents du rayon, puis le pied de page global — posé
 * par la mise en page du site.
 *
 * Le classement se refait ici, à partir de la même règle que le catalogue
 * (`publicationShelf`) : aucun document n'est dupliqué côté serveur, et une
 * adresse inconnue renvoie une page introuvable.
 */

export function generateStaticParams() {
  return SHELVES.map((shelf) => ({ shelf: shelfKey(shelf) }));
}

/* Seuls les rayons connus existent : une adresse inventée renvoie une vraie
 * page introuvable (404), pas une page vide servie comme un succès. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { shelf: string };
}): Promise<Metadata> {
  const label = shelfLabel(params.shelf);
  return { title: label ? `${label} | Publications` : 'Publications' };
}

export default async function ShelfPage({ params }: { params: { shelf: string } }) {
  const label = shelfLabel(params.shelf);
  if (!label) notFound();

  const publications = await getPublications();
  const documents = publications.filter((item) => publicationShelf(item) === label);

  return (
    <div className="page-shell">
      <PageHero title={label} />

      <section className="section page-enter">
        <div className="container">
          <div className="shelf-page-head">
            <Link href="/publications" className="btn btn-secondary back-to-catalog">
              ← Retour au catalogue
            </Link>
            <p className="shelf-page-lead">
              {documents.length} document{documents.length > 1 ? 's' : ''} dans ce rayon.
            </p>
          </div>

          {documents.length === 0 ? (
            <p className="catalog-empty">Aucun document publié dans ce rayon pour le moment.</p>
          ) : (
            <div className="catalog-grid pub-grid">
              {documents.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
