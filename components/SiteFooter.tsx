import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">DSAE</span>
            <span className="brand-text">
              <strong>DSAE UNIKAL</strong>
              <small>Université de Kalemie</small>
            </span>
          </div>
          <p>
            Portail académique et scientifique de l’Université de Kalemie, au service de la recherche,
            de la formation et de la diffusion des savoirs.
          </p>
        </div>

        <div>
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/a-propos">À propos</Link></li>
            <li><Link href="/universite">Université</Link></li>
            <li><Link href="/equipe">Équipe</Link></li>
            <li><Link href="/recherche">Recherche</Link></li>
            <li><Link href="/publications">Publications</Link></li>
          </ul>
        </div>

        <div>
          <h4>Ressources</h4>
          <ul className="footer-links">
            <li><Link href="/publications">Articles scientifiques</Link></li>
            <li><Link href="/publications">Mémoires</Link></li>
            <li><Link href="/publications">Thèses</Link></li>
            <li><Link href="/actualites">Actualités</Link></li>
            <li><Link href="/actualites">Événements</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-links contact-list">
            <li><Link href="/contact">Formulaire de contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2025 DSAE UNIKAL.</span>
        <div className="legal-links">
          <Link href="/">Mentions légales</Link>
          <Link href="/">Politique de confidentialité</Link>
          <Link href="/">Conditions d’utilisation</Link>
        </div>
      </div>
    </footer>
  );
}
