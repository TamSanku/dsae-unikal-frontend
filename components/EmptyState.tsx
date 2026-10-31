import Link from 'next/link';

/*
 * Ce qui s'affiche quand une rubrique n'a encore rien.
 *
 * La faculté publie son contenu depuis l'espace d'administration ; tant qu'elle
 * ne l'a pas fait, la page le dit franchement plutôt que de montrer un exemple.
 */
export default function EmptyState({ label }: { label: string }) {
  return (
    <div className="empty-state">
      <p>{label}</p>
      <Link href="/contact" className="btn btn-secondary">
        Nous contacter
      </Link>
    </div>
  );
}
