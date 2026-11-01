import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getMemberById } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';

/* Le titre de l'onglet porte le nom du membre : c'est ce nom que la mesure
 * d'audience retient comme libellé de la fiche. */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const member = await getMemberById(params.id);
  return { title: member?.name ?? 'Membre de l’équipe' };
}

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const member = await getMemberById(params.id);

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
              {member.department && <li><strong>Département :</strong> {member.department}</li>}
              {member.specialty && <li><strong>Spécialité :</strong> {member.specialty}</li>}
            </ul>
            {member.bio && <p>{member.bio}</p>}
            {member.publications.length > 0 && (
              <div className="profile-publications">
                <h3>Publications associées</h3>
                <ul>
                  {member.publications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <Link href="/equipe" className="btn btn-secondary mt-2">
              Retour à l’équipe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
