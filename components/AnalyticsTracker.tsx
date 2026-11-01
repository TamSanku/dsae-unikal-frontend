'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/tracker';

/*
 * Le guetteur de navigation : à chaque changement de page, il annonce la vue
 * au backend. Il ne décide de rien — la règle du consentement vit dans
 * `lib/tracker.ts` et, en dernier ressort, sur le serveur.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname || '/', document.title);
  }, [pathname]);

  return null;
}
