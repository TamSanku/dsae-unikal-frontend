'use client';

import { useState } from 'react';
import { DownloadIcon, ReadIcon } from '@/components/icons';
import type { DocumentKind } from '@/lib/document-kind';

/*
 * Les deux gestes d'un document : lire sur place, télécharger.
 *
 * « Lire » ouvre le document dans la page, sans quitter le site : PDF, image,
 * vidéo ou son s'affichent directement ; un document bureautique (Word, Excel,
 * PowerPoint) passe par la visionneuse Office, qui a besoin d'une adresse
 * publique — c'est le cas de nos médias. Rien n'est inventé : sans document,
 * le message le dit.
 *
 * Le nom du fichier n'est jamais montré. Le serveur a déjà deviné le format
 * (`kind`) : le lecteur ne reçoit donc aucune trace du nom d'origine.
 */
export default function DocumentActions({
  url,
  kind,
  download,
}: {
  url: string;
  kind: DocumentKind;
  download: string;
}) {
  const [open, setOpen] = useState(false);

  if (!url) {
    return <p className="publication-nodoc">Aucun document joint à cette publication pour le moment.</p>;
  }

  const embedSrc =
    kind === 'office'
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
      : url;

  return (
    <>
      <div className="publication-actions">
        <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
          <ReadIcon /> Lire
        </button>
        <a href={download} className="btn btn-secondary">
          <DownloadIcon /> Télécharger
        </a>
      </div>

      {open && (
        <div className="reader-overlay" role="dialog" aria-modal="true" aria-label="Lecteur de document">
          <div className="reader-window">
            <div className="reader-bar">
              <span className="reader-title">Lecture du document</span>
              <div className="reader-tools">
                <a href={download} className="btn btn-secondary reader-download">
                  <DownloadIcon /> Télécharger
                </a>
                <button type="button" className="reader-close" aria-label="Fermer le lecteur" onClick={() => setOpen(false)}>
                  ×
                </button>
              </div>
            </div>
            <div className="reader-stage">
              {kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="reader-image" src={url} alt="Document" />
              ) : kind === 'video' ? (
                <video className="reader-video" src={url} controls autoPlay />
              ) : kind === 'audio' ? (
                <audio className="reader-audio" src={url} controls autoPlay />
              ) : (
                <iframe className="reader-frame" src={embedSrc} title="Lecteur de document" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
