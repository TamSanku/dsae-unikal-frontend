'use client';

import { useEffect, useState } from 'react';
import { ReaderError, ReaderSpinner } from '@/components/reader/ReaderStates';
import { useDocumentBytes } from '@/components/reader/useDocumentBytes';
import { useScrollMemory } from '@/components/reader/useScrollMemory';

/*
 * Le texte brut, affiché tel quel.
 *
 * Le contenu est écrit dans le DOM comme un nœud de texte, jamais comme du
 * HTML : un fichier `.txt` qui contient des balises doit s'afficher avec ses
 * balises, pas les exécuter.
 */

export default function TextViewer({
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
  const stageRef = useScrollMemory<HTMLDivElement>(storageKey, resetTick);
  const [text, setText] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    if (bytes.status !== 'ready') return;
    try {
      setText(new TextDecoder('utf-8', { fatal: false }).decode(bytes.data));
    } catch {
      setFailure('Ce fichier texte n’a pas pu être lu.');
    }
  }, [bytes]);

  if (bytes.status === 'loading') return <ReaderSpinner label="Ouverture du fichier…" />;
  if (bytes.status === 'error') return <ReaderError message={bytes.message} download={download} onDownload={onDownload} />;
  if (failure) return <ReaderError message={failure} download={download} onDownload={onDownload} />;
  if (text === null) return <ReaderSpinner label="Ouverture du fichier…" />;

  return (
    <div className="reader-stage reader-stage-plain" ref={stageRef}>
      <pre className="reader-doc reader-doc-text">{text}</pre>
    </div>
  );
}
