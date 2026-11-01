'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import type { SiteLogo } from '@/lib/backend';
import BrandMark from './BrandMark';
import CookieSettingsButton from './CookieSettingsButton';

/*
 * Le pied de page, en accordéon.
 *
 * Chaque rubrique se déplie sur tous les écrans : la même mécanique sert au
 * téléphone et au bureau, il n'y a donc qu'une seule mise en page à entretenir.
 * Une rubrique sans sous-page (« Accueil », « À propos », « Université »…) est
 * un lien direct vers sa page. Les liens viennent des pages réelles du portail :
 * rien n'est inventé.
 *
 * Les entrées d'« Actualités » ouvrent le fil sur le type voulu (`?type=`) :
 * « À la une », « Presse »… Un type inconnu est ignoré par la page.
 */
type FooterLink = { label: string; href: string };
type FooterGroup = { id: string; title: string; href: string; links: FooterLink[] };

const groups: FooterGroup[] = [
  { id: 'accueil', title: 'Accueil', href: '/', links: [] },
  {
    id: 'actualites',
    title: 'Actualités',
    href: '/actualites',
    links: [
      { label: 'À la une', href: '/actualites?type=%C3%80%20la%20une' },
      { label: 'DSAE', href: '/actualites?type=DSAE' },
      { label: 'Presse', href: '/actualites?type=Presse' },
      { label: 'Communiqué', href: '/actualites?type=Communiqu%C3%A9' },
    ],
  },
  { id: 'a-propos', title: 'À propos', href: '/a-propos', links: [] },
  { id: 'universite', title: 'Université', href: '/universite', links: [] },
  { id: 'equipe', title: 'Équipe', href: '/equipe', links: [] },
  { id: 'recherche', title: 'Recherche', href: '/recherche', links: [] },
  { id: 'publications', title: 'Publications', href: '/publications', links: [] },
  { id: 'alumni', title: 'Alumni', href: '/alumni', links: [] },
  {
    id: 'legal',
    title: 'Légal et confiance',
    href: '/mentions-legales',
    links: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
      { label: 'Conditions d’utilisation', href: '/conditions-d-utilisation' },
    ],
  },
];

export default function SiteFooter({ logo = null }: { logo?: SiteLogo | null }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const baseId = useId();

  const toggle = (id: string) => setOpen((current) => ({ ...current, [id]: !current[id] }));

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand-column">
          <div className="brand footer-brand">
            <BrandMark logo={logo} />
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

        <div className="footer-accordion">
          {groups.map((group) => {
            if (group.links.length === 0) {
              return (
                <div className="footer-accordion-item is-flat" key={group.id}>
                  <Link className="footer-accordion-trigger is-flat" href={group.href}>
                    {group.title}
                  </Link>
                </div>
              );
            }

            const panelId = `${baseId}-${group.id}-panel`;
            const isOpen = Boolean(open[group.id]);

            return (
              <div className={`footer-accordion-item ${isOpen ? 'is-open' : ''}`} key={group.id}>
                <button
                  type="button"
                  className="footer-accordion-trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(group.id)}
                >
                  <span>{group.title}</span>
                  <span className="footer-accordion-chevron" aria-hidden="true" />
                </button>

                <div className="footer-accordion-panel" id={panelId} role="region" aria-label={group.title}>
                  <ul className="footer-accordion-links">
                    {group.links.map((link) => (
                      <li key={`${group.id}-${link.label}`}>
                        <Link href={link.href}>{link.label}</Link>
                      </li>
                    ))}
                    {group.id === 'legal' && (
                      <li>
                        <CookieSettingsButton />
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="footer-copyright">© 2026 DSAE UNIKAL. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
