import Image from 'next/image';
import Link from 'next/link';
import { teamMembers } from '@/lib/data';

export default function TeamPage() {
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
          <div className="card-grid three-grid">
            {teamMembers.map((member) => (
              <Link key={member.id} href={`/equipe/${member.id}`} className="profile-card large-card">
                <div className="profile-image-wrap">
                  <Image src={member.image} alt={member.name} width={600} height={700} />
                </div>
                <div className="profile-body">
                  <span className="mini-tag">{member.category}</span>
                  <h4>{member.name}</h4>
                  <p className="role">{member.role}</p>
                  <p>{member.department}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
