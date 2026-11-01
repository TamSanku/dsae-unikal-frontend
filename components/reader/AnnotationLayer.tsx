'use client';

import type { Note, ReaderTool } from '@/lib/reader-notes';

/*
 * Les annotations d'une page, posées entre le dessin du document et sa couche
 * de texte.
 *
 * L'ordre compte : le trait passe **sous** le texte (couche de texte à
 * `z-index: 2`, annotations à `1`), si bien que le texte reste net et noir
 * par-dessus le surlignage. Le reste du temps, la couche ne capte aucun clic —
 * la sélection du texte fonctionne donc normalement.
 *
 * Chaque rectangle est un bouton : quand la gomme est active, cliquer dessus
 * retire l'annotation entière. C'est là que la couche remonte au-dessus du
 * texte (`z-index: 4`), sans quoi le clic n'atteindrait jamais le rectangle.
 */

export default function AnnotationLayer({
  notes,
  tool,
  onErase,
}: {
  notes: Note[];
  tool: ReaderTool | null;
  onErase: (id: string) => void;
}) {
  if (notes.length === 0) return null;

  const erasing = tool === 'erase';

  return (
    <div className={`pdf-notes${erasing ? ' is-erasing' : ''}`}>
      {notes.flatMap((note) =>
        note.rects.map((rect, index) => (
          <button
            key={`${note.id}-${index}`}
            type="button"
            className={`pdf-note pdf-note-${note.kind}`}
            style={{
              left: `${rect.x * 100}%`,
              top: `${rect.y * 100}%`,
              width: `${rect.w * 100}%`,
              height: `${rect.h * 100}%`,
            }}
            onClick={() => onErase(note.id)}
            tabIndex={erasing ? 0 : -1}
            aria-hidden={!erasing}
            aria-label={erasing ? 'Retirer cette annotation' : undefined}
          />
        ))
      )}
    </div>
  );
}
