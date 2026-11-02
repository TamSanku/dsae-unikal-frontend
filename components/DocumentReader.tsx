'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DownloadIcon } from '@/components/icons';
import type { DocumentKind } from '@/lib/document-kind';
import PdfViewer from '@/components/reader/PdfViewer';
import WordViewer from '@/components/reader/WordViewer';
import SheetViewer from '@/components/reader/SheetViewer';
import TextViewer from '@/components/reader/TextViewer';
import ResumeNotice from '@/components/reader/ResumeNotice';
import { ReaderUnsupported } from '@/components/reader/ReaderStates';
import {
  documentKey,
  useReaderNotes,
  useReadingProgress,
  type NoteTool,
  type ReaderTool,
} from '@/lib/reader-notes';

/*
 * Le lecteur plein écran.
 *
 * « Lire » n'ouvre plus un onglet ni une fenêtre : le document prend l'écran,
 * et la fiche reste dessous — on la retrouve en fermant. Tout ce qui entourait
 * le document (auteurs, résumé, note, boutons) disparaît pendant la lecture : il
 * ne reste que la barre haute et le document.
 *
 * **L'en-tête du site reste visible.** Le lecteur ne couvre pas l'écran depuis
 * le bord : il commence sous la barre de navigation, dont la hauteur est
 * mesurée puis suivie (elle change entre bureau et téléphone). Le visiteur peut
 * donc quitter le document par le menu à tout moment, sans chercher le retour.
 *
 * La barre haute porte trois choses : le retour, le titre de l'article, et les
 * outils de lecture. Le nom du fichier n'y figure jamais — c'est un détail
 * technique, pas le sujet.
 *
 * Les outils ne sont proposés que là où ils ont un sens : surligner, souligner
 * et gommer n'existent que pour le PDF, dont le texte est sélectionnable. Les
 * autres formats gardent la barre nue plutôt qu'un bouton inerte.
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
 *
 * Les annotations et la position de lecture sont gardées dans le navigateur du
 * visiteur (`lib/reader-notes.ts`), jamais envoyées au serveur.
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

/* Les formats dont le texte est sélectionnable, donc annotables. */
const ANNOTABLE: DocumentKind[] = ['pdf'];

const TOOL_LABELS: Record<ReaderTool, string> = {
  highlight: 'Surligner',
  underline: 'Souligner',
  erase: 'Gommer',
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
  const key = documentKey(url);

  const { notes, byPage, addNotes, eraseNote, clearNotes } = useReaderNotes(key);
  const { restored, loaded, save, forget } = useReadingProgress(key);

  const [tool, setTool] = useState<ReaderTool | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [progress, setProgress] = useState<{ page: number; total: number } | null>(null);
  /* Un compteur qui change quand le visiteur demande à repartir du début : les
   * visionneuses s'y accrochent pour remonter en haut. */
  const [resetTick, setResetTick] = useState(0);

  /* La hauteur de l'en-tête : le lecteur s'y adosse au lieu de le recouvrir.
   *
   * Elle est mesurée plutôt que fixée — la barre n'a pas la même taille sur un
   * téléphone, et elle peut se replier. Avec l'en-tête figé en haut
   * (`html.reader-open .site-header`), le lecteur et la barre remplissent alors
   * l'écran **exactement**, sans bande où la fiche resterait visible.
   *
   * L'état de lecture lui-même (classe `reader-open`, corps figé) est posé par
   * `DocumentActions`, dès le clic : il est ainsi en place pendant que la
   * visionneuse se charge, et non seulement une fois montée. */
  useLayoutEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector('.site-header');

    const apply = () => {
      const height = header ? Math.round(header.getBoundingClientRect().height) : 0;
      root.style.setProperty('--reader-top', `${height}px`);
    };

    apply();
    const observer = header ? new ResizeObserver(apply) : null;
    if (observer && header) observer.observe(header);
    window.addEventListener('resize', apply);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', apply);
      root.style.removeProperty('--reader-top');
    };
  }, []);

  /* Le focus entre dans le lecteur, sur le retour : au clavier, la suite des
   * tabulations reste dans l'écran, et Échap n'est jamais loin. */
  useEffect(() => {
    backRef.current?.focus();
  }, []);

  /* Échap ferme ; c'est le geste attendu d'un plein écran. Il ferme d'abord
   * l'outil actif, s'il y en a un — on quitte l'outil avant de quitter le
   * document. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setTool((current) => {
        if (current) return null;
        onClose();
        return current;
      });
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

  /* L'avis de reprise n'apparaît que si le visiteur avait laissé une page
   * entamée. Il s'efface tout seul : il informe, il ne réclame rien. */
  useEffect(() => {
    if (!loaded || !restored) return;
    setShowResume(true);
    const timer = window.setTimeout(() => setShowResume(false), 7000);
    return () => window.clearTimeout(timer);
  }, [loaded, restored]);

  /* La position est gardée à chaque changement, sans attendre la fermeture :
   * un onglet fermé par accident ne doit pas coûter la page. */
  const handleProgress = useCallback(
    (page: number, total: number, zoomIndex: number) => {
      setProgress((current) => (current?.page === page && current?.total === total ? current : { page, total }));
      save({ page, total, zoomIndex });
    },
    [save]
  );

  /* Repartir du début : on oublie la position, et on demande aux visionneuses
   * de remonter. On ne recharge pas la page — le document est déjà là, le
   * recharger coûterait une lecture complète pour rien. */
  const restart = useCallback(() => {
    forget();
    setShowResume(false);
    setResetTick((tick) => tick + 1);
  }, [forget]);

  const annotable = ANNOTABLE.includes(kind);

  /* Ce que fait un outil actif, dit en une ligne : on ne laisse pas deviner. */
  const hint =
    tool === 'highlight'
      ? 'Sélectionnez du texte pour le surligner.'
      : tool === 'underline'
        ? 'Sélectionnez du texte pour le souligner.'
        : tool === 'erase'
          ? 'Cliquez une annotation pour la retirer.'
          : null;

  return (
    <div className="reader-full" role="dialog" aria-modal="true" aria-label={`Lecture : ${title}`}>
      <header className="reader-full-bar">
        <button type="button" className="reader-back" onClick={onClose} ref={backRef}>
          <span aria-hidden="true">←</span> Retour
        </button>
        <h1 className="reader-full-title" title={title}>
          {title}
        </h1>

        {annotable && (
          <div className="reader-tools" role="group" aria-label="Outils de lecture">
            {(['highlight', 'underline'] as NoteTool[]).map((name) => (
              <button
                key={name}
                type="button"
                className={`reader-tool${tool === name ? ' is-active' : ''}`}
                aria-pressed={tool === name}
                onClick={() => setTool((current) => (current === name ? null : name))}
                title={TOOL_LABELS[name]}
              >
                <span className={`reader-tool-mark is-${name}`} aria-hidden="true" />
                <span className="reader-tool-label">{TOOL_LABELS[name]}</span>
              </button>
            ))}
            <button
              type="button"
              className={`reader-tool${tool === 'erase' ? ' is-active' : ''}`}
              aria-pressed={tool === 'erase'}
              onClick={() => setTool((current) => (current === 'erase' ? null : 'erase'))}
              title={TOOL_LABELS.erase}
            >
              <span className="reader-tool-mark is-erase" aria-hidden="true" />
              <span className="reader-tool-label">{TOOL_LABELS.erase}</span>
            </button>
            {notes.length > 0 && (
              <button
                type="button"
                className="reader-tool reader-tool-clear"
                onClick={() => {
                  clearNotes();
                  setTool(null);
                }}
                title="Effacer toutes mes annotations"
              >
                Tout effacer
              </button>
            )}
          </div>
        )}

        <a href={download} className="reader-full-download" onClick={onDownload} data-track-skip>
          <DownloadIcon /> <span className="reader-full-download-label">Télécharger</span>
        </a>
      </header>

      {hint && <p className="reader-hint">{hint}</p>}

      <div className="reader-full-body">
        {showResume && restored && (
          <ResumeNotice
            label={
              progress && progress.total > 0
                ? `Reprise à la page ${restored.page} sur ${progress.total}`
                : `Reprise à la page ${restored.page}`
            }
            onRestart={restart}
            onDismiss={() => setShowResume(false)}
          />
        )}

        {kind === 'pdf' && (
          <PdfViewer
            url={url}
            download={download}
            onDownload={onDownload}
            tool={tool}
            byPage={byPage}
            addNotes={addNotes}
            eraseNote={eraseNote}
            restore={restored}
            resetTick={resetTick}
            onProgress={handleProgress}
          />
        )}

        {kind === 'word' && (
          <WordViewer
          url={url}
          download={download}
          onDownload={onDownload}
          storageKey={key}
          resetTick={resetTick}
        />
        )}
        {kind === 'excel' && (
          <SheetViewer
          url={url}
          download={download}
          onDownload={onDownload}
          storageKey={key}
          resetTick={resetTick}
        />
        )}
        {kind === 'text' && (
          <TextViewer
          url={url}
          download={download}
          onDownload={onDownload}
          storageKey={key}
          resetTick={resetTick}
        />
        )}

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
