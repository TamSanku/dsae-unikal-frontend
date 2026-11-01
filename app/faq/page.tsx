import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ | DSAE UNIKAL',
  description: 'Réponses aux questions fréquentes sur le portail du DSAE UNIKAL.',
};

const questions = [
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
        <Link href="/recherche">Recherche</Link>. Les contenus disponibles y sont présentés par rubrique.
      </>
    ),
  },
  {
    question: 'Comment proposer une publication ou une actualité ?',
    answer: (
      <>
        Contactez l’équipe du DSAE en décrivant votre proposition. Son examen et sa publication ne sont
        pas automatiques. Vous pouvez écrire depuis le <Link href="/contact">formulaire de contact</Link>.
      </>
    ),
  },
  {
    question: 'Comment signaler un problème sur le site ?',
    answer: (
      <>
        Utilisez le formulaire de contact et choisissez l’objet prérempli « Signaler un problème sur le
        site », puis décrivez la page concernée et ce qui ne fonctionne pas.{' '}
        <Link href="/contact?subject=report">Ouvrir le formulaire de signalement</Link>.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Assistance</span>
          <h1>Foire aux questions</h1>
        </div>
      </section>

      <section className="section">
        <div className="container faq-list">
          {questions.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <div className="faq-answer"><p>{item.answer}</p></div>
            </details>
          ))}
          <p className="faq-contact-note">
            Vous ne trouvez pas la réponse recherchée ? <Link href="/contact">Nous contacter</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
