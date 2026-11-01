'use client';

/*
 * L'avis de reprise : une seule ligne, discrète, posée au-dessus du document.
 *
 * Il dit où la lecture reprend, et propose de recommencer au début. Il
 * s'efface tout seul après quelques secondes, et se ferme d'un clic : il
 * informe, il ne réclame rien.
 */
export default function ResumeNotice({
  label,
  onRestart,
  onDismiss,
}: {
  label: string;
  onRestart: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="reader-resume" role="status">
      <span>{label}</span>
      <button type="button" className="reader-resume-restart" onClick={onRestart}>
        Recommencer au début
      </button>
      <button
        type="button"
        className="reader-resume-close"
        onClick={onDismiss}
        aria-label="Masquer cet avis"
      >
        ×
      </button>
    </div>
  );
}
