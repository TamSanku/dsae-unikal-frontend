import Link from 'next/link';
import Image from 'next/image';
import { newsItems } from '@/lib/data';

export default function NewsPage() {
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
          <div className="card-grid three-grid">
            {newsItems.map((item) => (
              <Link key={item.slug} href={`/actualites/${item.slug}`} className="news-card">
                <div className="news-image">
                  <Image src={item.image} alt={item.title} width={800} height={520} />
                </div>
                <div className="news-body">
                  <span className="mini-tag">{item.category}</span>
                  <h4>{item.title}</h4>
                  <p>{item.excerpt}</p>
                  <span className="date-label">{item.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
