import Link from 'next/link';
import CookieSettingsButton from './CookieSettingsButton';

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
            Portail du Domaine des Sciences Agronomiques et de l’Environnement de l’Université
            de Kalemie, au service de la formation, de la recherche et des communautés.
          </p>
        </div>

        <div>
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/actualites">Actualités</Link></li>
            <li><Link href="/a-propos">À propos</Link></li>
            <li><Link href="/universite">Université</Link></li>
            <li><Link href="/equipe">Équipe</Link></li>
            <li><Link href="/recherche">Recherche</Link></li>
            <li><Link href="/publications">Publications</Link></li>
            <li><Link href="/alumni">Alumni</Link></li>
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
            <li><Link href="/s-engager">S’engager</Link></li>
            <li><Link href="/s-engager">Proposer un partenariat</Link></li>
            <li><Link href="/contact">Formulaire de contact</Link></li>
          </ul>
          <h4 className="footer-subheading">Assistance</h4>
          <ul className="footer-links contact-list">
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Nous contacter</Link></li>
            <li><Link href="/contact?subject=report">Signaler un problème</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 DSAE UNIKAL.</span>
        <div className="legal-links">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
          <Link href="/conditions-d-utilisation">Conditions d’utilisation</Link>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
