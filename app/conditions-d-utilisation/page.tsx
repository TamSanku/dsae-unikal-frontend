import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Conditions d’utilisation | DSAE UNIKAL',
  description: 'Conditions d’utilisation du portail DSAE UNIKAL.',
};

export default function ConditionsDUtilisationPage() {
  return (
    <LegalPage
      title="Conditions d’utilisation"
      intro="En consultant ce portail, vous acceptez les règles de bon usage présentées ci-dessous. Elles s’appliquent aux pages, ressources et fonctionnalités publiques du site."
      sections={[
        {
          heading: 'Objet du portail',
          paragraphs: [
            'Le portail diffuse des informations institutionnelles et scientifiques relatives au Domaine des Sciences Agronomiques et de l’Environnement de l’Université de Kalemie, notamment des contenus de recherche, des publications, des actualités et des informations de contact.',
          ],
        },
        {
          heading: 'Usage respectueux',
          paragraphs: [
            'Vous vous engagez à utiliser le site conformément aux lois applicables, à respecter les droits des auteurs et à ne pas tenter de perturber, compromettre ou contourner ses dispositifs techniques.',
            'Le formulaire de contact doit être utilisé pour des demandes pertinentes. N’y transmettez pas de contenu illicite, trompeur, malveillant ou de données sensibles inutiles.',
          ],
        },
        {
          heading: 'Documents et liens externes',
          paragraphs: [
            'Les notices de publications et les documents peuvent être soumis aux droits et conditions définis par leurs auteurs ou éditeurs. Vérifiez ces conditions avant de télécharger, reproduire ou redistribuer un document.',
            'Les liens vers des sites tiers sont fournis à titre pratique. Le DSAE ne contrôle pas nécessairement leur disponibilité, leur contenu ou leurs pratiques de confidentialité.',
          ],
        },
        {
          heading: 'Disponibilité et mises à jour',
          paragraphs: [
            'Le site peut être modifié, suspendu ou rendu temporairement indisponible pour maintenance ou pour des raisons techniques. Les informations peuvent évoluer ; une erreur peut être signalée au moyen du formulaire de contact.',
            'Ces conditions sont susceptibles d’être révisées lorsque les fonctionnalités ou les règles applicables changent. La version affichée sur cette page est la version en vigueur sur le portail.',
          ],
        },
      ]}
    />
  );
}
