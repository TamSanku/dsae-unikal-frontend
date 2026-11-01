'use client';

import { useEffect, useRef, useState } from 'react';
import { ReaderError, ReaderSpinner } from '@/components/reader/ReaderStates';
import { useDocumentBytes } from '@/components/reader/useDocumentBytes';

/*
 * Le classeur, chaque feuille dans un tableau.
 *
 * SheetJS lit le fichier et rend chaque feuille en HTML. Le tableau est ensuite
 * monté par le navigateur, comme le document Word : le contenu vient de
 * l'extérieur, il n'a pas à écrire dans notre page.
 *
 * Un classeur peut porter plusieurs feuilles : elles deviennent des onglets,
 * et une seule est montrée à la fois. Un `.csv` n'en a qu'une — les onglets
 * disparaissent alors, une barre à un seul onglet n'apprenant rien.
 */

type Sheet = { name: string; html: string };

export default function SheetViewer({
  url,
  download,
  onDownload,
}: {
  url: string;
  download: string;
  onDownload: () => void;
}) {
  const bytes = useDocumentBytes(url);
  const [sheets, setSheets] = useState<Sheet[] | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bytes.status !== 'ready') return;
    let cancelled = false;

    import('xlsx')
      .then((XLSX) => {
        /* `cellDates` garde les dates du classeur lisibles au lieu de les
         * réduire à leur numéro de série. */
        const book = XLSX.read(new Uint8Array(bytes.data), { type: 'array', cellDates: true });
        const parsed = book.SheetNames.map((name) => ({
          name,
          html: XLSX.utils.sheet_to_html(book.Sheets[name], { editable: false }),
        }));
        if (cancelled) return;
        if (parsed.length === 0) {
          setFailure('Ce classeur ne contient aucune feuille lisible.');
          return;
        }
        setSheets(parsed);
        setActive(0);
      })
      .catch(() => {
        if (cancelled) return;
        setFailure('Ce classeur n’a pas pu être lu. Il est peut-être protégé ou endommagé.');
      });

    return () => {
      cancelled = true;
    };
  }, [bytes]);

  /* La feuille active est montée par le navigateur, hors du rendu React. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !sheets) return;
    host.replaceChildren();
    const parsed = new DOMParser().parseFromString(sheets[active].html, 'text/html');
    const table = parsed.querySelector('table');
    if (table) host.appendChild(document.importNode(table, true));
  }, [sheets, active]);

  if (bytes.status === 'loading') return <ReaderSpinner label="Ouverture du classeur…" />;
  if (bytes.status === 'error') return <ReaderError message={bytes.message} download={download} onDownload={onDownload} />;
  if (failure) return <ReaderError message={failure} download={download} onDownload={onDownload} />;
  if (!sheets) return <ReaderSpinner label="Ouverture du classeur…" />;

  return (
    <div className="sheet-viewer">
      {sheets.length > 1 && (
        <div className="sheet-tabs" role="tablist" aria-label="Feuilles du classeur">
          {sheets.map((sheet, index) => (
            <button
              key={sheet.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={`sheet-tab${index === active ? ' is-active' : ''}`}
              onClick={() => setActive(index)}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}
      <div className="sheet-stage">
        <div className="reader-doc reader-doc-sheet" ref={hostRef} />
      </div>
    </div>
  );
}
