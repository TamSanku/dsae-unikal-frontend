'use client';

import { useEffect, useRef } from 'react';
import { DownloadIcon } from '@/components/icons';
import type { DocumentKind } from '@/lib/document-kind';
import PdfViewer from '@/components/reader/PdfViewer';
import WordViewer from '@/components/reader/WordViewer';
import SheetViewer from '@/components/reader/SheetViewer';
import TextViewer from '@/components/reader/TextViewer';
import { ReaderUnsupported } from '@/components/reader/ReaderStates';

/*
 * Le lecteur plein écran.
 *
 * « Lire » n'ouvre plus un onglet ni une fenêtre : le document prend tout
 * l'écran, par-dessus la fiche, et la fiche reste en dessous — on la retrouve
 * en fermant. Tout ce qui entourait le document (auteurs, résumé, note,
 * boutons) disparaît pendant la lecture : il ne reste que la barre haute et le
 * document.
 *
 * La barre haute porte deux choses : le retour, et le titre de l'article. Le
 * nom du fichier n'y figure jamais — c'est un détail technique, pas le sujet.
 *
 * La visionneuse est choisie par le format :
 *
 *   PDF         PDF.js, dessiné dans la page (marche sur Android, contrairement
 *               à un `<iframe>`, qui n'y ouvre rien)
 *   Word .docx  mammoth, converti en HTML lisible
 *   Excel, CSV  SheetJS, une feuille par onglet
 *   PowerPoint,
 *   anciens .doc visionneuse Office en ligne, dans la page
 *   Image, son,
 *   vidéo, texte affichage direct
 *   le reste    message clair, avec le téléchargement
 *
 * Le corps de la page est verrouillé pendant la lecture : le document défile,
 * la fiche derrière ne bouge pas. Le retour ferme le lecteur, et le bouton
 * « précédent » du navigateur aussi : l'écran est poussé dans l'historique, si
 * bien qu'un geste de retour ramène à la fiche au lieu de quitter le site.
 */

const KIND_LABELS: Record<DocumentKind, string> = {
  pdf: 'PDF',
  word: 'Word',
  excel: 'classeur',
  office: 'bureautique',
  image: 'image',
  video: 'vidéo',
  audio: 'son',
  text: 'texte',
  other: 'inconnu',
};

export default function DocumentReader({
  url,
  kind,
  title,
  download,
  onDownload,
  onClose,
}: {
  url: string;
  kind: DocumentKind;
  title: string;
  download: string;
  onDownload: () => void;
  onClose: () => void;
}) {
  const backRef = useRef<HTMLButtonElement | null>(null);

  /* Le défilement de la page est figé, et le fond est ramené au début : sans
   * cela, fermer le lecteur rendrait la fiche à une position inattendue. */
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  /* Le focus entre dans le lecteur, sur le retour : au clavier, la suite des
   * tabulations reste dans l'écran, et Échap n'est jamais loin. */
  useEffect(() => {
    backRef.current?.focus();
  }, []);

  /* Échap ferme ; c'est le geste attendu d'un plein écran. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Le retour du navigateur ferme le lecteur, il ne quitte pas la fiche : un
   * état est donc poussé à l'ouverture, et dépilé à la fermeture. */
  useEffect(() => {
    window.history.pushState({ reader: true }, '');
    const onPop = () => onClose();
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      /* Si le lecteur est fermé par son propre bouton, l'état poussé à
       * l'ouverture est retiré : l'historique retrouve son compte. */
      if (window.history.state?.reader) window.history.back();
    };
  }, [onClose]);

  return (
    <div className="reader-full" role="dialog" aria-modal="true" aria-label={`Lecture : ${title}`}>
      <header className="reader-full-bar">
        <button type="button" className="reader-back" onClick={onClose} ref={backRef}>
          <span aria-hidden="true">←</span> Retour
        </button>
        <h1 className="reader-full-title" title={title}>
          {title}
        </h1>
        <a href={download} className="reader-full-download" onClick={onDownload} data-track-skip>
          <DownloadIcon /> <span className="reader-full-download-label">Télécharger</span>
        </a>
      </header>

      <div className="reader-full-body">
        {kind === 'pdf' && (
          <PdfViewer url={url} download={download} onDownload={onDownload} />
        )}

        {kind === 'word' && <WordViewer url={url} download={download} onDownload={onDownload} />}
        {kind === 'excel' && <SheetViewer url={url} download={download} onDownload={onDownload} />}
        {kind === 'text' && <TextViewer url={url} download={download} onDownload={onDownload} />}

        {kind === 'office' && (
          /* La visionneuse Office va chercher le document elle-même : l'adresse
           * doit donc être publique, ce qu'elle est (médias du backend). */
          <iframe
            className="reader-frame"
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
            title={`Lecture : ${title}`}
            allowFullScreen
          />
        )}

        {kind === 'image' && (
          <div className="reader-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="reader-image" src={url} alt={`Document : ${title}`} />
          </div>
        )}

        {kind === 'video' && (
          <div className="reader-stage">
            <video className="reader-video" src={url} controls playsInline />
          </div>
        )}

        {kind === 'audio' && (
          <div className="reader-stage">
            <audio className="reader-audio" src={url} controls />
          </div>
        )}

        {kind === 'other' && (
          <ReaderUnsupported label={KIND_LABELS.other} download={download} onDownload={onDownload} />
        )}
      </div>

    </div>
  );
}
