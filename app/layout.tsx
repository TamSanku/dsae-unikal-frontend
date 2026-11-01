import './globals.css';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSiteLogo, getSiteNav } from '@/lib/backend';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieConsent from '@/components/CookieConsent';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  title: {
    default: 'DSAE UNIKAL | Sciences agronomiques et environnement',
    template: '%s | DSAE UNIKAL',
  },
  description:
    'Portail du Domaine des Sciences Agronomiques et de l’Environnement (DSAE) de l’Université de Kalemie (UNIKAL) : formation, recherche, publications et actualités.',
  keywords: [
    'UNIKAL',
    'Kalemie',
    'Sciences agronomiques',
    'Environnement',
    'Recherche',
    'Publications',
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [logo, nav] = await Promise.all([getSiteLogo(), getSiteNav()]);
  return (
    <html lang="fr">
      <body className="site-body">
        <SiteHeader logo={logo} />
        <main>{children}</main>
        {/* Le pied de page lit la requête pour marquer l'entrée courante : la
            limite de suspense permet aux pages de rester prérendues. */}
        <Suspense fallback={null}>
          <SiteFooter logo={logo} nav={nav} />
        </Suspense>
        <AnalyticsTracker />
        <CookieConsent />
      </body>
    </html>
  );
}
