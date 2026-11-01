import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAlumniById } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';

/* Le titre de l'onglet porte le nom de l'alumni : c'est ce nom que la mesure
 * d'audience retient comme libellé de la fiche. */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const member = await getAlumniById(params.id);
  return { title: member?.name ?? 'Alumni' };
}

/*
 * La fiche d'un alumni : son portrait, son parcours, son domaine et son niveau.
 * Rien n'est inventé : un champ vide n'apparaît pas.
 */
export default async function AlumniDetailPage({ params }: { params: { id: string } }) {
  const member = await getAlumniById(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container detail-profile">
          <div className="detail-image profile-detail-image">
            <Image src={withFallback(member.image)} alt={member.name} width={900} height={1000} />
          </div>
          <div className="detail-copy">
            {member.category && <span className="mini-tag">{member.category}</span>}
            <h1>{member.name}</h1>
            {member.role && <p className="role-page">{member.role}</p>}
            <ul className="profile-meta">
              {member.domain && <li><strong>Domaine :</strong> {member.domain}</li>}
              {member.level && <li><strong>Niveau :</strong> {member.level}</li>}
              {member.department && <li><strong>Lieu :</strong> {member.department}</li>}
            </ul>
            {member.bio && <p>{member.bio}</p>}
            <Link href="/alumni" className="btn btn-secondary mt-2">
              Retour aux Alumni
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
