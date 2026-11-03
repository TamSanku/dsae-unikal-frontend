'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { formatFileSize } from '@/lib/backend';
import type { Publication } from '@/lib/backend';

/*
 * Le bloc d'informations d'une fiche : une seule ligne horizontale de colonnes,
 * que l'on fait défiler du doigt sur téléphone.
 *
 * Chaque colonne porte un intitulé en petites majuscules grises et, en dessous,
 * sa valeur en gras. Une fine ligne verticale les sépare. Le bloc ne montre que
 * ce qui existe : une information absente n'a pas de colonne — jamais de case
 * vide, jamais de « N/A ».
 *
 * Sur grand écran, si toutes les colonnes tiennent, il n'y a pas de défilement ;
 * sinon un léger dégradé au bord droit signale qu'il reste des colonnes à voir,
 * et disparaît quand on arrive au bout.
 */

type Column = {
  key: string;
  label: string;
  /** Le texte affiché. */
  value: string;
  /** Vrai pour les valeurs longues (revue, faculté) : elles sont tronquées. */
  long?: boolean;
  /** Une adresse : la valeur devient un lien. */
  href?: string;
  /** Un identifiant à copier (DOI) : un petit bouton accompagne la valeur. */
  copy?: string;
};

/* Une date ISO devient « 31 oct. 2026 ». */
function shortDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Les colonnes réellement remplies, dans l'ordre demandé. */
function buildColumns(publication: Publication): Column[] {
  const columns: Column[] = [];

  const push = (column: Column) => {
    if (column.value) columns.push(column);
  };

  push({ key: 'published', label: 'Publié le', value: shortDate(publication.publishedAt) });
  push({ key: 'type', label: 'Type', value: publication.category });
  push({ key: 'domain', label: 'Domaine', value: publication.domain });
  push({ key: 'language', label: 'Langue', value: publication.language });
  push({
    key: 'pages',
    label: 'Pages',
    value: publication.pages > 0 ? `${publication.pages} p.` : '',
  });
  push({ key: 'format', label: 'Format', value: publication.fileFormat });
  push({ key: 'size', label: 'Taille', value: formatFileSize(publication.fileSize) });
  push({
    key: 'views',
    label: 'Vues',
    value: publication.views > 0 ? String(publication.views) : '',
  });
  push({
    key: 'downloads',
    label: 'Téléchargements',
    value: publication.downloads > 0 ? String(publication.downloads) : '',
  });
  push({ key: 'access', label: 'Accès', value: publication.access });
  push({ key: 'license', label: 'Licence', value: publication.license });
  push({ key: 'journal', label: 'Revue', value: publication.journal, long: true });
  if (publication.doi) {
    columns.push({
      key: 'doi',
      label: 'DOI',
      value: publication.doi,
      href: /^https?:\/\//i.test(publication.doi)
        ? publication.doi
        : `https://doi.org/${publication.doi}`,
      copy: publication.doi,
    });
  }
  push({ key: 'faculty', label: 'Faculté', value: publication.faculty, long: true });
  push({ key: 'updated', label: 'Mise à jour', value: shortDate(publication.updatedAt) });

  return columns;
}

export default function MetadataRail({ publication }: { publication: Publication }) {
  const columns = buildColumns(publication);
  const railRef = useRef<HTMLDivElement>(null);
  /* Le dégradé de droite ne s'affiche que s'il reste des colonnes à voir. */
  const [moreRight, setMoreRight] = useState(false);
  const [moreLeft, setMoreLeft] = useState(false);
  const [copied, setCopied] = useState('');

  const updateEdges = useCallback(() => {
    const node = railRef.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setMoreLeft(node.scrollLeft > 4);
    setMoreRight(node.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const node = railRef.current;
    if (!node) return;
    /* La largeur peut changer (rotation, redimensionnement) : on la suit. */
    const observer = new ResizeObserver(updateEdges);
    observer.observe(node);
    return () => observer.disconnect();
  }, [updateEdges]);

  const copy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(''), 1600);
    } catch {
      /* Le presse-papiers peut être refusé : on ne prétend pas avoir copié. */
    }
  }, []);

  if (columns.length === 0) return null;

  return (
    <div
      className={`meta-rail${moreRight ? ' has-more-right' : ''}${moreLeft ? ' has-more-left' : ''}`}
    >
      <div
        className="meta-rail-track"
        ref={railRef}
        onScroll={updateEdges}
        role="group"
        aria-label="Informations sur le document"
      >
        {columns.map((column) => (
          <div className={`meta-col${column.long ? ' is-long' : ''}`} key={column.key}>
            <span className="meta-col-label">{column.label}</span>
            {column.href ? (
              <span className="meta-col-value meta-col-doi">
                <a href={column.href} target="_blank" rel="noopener noreferrer">
                  {column.value}
                </a>
                <button
                  type="button"
                  className="meta-copy"
                  onClick={() => copy(column.copy ?? column.value)}
                  aria-label={`Copier le DOI ${column.value}`}
                  title={copied === (column.copy ?? column.value) ? 'Copié' : 'Copier le DOI'}
                >
                  {copied === (column.copy ?? column.value) ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </span>
            ) : (
              <span className="meta-col-value" title={column.long ? column.value : undefined}>
                {column.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
