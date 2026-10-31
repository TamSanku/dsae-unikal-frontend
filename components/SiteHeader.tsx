'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/universite', label: 'Université' },
  { href: '/equipe', label: 'Équipe' },
  { href: '/recherche', label: 'Recherche' },
  { href: '/publications', label: 'Publications' },
  { href: '/actualites', label: 'Actualités' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Accueil">
          <span className="brand-mark">DSAE</span>
          <span className="brand-text">
            <strong>DSAE UNIKAL</strong>
            <small>Université de Kalemie</small>
          </span>
        </Link>

        <nav className={`main-nav ${open ? 'nav-open' : ''}`} aria-label="Navigation principale">
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

        <div className="header-actions">
          <Link href="/contact" className="btn btn-primary header-btn">
            Contact
          </Link>
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Ouvrir le menu"
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
