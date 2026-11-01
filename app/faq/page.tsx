import { redirect } from 'next/navigation';

/*
 * L'ancienne page « FAQ » rejoint la page « Aide et support ».
 *
 * Les questions fréquentes y forment désormais un volet, à côté des guides et
 * du signalement : une seule page à entretenir. La redirection garde les
 * adresses déjà partagées (`/faq`) sans dupliquer le contenu.
 */
export default function FaqPage() {
  redirect('/aide#faq');
}
