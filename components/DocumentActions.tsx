'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { DownloadIcon, ReadIcon } from '@/components/icons';
import { trackInteraction } from '@/lib/tracker';
import { countDocumentEvent } from '@/lib/backend';
import { getSessionId, getVisitorId } from '@/lib/consent';
import type { DocumentKind } from '@/lib/document-kind';
import type { CitationData } from '@/lib/reader-citation';

/*
 * Les deux gestes d'un document : lire sur place, télécharger.
 *
 * « Lire » ouvre le document dans la page, en plein écran, sans quitter le
 * site : la fiche s'efface derrière le lecteur, qui choisit sa visionneuse
 * selon le format (PDF, Word, classeur, diaporama, image, son, vidéo, texte).
 * Rien n'est inventé : sans document, le message le dit.
 *
 * Pendant la lecture, on ne voit que l'en-tête et le document. C'est posé ici,
 * au clic, et non dans le lecteur : la visionneuse pèse lourd et arrive plus
 * tard, mais la fiche doit disparaître dès l'instant où l'on clique. La classe
 * `reader-open` sur `<html>` fait le travail — la feuille de style écarte alors
 * tout le reste, en-tête mis à part.
 *
 * Le nom du fichier n'est jamais montré. Le serveur a déjà deviné le format
 * (`kind`) : le lecteur ne reçoit donc aucune trace du nom d'origine.
 *
 * Les deux gestes sont mesurés : « lire » et « télécharger » sont deux choses
 * différentes, et le back-office doit pouvoir les distinguer. La règle du
 * consentement, elle, vit dans `lib/tracker.ts` et sur le serveur.
 *
 * Le lecteur et ses visionneuses ne sont chargés qu'au clic sur « Lire » : ils
 * pèsent lourd (PDF.js, mammoth, SheetJS), et la plupart des visites ne lisent
 * pas le document. La fiche s'affiche donc sans eux, et ils arrivent ensuite.
 */
const DocumentReader = dynamic(() => import('@/components/DocumentReader'), {
  ssr: false,
  loading: () => (
    <div className="reader-full" role="status" aria-live="polite">
      <div className="reader-state">
        <span className="reader-spinner" aria-hidden="true" />
        <p>Ouverture du lecteur…</p>
      </div>
    </div>
  ),
});
export default function DocumentActions({
  url,
  kind,
  title,
  download,
  citation,
  entryId,
}: {
  url: string;
  kind: DocumentKind;
  title: string;
  download: string;
  /** De quoi composer la référence de l'article, dans le lecteur. */
  citation: CitationData;
  /** L'identifiant de la fiche : sert au compteur d'ouvertures et de
   * téléchargements, dédoublonné par visiteur et par session. */
  entryId: string;
}) {
  const [open, setOpen] = useState(false);

  /* L'état de lecture suit exactement la vie du lecteur : posé au clic, retiré
   * à la fermeture. Le corps est figé au passage — la position est conservée,
   * `overflow: hidden` ne remettant pas le défilement à zéro — et rendue telle
   * quelle ensuite. */
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    root.classList.add('reader-open');
    body.style.overflow = 'hidden';
    return () => {
      root.classList.remove('reader-open');
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!url) {
    return <p className="publication-nodoc">Aucun document joint à cette publication pour le moment.</p>;
  }

  /* Le compteur public de la fiche : le serveur décide s'il compte, une seule
   * fois par visiteur et par session. On ne l'attend pas — le document s'ouvre
   * tout de suite, et le chiffre juste arrive ensuite. */
  const countGesture = (gesture: 'view' | 'download') => {
    if (!entryId) return;
    void countDocumentEvent(entryId, gesture, getVisitorId(), getSessionId());
  };

  /* On mesure le geste, puis on laisse le lien suivre son cours : la mesure ne
   * doit jamais retarder le téléchargement. */
  const trackDownload = () => {
    trackInteraction({ kind: 'download', target: url });
    countGesture('download');
  };

  const openReader = () => {
    setOpen(true);
    trackInteraction({ kind: 'read', target: url });
    countGesture('view');
  };

  return (
    <>
      <div className="publication-actions">
        <button type="button" className="btn btn-primary" onClick={openReader}>
          <ReadIcon /> Lire
        </button>
        <a href={download} className="btn btn-secondary" onClick={trackDownload} data-track-skip>
          <DownloadIcon /> Télécharger
        </a>
      </div>

      {open && (
        <DocumentReader
          url={url}
          kind={kind}
          title={title}
          download={download}
          citation={citation}
          onDownload={trackDownload}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
