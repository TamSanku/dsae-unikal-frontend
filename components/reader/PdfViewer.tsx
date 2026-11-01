'use client';

import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ReaderError, ReaderSpinner } from '@/components/reader/ReaderStates';

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
 * Le pied de page — « Page 2 / 14 » et le zoom — est rendu ici, sous le
 * document : c'est le même état qui décide du numéro et de la largeur, il n'a
 * pas à remonter jusqu'au lecteur pour redescendre aussitôt.
 */

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/* Les paliers de zoom. Le facteur s'applique à la largeur disponible. */
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const ZOOM_DEFAULT_INDEX = 2;

export default function PdfViewer({
  url,
  download,
  onDownload,
}: {
  url: string;
  download: string;
  onDownload: () => void;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [pages, setPages] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(ZOOM_DEFAULT_INDEX);
  const [current, setCurrent] = useState(1);
  const [failed, setFailed] = useState<string | null>(null);

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

  /* La page courante : celle qui occupe le haut du cadre. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onScroll = () => {
      const wrappers = Array.from(stage.querySelectorAll<HTMLElement>('[data-reader-page]'));
      const stageTop = stage.getBoundingClientRect().top;
      let visible = 1;
      for (const wrapper of wrappers) {
        const index = Number(wrapper.dataset.readerPage);
        if (wrapper.getBoundingClientRect().top - stageTop <= 80) visible = index + 1;
      }
      setCurrent(visible);
    };
    stage.addEventListener('scroll', onScroll, { passive: true });
    return () => stage.removeEventListener('scroll', onScroll);
  }, [pages]);

  /* Les deux flèches du clavier, et les deux boutons de la barre, font la même
   * chose : amener la page voulue en haut du cadre. */
  useEffect(() => {
    const goTo = (target: number) => {
      const stage = stageRef.current;
      const wrapper = stage?.querySelector<HTMLElement>(`[data-reader-page="${target - 1}"]`);
      if (stage && wrapper) {
        stage.scrollTo({ top: wrapper.offsetTop - stage.offsetTop, behavior: 'smooth' });
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        setCurrent((value) => {
          const next = Math.min(value + 1, pages || 1);
          goTo(next);
          return next;
        });
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        setCurrent((value) => {
          const next = Math.max(value - 1, 1);
          goTo(next);
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pages]);

  if (failed) {
    return <ReaderError message={failed} download={download} onDownload={onDownload} />;
  }

  const pageWidth = Math.max(120, Math.round(width * ZOOM_LEVELS[zoomIndex]));

  return (
    <div className="pdf-viewer">
      <div className="pdf-stage" ref={stageRef}>
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
                <span className="pdf-page-number" aria-hidden="true">
                  {index + 1}
                </span>
              </div>
            ))}
        </Document>
      </div>

      <footer className="reader-full-foot">
        <span className="reader-pages" aria-live="polite">
          {pages > 0 ? `Page ${current} / ${pages}` : 'Chargement…'}
        </span>
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
