import Link from 'next/link';
import CookieSettingsButton from './CookieSettingsButton';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid footer-grid-extended">
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

        <div className="footer-social-block">
          <h4>Suivez-nous sur</h4>
          <div className="footer-social-list" aria-label="Réseaux sociaux">
            <span className="footer-tamsanku-logo" role="img" aria-label="TamSanku Avoda">
              <span className="footer-tamsanku-mark">TA</span>
              <span className="footer-tamsanku-name">TamSanku<br />Avoda</span>
            </span>
            <span className="footer-social-icon" role="img" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.6 21v-8.2h2.75l.41-3.2H13.6V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14C16.06 3.05 15.24 3 14.27 3c-2.55 0-4.3 1.56-4.3 4.43v2.47H7.08v3.2h2.89V21z" /></svg>
            </span>
            <span className="footer-social-icon" role="img" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.7" cy="6.6" r="1.1" /></svg>
            </span>
            <span className="footer-social-icon" role="img" aria-label="X" title="X">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.3L6.6 22H3.4l7.3-8.4L3 2h6.4l4.4 5.8L18.9 2zm-1.1 18h1.7L8.5 3.9H6.7L17.8 20z" /></svg>
            </span>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Recevez les informations et actualités du DSAE.</p>
          <Link href="/contact?subject=newsletter" className="footer-newsletter-link">
            Demander l’inscription
          </Link>
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
