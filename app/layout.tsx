import './globals.css';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'DSAE UNIKAL | Faculté scientifique de l’Université de Kalemie',
  description:
    'Portail scientifique de la faculté et de l’Université de Kalemie (UNIKAL), dédié aux publications, à la recherche et à l’équipe académique.',
  keywords: ['UNIKAL', 'Kalemie', 'Recherche scientifique', 'Faculté', 'Publications'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
