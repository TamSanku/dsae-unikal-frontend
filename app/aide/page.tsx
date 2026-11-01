import type { Metadata } from 'next';
import Link from 'next/link';
import { AIDE_LINKS } from '@/lib/aide';
import AideTabs from '@/components/AideTabs';
import HelpBrowser, { type HelpGroup } from '@/components/HelpBrowser';
import { FAQ_GROUPS, GUIDES_GROUPS, GuideBody } from './content';


export const metadata: Metadata = {
  title: 'Aide et support | DSAE UNIKAL',
  description:
    'Centre d’aide du portail DSAE UNIKAL : questions fréquentes, guides d’utilisation pas à pas et signalement d’un problème.',
};

/*
 * Aide et support.
 *
 * Une seule page, trois volets : les questions fréquentes, les guides
 * d'utilisation et le signalement d'un problème. Ce sont des onglets, alignés
 * sur une ligne comme les autres catalogues du portail — choisir « FAQ » ne
 * montre que la FAQ.
 *
 * Les liens de l'en-tête et du pied de page portent l'ancre du volet
 * (`/aide#faq`, `/aide#guides`, `/aide#signaler`) : la page ouvre directement le
 * bon volet.
 *
 * La FAQ et les guides sont longs : chaque volet porte donc une barre de
 * recherche (`components/HelpBrowser.tsx`) qui resserre la liste sans rien
 * demander au serveur. Les entrées sont rangées par thème, pour qu'on trouve
 * vite ce que l'on cherche.
 *
 * Rien n'est inventé : chaque réponse et chaque étape décrivent ce que le
 * portail fait réellement — les rubriques, la recherche, les onglets, le
 * téléchargement, les avis, les cookies. Le signalement renvoie au formulaire
 * de contact avec l'objet prérempli.
 */

export default function AidePage() {
  const labelOf = (key: string) => AIDE_LINKS.find((link) => link.key === key)?.label ?? key;

  const faqGroups: HelpGroup[] = FAQ_GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    entries: group.items.map((item) => ({
      key: item.key,
      title: item.question,
      searchText: item.search,
      body: <p>{item.answer}</p>,
    })),
  }));

  const guideGroups: HelpGroup[] = GUIDES_GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    entries: group.items.map((item) => ({
      key: item.key,
      title: item.title,
      searchText: item.search,
      body: <GuideBody guide={item} />,
    })),
  }));

  const faqPanel = (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Questions fréquentes</span>
          <h3>FAQ</h3>
          <p className="lead-text">
            Les réponses aux questions les plus courantes, rangées par thème. Cherchez un mot pour
            aller droit au but.
          </p>
        </div>
        <HelpBrowser
          key="faq"
          groups={faqGroups}
          placeholder="Rechercher une question…"
          noun="question"
          variant="faq"
          emptyHint="Aucune question ne correspond. Essayez un mot plus général, ou parcourez les thèmes ci-dessus."
        />
      </div>
    </section>
  );

  const guidesPanel = (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Pas à pas</span>
          <h3>Guides d’utilisation</h3>
          <p className="lead-text">
            Des marches à suivre courtes, de la première visite à la prise de contact. Chaque guide
            décrit ce que le portail fait réellement.
          </p>
        </div>
        <HelpBrowser
          key="guides"
          groups={guideGroups}
          placeholder="Rechercher un guide…"
          noun="guide"
          variant="guide"
          emptyHint="Aucun guide ne correspond. Essayez un mot plus général, ou parcourez les thèmes ci-dessus."
        />
      </div>
    </section>
  );

  const signalerPanel = (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Support</span>
          <h3>Signaler un problème</h3>
        </div>
        <div className="info-card aide-report">
          <p>
            Une page ne s’affiche pas comme il faut, un document ne s’ouvre pas, une information
            vous paraît erronée ? Écrivez-nous : indiquez la page concernée et ce qui ne fonctionne
            pas. L’équipe du DSAE en prendra connaissance.
          </p>
          <Link href="/contact?subject=report" className="btn btn-primary">
            Signaler un problème
          </Link>
        </div>
        <p className="faq-contact-note">
          Une autre question ? <Link href="/contact">Nous contacter</Link>.
        </p>
      </div>
    </section>
  );

  const panels = [
    { key: 'faq', label: labelOf('faq'), content: faqPanel },
    { key: 'guides', label: labelOf('guides'), content: guidesPanel },
    { key: 'signaler', label: labelOf('signaler'), content: signalerPanel },
  ];

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Assistance</span>
          <h1>Aide et support</h1>
          <p className="lead-text">
            Réponses immédiates, guides pas à pas et moyen de nous joindre — au même endroit.
          </p>
        </div>
      </section>

      <AideTabs panels={panels} />
    </div>
  );
}

