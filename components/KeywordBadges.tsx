'use client';

import { useRouter } from 'next/navigation';

/*
 * Les mots-clés d'une fiche, en petits badges arrondis.
 *
 * Un clic mène au catalogue des publications, déjà filtré sur ce mot-clé : on y
 * retrouve tous les documents qui le portent. Sans mot-clé, rien n'est affiché
 * — pas de titre vide, pas de cadre inutile.
 */
export default function KeywordBadges({ keywords }: { keywords: string[] }) {
  const router = useRouter();
  const list = keywords.filter(Boolean);
  if (list.length === 0) return null;

  return (
    <div className="keyword-badges" aria-label="Mots-clés">
      {list.map((keyword) => (
        <button
          type="button"
          className="keyword-badge"
          key={keyword}
          onClick={() => router.push(`/publications?q=${encodeURIComponent(keyword)}`)}
        >
          {keyword}
        </button>
      ))}
    </div>
  );
}
