'use client';

import { useId, useState } from 'react';
import Link from 'next/link';

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  id: string;
  title: string;
  links?: FooterLink[];
  description?: string;
  action?: FooterLink;
};

const sections: FooterSection[] = [
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
    id: 'resources',
    title: 'Ressources',
    links: [
      { label: 'Articles scientifiques', href: '/publications' },
      { label: 'Mémoires', href: '/publications' },
      { label: 'Thèses', href: '/publications' },
      { label: 'Actualités', href: '/actualites' },
      { label: 'Événements', href: '/actualites' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    links: [
      { label: 'S’engager', href: '/s-engager' },
      { label: 'Proposer un partenariat', href: '/s-engager' },
      { label: 'Formulaire de contact', href: '/contact' },
    ],
  },
  {
    id: 'assistance',
    title: 'Assistance',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Nous contacter', href: '/contact' },
      { label: 'Signaler un problème', href: '/contact?subject=report' },
    ],
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    description: 'Recevez les informations et actualités du DSAE.',
    action: { label: 'Demander l’inscription', href: '/contact?subject=newsletter' },
  },
];

export default function FooterAccordion() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const instanceId = useId();

  return (
    <div className="footer-accordion" aria-label="Rubriques du pied de page">
      {sections.map((section) => {
        const isOpen = openSection === section.id;
        const triggerId = `${instanceId}-${section.id}-trigger`;
        const panelId = `${instanceId}-${section.id}-panel`;

        return (
          <section className="footer-accordion-item" key={section.id}>
            <h2 className="footer-accordion-heading">
              <button
                id={triggerId}
                type="button"
                className="footer-accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenSection(isOpen ? null : section.id)}
              >
                <span>{section.title}</span>
                <span className="footer-accordion-indicator" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h2>
            <div
              id={panelId}
              className="footer-accordion-panel"
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
            >
              {section.description && <p className="footer-accordion-description">{section.description}</p>}
              {section.links && (
                <ul className="footer-accordion-links">
                  {section.links.map((link) => (
                    <li key={`${section.id}-${link.href}-${link.label}`}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
              {section.action && (
                <Link href={section.action.href} className="footer-newsletter-link">
                  {section.action.label}
                </Link>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
