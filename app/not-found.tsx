import Link from 'next/link';
import PageHero from '@/components/PageHero';

export default function NotFound() {
  return (
    <>
      <PageHero title="Page introuvable" />
      <section className="section not-found-section">
        <div className="container not-found-box">
          <p>La page demandée n’existe pas ou a été déplacée.</p>
          <Link href="/" className="btn btn-primary">
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </>
  );
}
