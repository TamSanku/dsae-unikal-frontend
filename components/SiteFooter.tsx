'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { SiteLogo, SiteNav } from '@/lib/backend';
import { AIDE_LINKS } from '@/lib/aide';
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
 * Les entrées des rubriques à sous-menu viennent du contenu publié (`nav`,
 * construit par le serveur). Le sous-menu de la rubrique ouverte suit la page
 * où l'on se trouve : sur une fiche de recherche, c'est la rubrique
 * « Recherche » qui est dépliée et l'entrée courante qui est marquée.
 *
 * Les entrées qui ne diffèrent que par la requête (« Actualités » par type,
 * « Alumni » par domaine, « Publications » par domaine, « S'engager » par
 * volet) marquent leur entrée d'après la requête, pas seulement le chemin.
 */
type FooterLink = { label: string; href: string };
type FooterGroup = { id: string; title: string; href: string; links: FooterLink[] };

function buildGroups(nav: SiteNav): FooterGroup[] {
  return [
    { id: 'accueil', title: 'Accueil', href: '/', links: [] },
    { id: 'actualites', title: 'Actualités', href: '/actualites', links: nav.news },
    { id: 'a-propos', title: 'À propos', href: '/a-propos', links: [] },
    { id: 'universite', title: 'Université', href: '/universite', links: [] },
    { id: 'equipe', title: 'Équipe', href: '/equipe', links: nav.team },
    { id: 'recherche', title: 'Recherche', href: '/recherche', links: nav.research },
    { id: 'publications', title: 'Publications', href: '/publications', links: nav.publications },
    { id: 's-engager', title: 'S’engager', href: '/s-engager', links: nav.engager },
    { id: 'alumni', title: 'Alumni', href: '/alumni', links: nav.alumni },
    { id: 'aide', title: 'Aide et support', href: '/aide', links: AIDE_LINKS.map((link) => ({ label: link.label, href: link.href })) },
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
}

/** La rubrique à déplier d'emblée, d'après l'adresse ouverte. */
function activeGroup(pathname: string): string {
  const first = `/${(pathname ?? '').split('/').filter(Boolean)[0] ?? ''}`;
  const known = [
    '/recherche',
    '/equipe',
    '/publications',
    '/actualites',
    '/s-engager',
    '/alumni',
    '/aide',
    '/mentions-legales',
    '/politique-de-confidentialite',
    '/conditions-d-utilisation',
  ];
  if (!known.includes(first)) return '';
  if (first.startsWith('/mentions') || first.startsWith('/politique') || first.startsWith('/conditions')) {
    return 'legal';
  }
  return first.slice(1);
}

/* Les paramètres que le pied de page utilise pour distinguer ses entrées, par
   rubrique : « Actualités » par type, « Publications » et « Alumni » par domaine,
   « S'engager » par volet. */
const LINK_PARAM: Record<string, string> = {
  actualites: 'type',
  publications: 'domain',
  alumni: 'domain',
  's-engager': 'volet',
};

/** Cette entrée correspond-elle à la page ouverte ? */
function isHere(href: string, pathname: string, query: string, param?: string): boolean {
  const path = href.split('?')[0];
  if (path === pathname) {
    /* Même page : on distingue par la requête quand la rubrique s'y prête. */
    if (!param) return true;
    const here = new URLSearchParams(query);
    const wanted = href.split('?')[1];
    if (!wanted) return here.get(param) === null;
    const value = new URLSearchParams(wanted).get(param);
    return value !== null && here.get(param) === value;
  }
  return pathname.startsWith(`${path}/`);
}

export default function SiteFooter({
  logo = null,
  nav,
}: {
  logo?: SiteLogo | null;
  nav: SiteNav;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.toString() ?? '';
  const groups = buildGroups(nav);
  const active = activeGroup(pathname);
  /* La rubrique de la page ouverte démarre dépliée ; ensuite l'état suit les
   * clics de la personne, qui doit pouvoir la refermer. */
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    active ? { [active]: true } : {}
  );
  const baseId = useId();

  const toggle = (id: string) => setOpen((current) => ({ ...current, [id]: !current[id] }));

  /* Changer de page ouvre la rubrique correspondante, et referme celles que
   * l'on avait ouvertes à la main : le pied de page suit la lecture. */
  useEffect(() => {
    setOpen(active ? { [active]: true } : {});
  }, [active, query]);

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
            const param = LINK_PARAM[group.id];
            const here = (href: string) => isHere(href, pathname, query, param);

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
                        <Link
                          href={link.href}
                          className={here(link.href) ? 'is-current' : undefined}
                          aria-current={here(link.href) ? 'page' : undefined}
                        >
                          {link.label}
                        </Link>
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
