'use client';

import { useEffect, useRef, useState } from 'react';
import { ReaderError, ReaderSpinner } from '@/components/reader/ReaderStates';
import { useDocumentBytes } from '@/components/reader/useDocumentBytes';
import { useScrollMemory } from '@/components/reader/useScrollMemory';

/*
 * Le Word, converti en HTML lisible dans la page.
 *
 * mammoth lit le format OOXML et en sort un HTML simple : titres, paragraphes,
 * listes, tableaux, gras et italique. C'est du texte, pas une copie de la mise
 * en page — un document Word ne se met pas en page de la même façon d'un
 * logiciel à l'autre, et une reproduction approximative vaudrait moins qu'une
 * lecture nette.
 *
 * La conversion se fait dans le navigateur : le fichier ne passe par aucun
 * service extérieur. Le HTML obtenu est inséré tel quel, et non par
 * `dangerouslySetInnerHTML` : le contenu d'un document venu de l'extérieur n'a
 * pas à écrire dans notre page.
 */

export default function WordViewer({
  url,
  download,
  onDownload,
  storageKey,
  resetTick,
}: {
  url: string;
  download: string;
  onDownload: () => void;
  storageKey: string;
  resetTick: number;
}) {
  const bytes = useDocumentBytes(url);
  const [html, setHtml] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  /* Le document défile dans son cadre, pas dans le corps : la position se
   * mesure donc sur le cadre (`stageRef`), et le HTML se monte dans la feuille
   * (`hostRef`). Confondre les deux ferait mesurer une hauteur nulle, et la
   * reprise ne mènerait nulle part. */
  const stageRef = useScrollMemory<HTMLDivElement>(storageKey, resetTick);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bytes.status !== 'ready') return;
    let cancelled = false;

    import('mammoth')
      .then((mammoth) =>
        mammoth.convertToHtml(
          { arrayBuffer: bytes.data },
          /* Les images du document sont écartées : elles alourdissent la page
           * sans servir la lecture, et beaucoup de documents n'en portent pas. */
          { convertImage: mammoth.images.imgElement(() => Promise.resolve({ src: '' })) }
        )
      )
      .then((result) => {
        if (cancelled) return;
        setHtml(result.value);
      })
      .catch(() => {
        if (cancelled) return;
        setFailure(
          'Ce document Word n’a pas pu être converti. Il est peut-être protégé, ou enregistré dans un ancien format.'
        );
      });

    return () => {
      cancelled = true;
    };
  }, [bytes]);

  /* Le HTML converti est monté par le navigateur, hors du rendu React. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || html === null) return;
    host.replaceChildren();
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    /* Seul le corps nous intéresse : mammoth y met le document, sans en-tête
     * ni pied de page. */
    for (const node of Array.from(parsed.body.childNodes)) {
      host.appendChild(document.importNode(node, true));
    }
  }, [html, hostRef]);

  if (bytes.status === 'loading') return <ReaderSpinner label="Conversion du document…" />;
  if (bytes.status === 'error') return <ReaderError message={bytes.message} download={download} onDownload={onDownload} />;
  if (failure) return <ReaderError message={failure} download={download} onDownload={onDownload} />;
  if (html === null) return <ReaderSpinner label="Conversion du document…" />;

  return (
    <div className="reader-stage reader-stage-plain" ref={stageRef}>
      <div className="reader-doc reader-doc-word" ref={hostRef} />
    </div>
  );
}
