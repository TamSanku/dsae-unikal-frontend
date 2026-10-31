import Link from 'next/link';
import Image from 'next/image';
import { getNewsItems } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import EmptyState from '@/components/EmptyState';

export default async function NewsPage() {
  const news = await getNewsItems();

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Actualités</span>
          <h1>Événements, séminaires et conférences</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {news.length === 0 ? (
            <EmptyState label="Les actualités seront publiées depuis l’espace d’administration." />
          ) : (
            <div className="card-grid three-grid">
              {news.map((item) => (
                <Link key={item.slug} href={`/actualites/${item.slug}`} className="news-card">
                  <div className="news-image">
                    <Image src={withFallback(item.image)} alt={item.title} width={800} height={520} />
                  </div>
                  <div className="news-body">
                    {item.category && <span className="mini-tag">{item.category}</span>}
                    <h4>{item.title}</h4>
                    {item.excerpt && <p>{item.excerpt}</p>}
                    {item.date && <span className="date-label">{item.date}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
