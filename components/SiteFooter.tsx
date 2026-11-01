import Link from 'next/link';
import CookieSettingsButton from './CookieSettingsButton';
import FooterAccordion from './FooterAccordion';

function FooterSocialMarks() {
  return (
    <div className="footer-social-center">
      <span className="footer-social-caption">Suivez-nous sur</span>
      <div className="footer-social-icons" role="group" aria-label="Réseaux sociaux">
        <span className="footer-tamsanku-logo footer-tamsanku-logo-compact" role="img" aria-label="TamSanku Avoda">
          <span className="footer-tamsanku-mark">TA</span>
          <span className="footer-tamsanku-name">TamSanku Avoda</span>
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
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer site-footer-accordion">
      <div className="container footer-brand-intro">
        <div className="brand footer-brand">
          <span className="brand-mark">DSAE</span>
          <span className="brand-text">
            <strong>DSAE UNIKAL</strong>
            <small>Université de Kalemie</small>
          </span>
        </div>
        <p className="footer-brand-description">
          Portail du Domaine des Sciences Agronomiques et de l’Environnement de l’Université de
          Kalemie, au service de la formation, de la recherche et des communautés.
        </p>
      </div>

      <div className="container footer-accordion-container">
        <FooterAccordion />
      </div>

      <div className="container footer-bottom-layout">
        <div className="footer-legal-group footer-legal-left">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
        </div>

        <FooterSocialMarks />

        <div className="footer-legal-group footer-legal-right">
          <Link href="/conditions-d-utilisation">Conditions d’utilisation</Link>
          <CookieSettingsButton />
        </div>
      </div>

      <div className="container footer-copyright">
        <span>© 2026 DSAE UNIKAL.</span>
      </div>
    </footer>
  );
}
