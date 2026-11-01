'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { NewsItem, Taxonomy } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import CatalogExplorer from '@/components/CatalogExplorer';

/*
 * Le fil des actualités : recherche, onglets par type.
 *
 * Les onglets sont les types du serveur (« À la une », « DSAE », les domaines,
 * « Presse », « Communiqué »). Une actualité sans type se lit sous « Tout ».
 */
export default function NewsCatalog({
  news,
  taxonomy,
  initialTab = '',
  emptyLabel = 'Aucune actualité ne correspond à cette recherche.',
}: {
  news: NewsItem[];
  taxonomy: Taxonomy;
  initialTab?: string;
  emptyLabel?: string;
}) {
  return (
    <CatalogExplorer
      items={news}
      searchPlaceholder="Rechercher une actualité…"
      searchText={(item: NewsItem) => [item.title, item.excerpt, item.category, item.content].filter(Boolean).join(' ')}
      tabs={taxonomy.newsCategories.map((category) => ({ key: category, label: category }))}
      tabOf={(item: NewsItem) => item.category}
      initialTab={initialTab}
      resultNoun="actualité"
      emptyLabel={emptyLabel}
      renderItem={(item: NewsItem) => (
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
      )}
    />
  );
}
