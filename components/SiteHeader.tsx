'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { SiteLogo } from '@/lib/backend';
import BrandMark from './BrandMark';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/universite', label: 'Université' },
  { href: '/equipe', label: 'Équipe' },
  { href: '/recherche', label: 'Recherche' },
  { href: '/publications', label: 'Publications' },
  { href: '/alumni', label: 'Alumni' },
];

export default function SiteHeader({ logo = null }: { logo?: SiteLogo | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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
