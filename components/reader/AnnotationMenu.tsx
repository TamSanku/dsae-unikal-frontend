'use client';

import { NOTE_TOOLS, type NoteTool, type ReaderTool } from '@/lib/reader-notes';
import { useMenu } from '@/components/reader/useMenu';

/*
 * Les outils d'annotation, groupés sous un seul bouton.
 *
 * Trois gestes — surligner, souligner, barrer — et la gomme. Les étaler en
 * quatre boutons encombrait la barre sans rien apprendre : leur pastille de
 * couleur ne dit pas le geste, et leurs libellés disparaissaient sur téléphone.
 * Réunis, ils gardent leur nom en toutes lettres, et la barre reste lisible.
 *
 * Chaque ligne porte donc son nom, sa pastille, et ce qu'elle fait. C'est la
 * règle demandée : une légende claire, ou un menu — ici les deux.
 */

export const TOOL_LABELS: Record<ReaderTool, string> = {
  highlight: 'Surligner',
  underline: 'Souligner',
  strike: 'Barrer',
  erase: 'Gommer',
};

/* Ce que fait chaque outil, en une phrase. Exporté : la ligne d'aide du
 * lecteur dit exactement la même chose que le menu, sans le répéter. */
export const TOOL_HINTS: Record<ReaderTool, string> = {
  highlight: 'Pose un fond jaune sur le texte sélectionné.',
  underline: 'Trace un trait sous le texte sélectionné.',
  strike: 'Barre le texte sélectionné d’un trait.',
  erase: 'Retire une annotation en cliquant dessus.',
};

export default function AnnotationMenu({
  tool,
  onSelect,
  count,
  onClear,
}: {
  tool: ReaderTool | null;
  onSelect: (tool: ReaderTool | null) => void;
  /** Le nombre d'annotations posées, pour proposer « tout effacer ». */
  count: number;
  onClear: () => void;
}) {
  const { open, setOpen, ref } = useMenu();

  /* Le bouton porte l'outil actif : on voit dans quel mode on est sans ouvrir
   * le menu. Fermé, il dit « Annoter » quand rien n'est actif. */
  const label = tool ? TOOL_LABELS[tool] : 'Annoter';

  const choose = (name: ReaderTool) => {
    onSelect(tool === name ? null : name);
    setOpen(false);
  };

  return (
    <div className="reader-menu" ref={ref}>
      <button
        type="button"
        className={`reader-tool reader-tool-trigger${tool ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        title="Surligner, souligner, barrer"
      >
        <span className={`reader-tool-mark is-${tool ?? 'highlight'}`} aria-hidden="true" />
        <span className="reader-tool-label">{label}</span>
        <span className="reader-tool-caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="reader-menu-panel reader-tools-panel" role="menu" aria-label="Outils d’annotation">
          <p className="reader-menu-heading">Annoter le document</p>
          {[...NOTE_TOOLS, 'erase' as ReaderTool].map((name) => (
            <button
              key={name}
              type="button"
              role="menuitemradio"
              aria-checked={tool === name}
              className={`reader-menu-item${tool === name ? ' is-active' : ''}`}
              onClick={() => choose(name)}
            >
              <span className={`reader-tool-mark is-${name}`} aria-hidden="true" />
              <span className="reader-menu-item-text">
                <span className="reader-menu-item-name">{TOOL_LABELS[name]}</span>
                <span className="reader-menu-item-hint">{TOOL_HINTS[name]}</span>
              </span>
            </button>
          ))}

          {count > 0 && (
            <button
              type="button"
              className="reader-menu-item reader-menu-item-clear"
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              <span className="reader-menu-item-text">
                <span className="reader-menu-item-name">Tout effacer</span>
                <span className="reader-menu-item-hint">
                  Retire les {count} annotation{count > 1 ? 's' : ''} de ce document.
                </span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
