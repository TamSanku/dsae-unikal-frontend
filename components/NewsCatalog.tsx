'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { NewsItem, Taxonomy } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import CatalogExplorer from '@/components/CatalogExplorer';

/*
 * Le fil des actualités : recherche, onglets par type.
 *
 * Le premier onglet, « À la une », est la vue d'ensemble : il montre toutes les
 * actualités publiées, sans filtrer. Ce n'est pas un type du serveur — il n'est
 * donc jamais proposé dans l'administration. Les onglets suivants sont les vrais
 * types, qui resserrent le fil.
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
      allTabKey=""
      allTabLabel={taxonomy.newsFeaturedLabel}
      showAllTab
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
