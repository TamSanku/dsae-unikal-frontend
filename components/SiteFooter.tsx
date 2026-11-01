import Link from 'next/link';
import CookieSettingsButton from './CookieSettingsButton';

type FooterLink = { label: string; href: string };
type FooterColumn = { id: string; title: string; links: FooterLink[] };

/*
 * Les rubriques du pied de page. Chaque lien mène à une page réelle : pas de
 * doublon « Mémoires / Thèses » vers la même URL, et aucune icône sociale
 * factice (le DSAE n'a pas de comptes publics configurés).
 */
const columns: FooterColumn[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Actualités', href: '/actualites' },
      { label: 'À propos', href: '/a-propos' },
      { label: 'Université', href: '/universite' },
      { label: 'Équipe', href: '/equipe' },
      { label: 'Recherche', href: '/recherche' },
      { label: 'Publications', href: '/publications' },
      { label: 'Alumni', href: '/alumni' },
    ],
  },
  {
    id: 'ressources',
    title: 'Ressources',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Newsletter', href: '/contact?subject=newsletter' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    links: [
      { label: 'Formulaire de contact', href: '/contact' },
      { label: 'Proposer un partenariat', href: '/s-engager' },
      { label: 'Signaler un problème', href: '/contact?subject=report' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand-column">
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

        {columns.map((column) => (
          <nav className="footer-col" key={column.id} aria-label={column.title}>
            <h2 className="footer-col-title">{column.title}</h2>
            <ul className="footer-links">
              {column.links.map((link) => (
                <li key={`${column.id}-${link.href}-${link.label}`}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container footer-bottom">
        <div className="footer-legal-group">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>
          <Link href="/conditions-d-utilisation">Conditions d’utilisation</Link>
          <CookieSettingsButton />
        </div>
        <p className="footer-copyright">© 2026 DSAE UNIKAL. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
