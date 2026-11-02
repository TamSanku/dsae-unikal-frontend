'use client';

import { useState } from 'react';
import { citationApa, citationBibtex, type CitationData } from '@/lib/reader-citation';
import { useMenu } from '@/components/reader/useMenu';

/*
 * « Citer » : la référence de l'article, prête à recopier.
 *
 * Un bouton, un menu : la référence APA s'affiche et se copie d'un clic, et le
 * fichier BibTeX se télécharge. Rien n'est envoyé nulle part — la référence est
 * écrite dans le navigateur, à partir des données déjà affichées sur la fiche.
 *
 * Le menu se ferme au clic ailleurs et à Échap, comme on l'attend d'un menu.
 * Il ne se ferme pas tout seul après une copie : on veut pouvoir relire ce
 * qu'on vient de copier, et recopier autre chose.
 */
export default function CiteButton({ data }: { data: CitationData }) {
  const [copied, setCopied] = useState(false);
  const { open, setOpen, ref } = useMenu();

  const apa = citationApa(data);
  const bibtex = citationBibtex(data);

  /* La copie peut échouer (contexte non sécurisé, permission refusée) : on le
   * dit alors franchement, plutôt que d'afficher un « copié » mensonger. */
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(apa);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
      setOpen(true);
    }
  };

  const downloadBibtex = () => {
    const blob = new Blob([bibtex], { type: 'application/x-bibtex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${bibtex.split('{')[1]?.split(',')[0] || 'reference'}.bib`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reader-menu" ref={ref}>
      <button
        type="button"
        className={`reader-action${open ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        title="Citer cet article"
      >
        <span className="reader-action-label">Citer</span>
      </button>

      {open && (
        <div className="reader-menu-panel reader-cite-panel" role="dialog" aria-label="Citer cet article">
          <p className="reader-menu-heading">Référence APA</p>
          <p className="reader-cite-text">{apa}</p>

          <div className="reader-menu-actions">
            <button type="button" className="reader-menu-primary" onClick={copy}>
              {copied ? 'Copiée ✓' : 'Copier la référence'}
            </button>
            <button type="button" className="reader-menu-secondary" onClick={downloadBibtex}>
              Export BibTeX
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
