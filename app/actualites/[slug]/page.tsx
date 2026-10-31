import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { newsItems } from '@/lib/data';

export function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }));
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const item = newsItems.find((entry) => entry.slug === params.slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container news-detail">
          <div className="detail-image image-large">
            <Image src={item.image} alt={item.title} width={1200} height={800} />
          </div>
          <div className="detail-copy">
            <span className="mini-tag">{item.category}</span>
            <h1>{item.title}</h1>
            <p className="date-label">{item.date}</p>
            <p>{item.content}</p>
            <Link href="/actualites" className="btn btn-secondary mt-2">
              Retour aux actualités
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
