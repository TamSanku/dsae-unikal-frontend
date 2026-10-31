import Image from 'next/image';
import Link from 'next/link';
import { getTeamMembers } from '@/lib/backend';
import { withFallback } from '@/lib/fallback';
import EmptyState from '@/components/EmptyState';

export default async function TeamPage() {
  const team = await getTeamMembers();

  return (
    <div className="page-shell">
      <section className="page-hero small-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Équipe</span>
          <h1>Responsables et acteurs scientifiques</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {team.length === 0 ? (
            <EmptyState label="L’équipe sera publiée depuis l’espace d’administration." />
          ) : (
            <div className="card-grid three-grid">
              {team.map((member) => (
                <Link key={member.id} href={`/equipe/${member.id}`} className="profile-card large-card">
                  <div className="profile-image-wrap">
                    <Image src={withFallback(member.image)} alt={member.name} width={600} height={700} />
                  </div>
                  <div className="profile-body">
                    {member.category && <span className="mini-tag">{member.category}</span>}
                    <h4>{member.name}</h4>
                    {member.role && <p className="role">{member.role}</p>}
                    {member.department && <p>{member.department}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
