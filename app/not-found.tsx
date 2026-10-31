import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section not-found-section">
      <div className="container not-found-box">
        <span className="eyebrow">Erreur 404</span>
        <h1>Page introuvable</h1>
        <p>La page demandée n’existe pas ou a été déplacée.</p>
        <Link href="/" className="btn btn-primary">
          Retour à l’accueil
        </Link>
      </div>
    </section>
  );
}
