import './globals.css';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'DSAE UNIKAL | Sciences agronomiques et environnement',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="site-body">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
