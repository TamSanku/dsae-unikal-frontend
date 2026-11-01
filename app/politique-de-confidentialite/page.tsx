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
          heading: 'Cookies et mesure d’audience',
          paragraphs: [
            'Lors de votre première visite, un bandeau vous demande si vous acceptez la mesure d’audience. Vous pouvez accepter ou refuser : le portail reste entièrement accessible dans les deux cas, et aucun contenu n’est conditionné à votre réponse.',
            'Si vous acceptez, un identifiant aléatoire est conservé dans votre navigateur et nous enregistrons, pour chaque page consultée : la page, la durée de lecture, la provenance (site ou moteur de recherche d’où vous venez), le pays, la région, la ville, le type d’appareil (ordinateur, téléphone, tablette), le navigateur et le système. Ces faits sont agrégés pour établir les statistiques de fréquentation.',
            'Nous ne conservons pas votre adresse IP : elle est seulement utilisée pour déterminer le pays d’où vous venez, puis elle est oubliée. Aucune donnée n’est vendue ni transmise à des fins publicitaires. Si vous refusez, aucune mesure n’est enregistrée vous concernant.',
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
