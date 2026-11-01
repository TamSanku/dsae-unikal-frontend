'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { SiteLogo } from '@/lib/backend';
import { AIDE_LINKS } from '@/lib/aide';
import BrandMark from './BrandMark';

/*
 * La barre de navigation.
 *
 * Les entrées simples mènent à leur page. « Aide et support » porte un « + » :
 * il déplie son sous-menu (FAQ, Guides d'utilisation, Signaler un problème).
 * Sur le bureau le sous-menu s'ouvre sous l'entrée ; dans le tiroir du
 * téléphone il s'insère dans la liste. Les libellés viennent de `lib/aide.ts`,
 * comme la page et le pied de page — les trois ne peuvent pas se contredire.
 */
type NavItem = {
  href: string;
  label: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { href: '/', label: 'Accueil' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/universite', label: 'Université' },
  { href: '/equipe', label: 'Équipe' },
  { href: '/recherche', label: 'Recherche' },
  { href: '/publications', label: 'Publications' },
  { href: '/s-engager', label: 'S’engager' },
  { href: '/alumni', label: 'Alumni' },
  {
    href: '/aide',
    label: 'Aide et support',
    children: AIDE_LINKS.map((link) => ({ label: link.label, href: link.href })),
  },
];

export default function SiteHeader({ logo = null }: { logo?: SiteLogo | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /* Le sous-menu ouvert, par chemin d'entrée ; un seul à la fois. */
  const [submenu, setSubmenu] = useState('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    navRef.current?.scrollTo({ top: 0 });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  /* Refermer le sous-menu quand on change de page. */
  useEffect(() => {
    setSubmenu('');
  }, [pathname]);

  return (
    <header className={`site-header ${open ? 'menu-open' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Accueil">
          <BrandMark logo={logo} />
          <span className="brand-text">
            <strong>DSAE UNIKAL</strong>
            <small>Université de Kalemie</small>
          </span>
        </Link>

        <nav
          ref={navRef}
          id="primary-navigation"
          className={`main-nav ${open ? 'nav-open' : ''}`}
          aria-label="Navigation principale"
        >
          <button
            type="button"
            className="menu-close"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }

            const expanded = submenu === item.href;
            return (
              <div className={`nav-group${expanded ? ' is-open' : ''}`} key={item.href}>
                <button
                  type="button"
                  className={`nav-link nav-group-trigger${isActive ? ' active' : ''}`}
                  aria-expanded={expanded}
                  aria-controls={`nav-submenu-${item.href.slice(1)}`}
                  onClick={() => setSubmenu(expanded ? '' : item.href)}
                >
                  {item.label}
                  <span className="nav-group-plus" aria-hidden="true" />
                </button>
                <div className="nav-submenu" id={`nav-submenu-${item.href.slice(1)}`} role="menu">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      role="menuitem"
                      className="nav-sublink"
                      onClick={() => {
                        setSubmenu('');
                        setOpen(false);
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {open && (
          <button
            type="button"
            className="nav-backdrop"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="header-actions">
          <Link href="/s-engager" className="btn btn-primary header-btn">
            S’engager
          </Link>
          <button
            type="button"
            className={`mobile-toggle ${open ? 'menu-open' : ''}`}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-hidden={open}
            tabIndex={open ? -1 : 0}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
