import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Mentions légales | DSAE UNIKAL',
  description: 'Informations légales relatives au portail du DSAE de l’Université de Kalemie.',
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Informations relatives à l’éditeur, à la publication et à l’utilisation des contenus du portail DSAE UNIKAL."
      sections={[
        {
          heading: 'Éditeur du site',
          paragraphs: [
            'Ce portail présente les activités du Domaine des Sciences Agronomiques et de l’Environnement (DSAE) de l’Université de Kalemie (UNIKAL).',
            'Pour joindre l’équipe éditoriale, adressez votre demande au moyen du formulaire de contact du site. Les coordonnées administratives détaillées et le nom du responsable de publication doivent être confirmés par l’Université avant d’être ajoutés à cette notice.',
          ],
        },
        {
          heading: 'Hébergement et publication',
          paragraphs: [
            'Le site public est déployé sur Vercel. Les services applicatifs du portail sont fournis par le backend DSAE hébergé sur Render. Les informations de localisation des centres de données peuvent dépendre des services utilisés et ne sont pas précisées ici.',
          ],
        },
        {
          heading: 'Contenus et propriété intellectuelle',
          paragraphs: [
            'Les textes, documents, marques, photographies et autres contenus affichés restent soumis aux droits de leurs auteurs ou titulaires respectifs. Sauf indication contraire, leur présence sur ce portail n’accorde pas d’autorisation de reproduction ou de réutilisation.',
            'Avant toute réutilisation, demandez l’autorisation au titulaire des droits et citez la source lorsque cela est permis. Les publications scientifiques peuvent être assorties de conditions propres à leurs auteurs ou éditeurs.',
          ],
        },
        {
          heading: 'Exactitude des informations',
          paragraphs: [
            'Le DSAE s’efforce de présenter des informations utiles et à jour sur ses activités, ses ressources et ses publications. Des erreurs, omissions ou interruptions peuvent toutefois survenir. Signalez une correction souhaitée via le formulaire de contact.',
          ],
        },
      ]}
    />
  );
}
