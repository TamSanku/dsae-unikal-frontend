'use client';

import { useState } from 'react';
import { useMenu } from '@/components/reader/useMenu';

/*
 * « Partager » : le lien de l'article, à portée de main.
 *
 * On privilégie le partage du système quand il existe — sur téléphone, c'est le
 * geste naturel, et il ouvre les applications installées. Sinon, on propose le
 * lien : le copier, ou l'ouvrir dans un nouvel onglet. Aucun service tiers n'est
 * contacté, aucune icône d'un réseau social n'est affichée : on ne choisit pas
 * à la place du visiteur où il veut envoyer ce lien.
 */
export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const { open, setOpen, ref } = useMenu();

  /* Le lien est lu au moment du partage, et non à l'ouverture du menu : la
   * barre d'adresse peut avoir changé entre-temps. */
  const shareUrl = () => (typeof window === 'undefined' ? '' : window.location.href);

  const share = async () => {
    const url = shareUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* Partage refusé ou indisponible : on retombe sur le menu. */
      }
    }
    setOpen((value) => !value);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
      /* La copie a échoué : le lien reste affiché dans le menu, on peut le
       * sélectionner à la main. */
    }
  };

  return (
    <div className="reader-menu" ref={ref}>
      <button
        type="button"
        className={`reader-action${open ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={share}
        title="Partager cet article"
      >
        <span className="reader-action-label">Partager</span>
      </button>

      {open && (
        <div className="reader-menu-panel reader-share-panel" role="menu" aria-label="Partager l’article">
          <p className="reader-menu-heading">Lien de l’article</p>
          <p className="reader-share-url">{shareUrl()}</p>

          <div className="reader-menu-actions">
            <button type="button" className="reader-menu-primary" onClick={copy}>
              {copied ? 'Lien copié ✓' : 'Copier le lien'}
            </button>
            <a
              className="reader-menu-secondary"
              href={shareUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir dans un onglet
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
