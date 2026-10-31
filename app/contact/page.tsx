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
              <h3>Adresse</h3>
              <p>Université de Kalemie (UNIKAL), Avenue scientifique, Kalemie</p>
            </div>
            <div className="info-card">
              <h3>Email</h3>
              <p>contact@unikal.ac.cd</p>
            </div>
            <div className="info-card">
              <h3>Téléphone</h3>
              <p>+243 000 000 000</p>
            </div>
            <div className="info-card">
              <h3>Réseaux</h3>
              <p>LinkedIn • Facebook • X • YouTube</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
