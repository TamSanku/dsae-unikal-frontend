import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | DSAE UNIKAL',
  description: 'Informations sur les données communiquées au portail DSAE UNIKAL.',
};

export default function PolitiqueDeConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Cette page explique quelles informations peuvent être communiquées lorsque vous utilisez les fonctionnalités du portail DSAE UNIKAL."
      sections={[
        {
          heading: 'Données communiquées',
          paragraphs: [
            'Si vous utilisez le formulaire de contact, vous pouvez saisir votre nom, votre adresse électronique, l’objet de votre demande et son contenu. Ces informations sont envoyées au service backend du portail afin de traiter le message.',
            'Évitez d’inclure dans votre message des informations sensibles qui ne sont pas nécessaires à votre demande.',
          ],
        },
        {
          heading: 'Finalité et accès',
          paragraphs: [
            'Les informations du formulaire sont destinées à permettre à l’équipe concernée de recevoir et de traiter votre demande. L’accès technique peut également impliquer les prestataires nécessaires à l’hébergement et au fonctionnement du site.',
            'Les modalités précises de conservation des messages, les personnes responsables du traitement et leurs coordonnées doivent être confirmées par l’Université et publiées ici dès qu’elles sont établies.',
          ],
        },
        {
          heading: 'Vos demandes relatives à vos données',
          paragraphs: [
            'Pour demander des renseignements au sujet des informations que vous avez envoyées, ou signaler une demande de rectification ou de suppression, contactez l’équipe au moyen du formulaire du site en indiquant suffisamment de détails pour retrouver votre message. La suite donnée dépendra des obligations applicables et de la capacité à identifier les données concernées.',
          ],
        },
        {
          heading: 'Sécurité et évolutions',
          paragraphs: [
            'Des mesures techniques et organisationnelles adaptées doivent protéger les informations contre l’accès non autorisé, la perte ou l’altération. Cette notice pourra être mise à jour si les fonctionnalités ou les pratiques de traitement changent.',
          ],
        },
      ]}
    />
  );
}
