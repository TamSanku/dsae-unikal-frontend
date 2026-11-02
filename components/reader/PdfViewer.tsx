'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ReaderError, ReaderSpinner } from '@/components/reader/ReaderStates';
import AnnotationLayer from '@/components/reader/AnnotationLayer';
import { NOTE_TOOLS } from '@/lib/reader-notes';
import type { Note, NoteRect, NoteTool, ReaderTool, ReadingProgress } from '@/lib/reader-notes';

/*
 * Le PDF, dessiné dans la page.
 *
 * PDF.js dessine les pages sur un canvas : le document s'affiche donc partout,
 * y compris sur Android, où un `<iframe>` ou un `<embed>` n'ouvre rien — c'est
 * précisément ce qui produisait le bouton « Ouvrir » du lecteur natif.
 *
 * Le moteur tourne dans un fil de travail séparé, servi depuis notre propre
 * domaine (`/pdf.worker.min.mjs`, posé là au déploiement) : le document ne part
 * donc pas chez un tiers, et le fichier suit la version de PDF.js installée.
 *
 * Le zoom s'exprime en fraction de la largeur disponible, et non en pixels :
 * sur téléphone, le « 100 % » montre la page entière, sans défilement
 * horizontal. Les pages sont empilées, on descend dans le document comme dans
 * une liasse.
 *
 * Le pied de page — la pagination, les flèches et le zoom — est rendu ici, sous
 * le document : c'est le même état qui décide du numéro et de la largeur, il
 * n'a pas à remonter jusqu'au lecteur pour redescendre aussitôt.
 *
 * Annoter, c'est annoter la **couche de texte** du PDF, pas le dessin : on lit
 * la sélection du navigateur, on la traduit en rectangles rapportés à la page
 * (0 à 1), et on la dessine sous le texte. Le zoom peut donc changer sans
 * déplacer les traits, et le texte reste sélectionnable par-dessus.
 */

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/* Les paliers de zoom. Le facteur s'applique à la largeur disponible. */
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const ZOOM_DEFAULT_INDEX = 2;

/** La page qui occupe le haut du cadre, pour une position de défilement donnée. */
function pageAtTop(stage: HTMLElement): number {
  const wrappers = Array.from(stage.querySelectorAll<HTMLElement>('[data-reader-page]'));
  const stageTop = stage.getBoundingClientRect().top;
  let visible = 1;
  for (const wrapper of wrappers) {
    const index = Number(wrapper.dataset.readerPage);
    if (wrapper.getBoundingClientRect().top - stageTop <= 80) visible = index + 1;
  }
  return visible;
}

/*
 * La sélection du navigateur, découpée en rectangles rapportés à leur page.
 *
 * La page d'un rectangle se déduit de **sa position**, comparée aux cadres des
 * pages — jamais de ce qui se trouve dessous. Un `elementFromPoint` dépendrait
 * de ce qui recouvre le point (un bandeau, une annotation), et échouerait pour
 * un texte sorti de l'écran : la sélection doit se lire dans le document, pas
 * dans la fenêtre.
 *
 * Une sélection peut traverser deux pages : elle est alors rendue par un
 * rectangle par page, chacun mesuré contre **sa** page — sinon les traits
 * glisseraient d'une page à l'autre.
 */
function selectionRects(): { page: number; rects: NoteRect[] }[] {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return [];

  /* Les cadres des pages, mesurés une fois pour toute la sélection. */
  const pages = Array.from(document.querySelectorAll<HTMLElement>('[data-reader-page]'))
    .map((element) => ({
      page: Number(element.dataset.readerPage) + 1,
      bounds: element.getBoundingClientRect(),
    }))
    .filter(({ bounds }) => bounds.width > 1 && bounds.height > 1);

  const byPage = new Map<number, NoteRect[]>();

  for (let index = 0; index < selection.rangeCount; index += 1) {
    const range = selection.getRangeAt(index);
    for (const clientRect of Array.from(range.getClientRects())) {
      if (clientRect.width < 2 || clientRect.height < 2) continue;

      /* La page est celle dont le cadre contient le centre du rectangle. */
      const midX = clientRect.left + clientRect.width / 2;
      const midY = clientRect.top + clientRect.height / 2;
      const owner = pages.find(
        ({ bounds }) =>
          midX >= bounds.left && midX <= bounds.right && midY >= bounds.top && midY <= bounds.bottom
      );
      if (!owner) continue;

      const { bounds } = owner;
      const rect: NoteRect = {
        x: (clientRect.left - bounds.left) / bounds.width,
        y: (clientRect.top - bounds.top) / bounds.height,
        w: clientRect.width / bounds.width,
        h: clientRect.height / bounds.height,
      };

      /* On écarte ce qui sort de la page : un rectangle négatif ou débordant
       * produirait un trait en travers du vide. */
      if (rect.x < -0.02 || rect.y < -0.02 || rect.x + rect.w > 1.02 || rect.y + rect.h > 1.02) continue;

      const list = byPage.get(owner.page);
      if (list) list.push(rect);
      else byPage.set(owner.page, [rect]);
    }
  }

  return Array.from(byPage, ([page, rects]) => ({ page, rects }));
}

export default function PdfViewer({
  url,
  download,
  onDownload,
  tool,
  byPage,
  addNotes,
  eraseNote,
  restore,
  resetTick,
  onProgress,
}: {
  url: string;
  download: string;
  onDownload: () => void;
  tool: ReaderTool | null;
  byPage: Map<number, Note[]>;
  addNotes: (groups: { page: number; kind: NoteTool; rects: NoteRect[] }[]) => void;
  eraseNote: (id: string) => void;
  restore: ReadingProgress | null;
  resetTick: number;
  onProgress: (page: number, total: number, zoomIndex: number) => void;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [pages, setPages] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(restore?.zoomIndex ?? ZOOM_DEFAULT_INDEX);
  const [current, setCurrent] = useState(1);
  const [failed, setFailed] = useState<string | null>(null);
  const restoredRef = useRef(false);

  /* La largeur utile du cadre : le zoom s'y rapporte. On la mesure au lieu de
   * la déduire, pour que la page tienne même dans un cadre étroit. */
  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(element);
    setWidth(Math.floor(element.getBoundingClientRect().width));
    return () => observer.disconnect();
  }, []);

  /* La page courante suit le défilement. On ne repose l'état que lorsqu'il
   * change vraiment : un défilement continu ne doit pas redessiner la pile. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onScroll = () => {
      const visible = pageAtTop(stage);
      setCurrent((value) => (value === visible ? value : visible));
    };
    stage.addEventListener('scroll', onScroll, { passive: true });
    return () => stage.removeEventListener('scroll', onScroll);
  }, [pages]);

  /* Amener une page en haut du cadre. */
  const goToPage = useCallback((target: number, smooth = true) => {
    const stage = stageRef.current;
    const wrapper = stage?.querySelector<HTMLElement>(`[data-reader-page="${target - 1}"]`);
    if (stage && wrapper) {
      stage.scrollTo({ top: wrapper.offsetTop - stage.offsetTop, behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  /* Reprendre où le visiteur s'était arrêté. Le rendu des pages n'est pas
   * encore mesurable au premier passage : on retente quelques fois, sans quoi
   * la reprise retomberait en haut du document. */
  useEffect(() => {
    if (restoredRef.current || !restore || pages === 0 || width === 0) return;
    let tries = 0;
    let timer = 0;
    const attempt = () => {
      goToPage(Math.min(restore.page, pages), false);
      tries += 1;
      const stage = stageRef.current;
      /* La page visée est-elle bien devenue la page courante ? Sinon on retente. */
      if (stage && pageAtTop(stage) === Math.min(restore.page, pages)) {
        restoredRef.current = true;
        return;
      }
      if (tries < 6) timer = window.setTimeout(attempt, 120);
      else restoredRef.current = true;
    };
    timer = window.setTimeout(attempt, 60);
    return () => window.clearTimeout(timer);
  }, [restore, pages, width, goToPage]);

  /* « Recommencer au début » : on remonte à la première page, et on ne
   * re-restaure plus ensuite. */
  useEffect(() => {
    if (resetTick === 0) return;
    restoredRef.current = true;
    setCurrent(1);
    goToPage(1);
  }, [resetTick, goToPage]);

  /* Signaler la position au lecteur, qui la garde. */
  useEffect(() => {
    if (pages > 0) onProgress(current, pages, zoomIndex);
  }, [current, pages, zoomIndex, onProgress]);

  /* La sélection devient un trait, dès que le doigt ou le bouton se relève. Le
   * court délai laisse le navigateur finir de composer la sélection. */
  useEffect(() => {
    /* La garde porte sur la valeur elle-même : TypeScript sait alors que `kind`
     * est un vrai outil d'annotation, et non un outil de lecteur quelconque. */
    if (tool !== 'highlight' && tool !== 'underline' && tool !== 'strike') return;
    const kind: NoteTool = tool;
    const stage = stageRef.current;
    if (!stage) return;

    const capture = () => {
      window.setTimeout(() => {
        const groups = selectionRects();
        if (groups.length === 0) return;
        addNotes(groups.map((group) => ({ page: group.page, kind, rects: group.rects })));
        window.getSelection()?.removeAllRanges();
      }, 0);
    };

    stage.addEventListener('mouseup', capture);
    stage.addEventListener('touchend', capture);
    return () => {
      stage.removeEventListener('mouseup', capture);
      stage.removeEventListener('touchend', capture);
    };
  }, [tool, addNotes]);

  /* Les flèches du clavier, et les boutons du pied, font la même chose : amener
   * la page voulue en haut du cadre. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        setCurrent((value) => {
          const next = Math.min(value + 1, pages || 1);
          goToPage(next);
          return next;
        });
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        setCurrent((value) => {
          const next = Math.max(value - 1, 1);
          goToPage(next);
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pages, goToPage]);

  if (failed) {
    return <ReaderError message={failed} download={download} onDownload={onDownload} />;
  }

  const pageWidth = Math.max(120, Math.round(width * ZOOM_LEVELS[zoomIndex]));
  const annotating = !!tool && NOTE_TOOLS.includes(tool as NoteTool);

  return (
    <div className="pdf-viewer">
      <div
        className={`pdf-stage${tool === 'erase' ? ' is-erasing' : ''}${annotating ? ' is-annotating' : ''}`}
        ref={stageRef}
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setPages(numPages)}
          onLoadError={() => setFailed('Le fichier n’a pas pu être lu. Il est peut-être protégé ou endommagé.')}
          loading={<ReaderSpinner label="Ouverture du document…" />}
          error={<ReaderError message="Le fichier n’a pas pu être lu." download={download} onDownload={onDownload} />}
        >
          {width > 0 &&
            Array.from({ length: pages }, (_, index) => (
              <div className="pdf-page" data-reader-page={index} key={index}>
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  loading=""
                  error=""
                  onRenderError={() => setFailed('Une page n’a pas pu s’afficher.')}
                />
                <AnnotationLayer
                  notes={byPage.get(index + 1) ?? []}
                  tool={tool}
                  onErase={eraseNote}
                />
                <span className="pdf-page-number" aria-hidden="true">
                  {index + 1}
                </span>
              </div>
            ))}
        </Document>
      </div>

      <footer className="reader-full-foot">
        <div className="reader-pager">
          <button
            type="button"
            className="reader-page-btn"
            onClick={() => {
              const next = Math.max(current - 1, 1);
              setCurrent(next);
              goToPage(next);
            }}
            disabled={current <= 1}
            aria-label="Page précédente"
          >
            ‹
          </button>
          <span className="reader-pages" aria-live="polite">
            {pages > 0 ? `Page ${current} / ${pages}` : 'Chargement…'}
          </span>
          <button
            type="button"
            className="reader-page-btn"
            onClick={() => {
              const next = Math.min(current + 1, pages || 1);
              setCurrent(next);
              goToPage(next);
            }}
            disabled={pages > 0 && current >= pages}
            aria-label="Page suivante"
          >
            ›
          </button>
        </div>

        <div className="reader-zoom" role="group" aria-label="Zoom du document">
          <button
            type="button"
            className="reader-zoom-btn"
            onClick={() => setZoomIndex((index) => Math.max(0, index - 1))}
            disabled={zoomIndex === 0}
            aria-label="Réduire le zoom"
          >
            −
          </button>
          <span className="reader-zoom-value" aria-live="polite">
            {Math.round(ZOOM_LEVELS[zoomIndex] * 100)} %
          </span>
          <button
            type="button"
            className="reader-zoom-btn"
            onClick={() => setZoomIndex((index) => Math.min(ZOOM_LEVELS.length - 1, index + 1))}
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            aria-label="Agrandir le zoom"
          >
            +
          </button>
        </div>
      </footer>
    </div>
  );
}
