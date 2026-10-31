import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Contact</span>
          <h1>Nous contacter</h1>
        </div>
      </section>

      <section className="section">
        <div className="container contact-page-grid">
          <div className="contact-info">
            <div className="info-card">
              <h3>Formulaire</h3>
              <p>
                Écrivez-nous via le formulaire : votre message est transmis directement à la faculté,
                qui vous répondra dès que possible.
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
