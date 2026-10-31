import Link from 'next/link';

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export default function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Informations institutionnelles</span>
          <h1>{title}</h1>
        </div>
      </section>
      <section className="section legal-section">
        <article className="container legal-content">
          <p className="legal-intro">{intro}</p>
          {sections.map((section) => (
            <section className="legal-block" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.heading}-${index}`}>{paragraph}</p>
              ))}
            </section>
          ))}
          <p className="legal-contact">
            Pour une question relative à ces informations, utilisez le{' '}
            <Link href="/contact">formulaire de contact du DSAE</Link>.
          </p>
        </article>
      </section>
    </div>
  );
}
