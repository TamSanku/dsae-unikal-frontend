import type { Metadata } from 'next';
import Link from 'next/link';
import { AIDE_LINKS } from '@/lib/aide';

export const metadata: Metadata = {
  title: 'Aide et support | DSAE UNIKAL',
  description:
    'Aide et support du portail DSAE UNIKAL : questions fréquentes, guides d’utilisation et signalement d’un problème.',
};

/*
 * Aide et support.
 *
 * Une seule page pour les trois volets : les questions fréquentes, les guides
 * d'utilisation et le signalement d'un problème. Les liens de l'en-tête et du
 * pied de page pointent vers ses ancres (`/aide#faq`, `/aide#guides`,
 * `/aide#signaler`), pour que chaque entrée mène directement au bon volet.
 *
 * Rien n'est inventé : les guides décrivent ce que le portail fait réellement,
 * et le signalement renvoie au formulaire de contact avec l'objet prérempli.
 */

const faq = [
  {
    question: 'Qu’est-ce que le DSAE ?',
    answer:
      'Le Domaine des Sciences Agronomiques et de l’Environnement est une composante de l’Université de Kalemie. Il contribue à la formation, à la recherche et à la diffusion des connaissances en agronomie et en environnement.',
  },
  {
    question: 'Où trouver les publications et les axes de recherche ?',
    answer: (
      <>
        Consultez les pages <Link href="/publications">Publications</Link> et{' '}
        <Link href="/recherche">Recherche</Link>. Les contenus disponibles y sont présentés par
        rubrique.
      </>
    ),
  },
  {
    question: 'Comment proposer une publication ou une actualité ?',
    answer: (
      <>
        Contactez l’équipe du DSAE en décrivant votre proposition. Son examen et sa publication ne
        sont pas automatiques. Vous pouvez écrire depuis le{' '}
        <Link href="/contact">formulaire de contact</Link>.
      </>
    ),
  },
  {
    question: 'Comment demander une inscription à la newsletter ?',
    answer: (
      <>
        Envoyez une demande d’inscription à l’équipe du DSAE depuis le{' '}
        <Link href="/contact?subject=newsletter">formulaire de contact</Link>. L’équipe pourra vous
        confirmer la prise en compte de votre demande.
      </>
    ),
  },
  {
    question: 'Comment signaler un problème sur le site ?',
    answer: (
      <>
        Utilisez le formulaire de contact et choisissez l’objet prérempli « Signaler un problème sur
        le site », puis décrivez la page concernée et ce qui ne fonctionne pas.{' '}
        <Link href="/contact?subject=report">Ouvrir le formulaire de signalement</Link>.
      </>
    ),
  },
];

const guides = [
  {
    title: 'Rechercher dans le catalogue',
    steps: [
      'Ouvrez la rubrique voulue : Équipe, Publications, Actualités ou Alumni.',
      'Tapez un mot dans la barre de recherche : la liste se resserre aussitôt.',
      'Cliquez sur l’icône d’entonnoir, à côté de la recherche, pour afficher les filtres.',
    ],
  },
  {
    title: 'Naviguer par onglets',
    steps: [
      'Chaque rubrique propose des onglets : catégories pour l’équipe, domaines pour les publications.',
      'Tous les onglets tiennent sur une seule ligne : faites-les défiler horizontalement au besoin.',
      'Choisissez « Tout » pour revenir à la liste complète.',
    ],
  },
  {
    title: 'Lire une publication ou une actualité',
    steps: [
      'Cliquez sur une carte pour ouvrir sa fiche.',
      'Le document joint se lit ou se télécharge depuis la fiche.',
      'En bas de la fiche, un carrousel propose les autres documents ou actualités.',
    ],
  },
];

export default function AidePage() {
  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Assistance</span>
          <h1>Aide et support</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <nav className="aide-nav" aria-label="Sommaire de l’aide">
            {AIDE_LINKS.map((link) => (
              <a key={link.key} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Questions fréquentes</span>
            <h3>FAQ</h3>
          </div>
          <div className="faq-list">
            {faq.map((item) => (
              <details className="faq-item" key={item.question}>
                <summary>{item.question}</summary>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section" id="guides">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Pas à pas</span>
            <h3>Guides d’utilisation</h3>
          </div>
          <div className="card-grid three-grid">
            {guides.map((guide) => (
              <article className="info-card" key={guide.title}>
                <h4>{guide.title}</h4>
                <ol className="guide-steps">
                  {guide.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="signaler">
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
    </div>
  );
}
