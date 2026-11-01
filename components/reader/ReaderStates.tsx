'use client';

import { DownloadIcon } from '@/components/icons';

/*
 * Les trois états que peut prendre le lecteur en dehors du document lui-même :
 * il charge, il a échoué, ou le format n'est pas affichable.
 *
 * Aucun de ces messages ne nomme le fichier : ils parlent du format, jamais du
 * nom d'origine. En cas d'échec, le bouton « Télécharger » reste la sortie de
 * secours — c'est le seul geste qui marche toujours.
 */

export function ReaderSpinner({ label = 'Ouverture du document…' }: { label?: string }) {
  return (
    <div className="reader-state" role="status" aria-live="polite">
      <span className="reader-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ReaderError({
  message,
  download,
  onDownload,
}: {
  message: string;
  download: string;
  onDownload: () => void;
}) {
  return (
    <div className="reader-state" role="alert">
      <h2>Le document ne s’est pas ouvert</h2>
      <p>{message}</p>
      <a href={download} className="btn btn-primary" onClick={onDownload} data-track-skip>
        <DownloadIcon /> Télécharger
      </a>
    </div>
  );
}

export function ReaderUnsupported({
  label,
  download,
  onDownload,
}: {
  label: string;
  download: string;
  onDownload: () => void;
}) {
  return (
    <div className="reader-state" role="alert">
      <h2>Format non pris en charge dans le lecteur</h2>
      <p>
        Ce document est dans un format que le lecteur ne sait pas afficher{label ? ` (${label})` : ''}.
        Il reste téléchargeable : il s’ouvrira alors dans l’application adaptée de votre appareil.
      </p>
      <a href={download} className="btn btn-primary" onClick={onDownload} data-track-skip>
        <DownloadIcon /> Télécharger
      </a>
    </div>
  );
}
