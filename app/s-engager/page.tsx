import Image from 'next/image';
import { getPartners } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import { ENGAGER_TABS } from '@/lib/engager';
import ContactForm from '@/components/ContactForm';
import EngagerTabs from '@/components/EngagerTabs';

/*
 * S'engager : trois volets — proposer un partenariat, nous contacter, nos
 * partenaires. Les partenaires viennent de la rubrique `dsae-partners` du
 * backoffice ; tant qu'elle est vide, l'onglet le dit. Aucun partenaire n'est
 * inventé.
 *
 * Le paramètre `volet` ouvre d'emblée le volet voulu : le pied de page s'en sert
 * pour ses liens. Un volet inconnu est ignoré — on retombe sur le premier.
 */
export default async function EngagerPage({
  searchParams,
}: {
  searchParams?: { volet?: string | string[] };
}) {
  const partners = await getPartners();
  const requested = Array.isArray(searchParams?.volet) ? searchParams?.volet[0] : searchParams?.volet;
  const initialTab = ENGAGER_TABS.some((tab) => tab.key === requested) ? requested! : '';

  const partnersPanel = (
    <div className="engager-partners">
      <p className="lead-text">
        Le DSAE conduit ses formations et ses recherches avec des institutions et des structures
        qui partagent ses objectifs. Retrouvez-les ci-dessous.
      </p>
      {partners.length === 0 ? (
        <p className="catalog-empty">
          Les partenaires seront publiés depuis l’espace d’administration.
        </p>
      ) : (
        <div className="card-grid three-grid">
          {partners.map((partner) => (
            <article key={partner.id} className="info-card partner-card">
              <div className="partner-image">
                <Image src={withFallback(partner.image)} alt={partner.name} width={400} height={260} />
              </div>
              <h4>{partner.name}</h4>
              {partner.role && <p className="role">{partner.role}</p>}
              {partner.bio && <p>{partner.bio}</p>}
              {partner.department && <span className="date-label">{partner.department}</span>}
            </article>
          ))}
        </div>
      )}
    </div>
  );

  const proposalPanel = (
    <div className="engager-proposal">
      <p className="lead-text">
        Vous représentez une institution, une université, une entreprise ou une organisation qui
        souhaite coopérer avec le Domaine des Sciences Agronomiques et de l’Environnement ? Écrivez-nous
        en précisant l’objet de la collaboration : le message est transmis directement à l’équipe.
      </p>
      <ContactForm defaultSubject="Proposition de partenariat" />
    </div>
  );

  const contactPanel = (
    <div className="engager-contact">
      <p className="lead-text">
        Une question, une demande d’information ou une candidature ? Utilisez le formulaire : votre
        message arrive directement à l’équipe du DSAE.
      </p>
      <ContactForm defaultSubject="Demande d’information" />
    </div>
  );

  /* Les libellés viennent de la définition partagée : la page et le pied de page
   * ne peuvent pas se contredire. */
  const labelOf = (key: string) => ENGAGER_TABS.find((tab) => tab.key === key)?.label ?? key;

  const panels = [
    { key: 'partenariat', label: labelOf('partenariat'), content: proposalPanel },
    { key: 'contact', label: labelOf('contact'), content: contactPanel },
    { key: 'partenaires', label: labelOf('partenaires'), content: partnersPanel },
  ];

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">S’engager</span>
          <h1>Travailler avec le DSAE</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <EngagerTabs initialTab={initialTab} panels={panels} />
        </div>
      </section>
    </div>
  );
}
