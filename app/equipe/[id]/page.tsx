import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { teamMembers } from '@/lib/data';

export function generateStaticParams() {
  return teamMembers.map((member) => ({ id: member.id }));
}

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const member = teamMembers.find((item) => item.id === params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="page-shell">
      <section className="section">
        <div className="container detail-profile">
          <div className="detail-image profile-detail-image">
            <Image src={member.image} alt={member.name} width={900} height={1000} />
          </div>
          <div className="detail-copy">
            <span className="mini-tag">{member.category}</span>
            <h1>{member.name}</h1>
            <p className="role-page">{member.role}</p>
            <ul className="profile-meta">
              <li><strong>Département :</strong> {member.department}</li>
              <li><strong>Spécialité :</strong> {member.specialty}</li>
            </ul>
            <p>{member.bio}</p>
            <div className="profile-publications">
              <h3>Publications associées</h3>
              <ul>
                {member.publications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <Link href="/equipe" className="btn btn-secondary mt-2">
              Retour à l’équipe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
