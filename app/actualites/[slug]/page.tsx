import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getNewsBySlug } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import ContentBlocks from '@/components/ContentBlocks';

/* Le titre de l'onglet porte le titre de l'actualité : c'est ce titre que la
 * mesure d'audience retient comme libellé de la fiche. */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getNewsBySlug(params.slug);
  return { title: item?.title ?? 'Actualité' };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const item = await getNewsBySlug(params.slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container news-detail">
          <div className="detail-image image-large">
            <Image src={withFallback(item.image)} alt={item.title} width={1200} height={800} />
          </div>
          <div className="detail-copy">
            {item.category && <span className="mini-tag">{item.category}</span>}
            <h1>{item.title}</h1>
            {item.date && <p className="date-label">{item.date}</p>}
            {item.blocks.length > 0 ? <ContentBlocks blocks={item.blocks} /> : item.content && <p>{item.content}</p>}
            <Link href="/actualites" className="btn btn-secondary mt-2">
              Retour aux actualités
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
