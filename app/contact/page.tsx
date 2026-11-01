import ContactForm from '@/components/ContactForm';
import PageHero from '@/components/PageHero';

type ContactPageProps = {
  searchParams?: {
    subject?: string | string[];
  };
};

export default function ContactPage({ searchParams }: ContactPageProps) {
  const subject = Array.isArray(searchParams?.subject)
    ? searchParams.subject[0]
    : searchParams?.subject;
  const defaultSubject = subject === 'report'
    ? 'Signaler un problème sur le site'
    : subject === 'newsletter'
      ? 'Demande d’inscription à la newsletter'
      : '';

  return (
    <div className="page-shell">
      <PageHero title="Contact" />

      <section className="section">
        <div className="container contact-page-grid">
          <div className="contact-info">
            <div className="info-card">
              <h3>Formulaire</h3>
              <p>
                Écrivez-nous via le formulaire : votre message est transmis directement à l’équipe du DSAE,
                qui vous répondra dès que possible.
              </p>
            </div>
          </div>
          <ContactForm defaultSubject={defaultSubject} />
        </div>
      </section>
    </div>
  );
}
