'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <section className="section">
      <div className="container error-box">
        <span className="eyebrow">Erreur</span>
        <h1>Une erreur est survenue</h1>
        <p>Le contenu demandé n’a pas pu être chargé correctement.</p>
        <button type="button" className="btn btn-primary" onClick={() => reset()}>
          Réessayer
        </button>
      </div>
    </section>
  );
}
