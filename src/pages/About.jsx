import React, { useContext } from 'react';
import { Users, TrendingUp, Award, Target } from 'lucide-react';
import { ContentContext } from '../App';

export default function About() {
  const { content } = useContext(ContentContext);

  if (!content) return null;

  return (
    <div className="b2b-container" style={{ marginTop: '5rem', paddingBottom: '4rem' }}>
      {/* REFERENCES SECTION */}
      <div className="text-center mb-10">
        <span className="badge">{content.about.badge}</span>
        <h2 className="section-title">{content.about.title}</h2>
        <p className="section-subtitle">{content.about.subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '6rem' }}>
        {content.about.references.map((ref, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '2.5rem', textAlign: 'left', display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h3 className="b2b-card-title" style={{ fontSize: '1.5rem' }}>{ref.title}</h3>
              <p style={{ color: 'var(--brand-secondary)', fontWeight: 600, marginBottom: '1rem' }}>{ref.subtitle}</p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>Challenge:</strong> {ref.challenge}</p>
              <p style={{ color: 'var(--text-secondary)' }}><strong>Solution:</strong> {ref.solution}</p>
            </div>
            <div style={{ flex: '1 1 250px', background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Impact & Results</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ref.results.map((res, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <TrendingUp size={16} color="var(--brand-primary)" /> {res}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* TEAM SECTION */}
      <div className="text-center mb-10">
        <span className="badge">{content.about.teamBadge}</span>
        <h2 className="section-title">{content.about.teamTitle}</h2>
        <p className="section-subtitle">{content.about.teamSubtitle}</p>
      </div>

      <div className="b2b-grid" style={{ marginBottom: '3rem' }}>
        {content.about.team.map((member, idx) => (
          <div key={idx} className="b2b-card glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1.5rem auto', overflow: 'hidden', border: '3px solid var(--brand-primary)', boxShadow: 'var(--shadow-md)', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {member.image ? (
                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Users size={40} color="white" />
              )}
            </div>
            <h3 className="b2b-card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {member.name}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-primary)', display: 'inline-flex' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              )}
            </h3>
            <p style={{ color: 'var(--brand-secondary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{member.role}</p>
            <p className="b2b-card-desc">{member.bio}</p>
          </div>
        ))}
      </div>

      <div className="b2b-grid">
        {content.about.pillars.map((pillar, idx) => (
          <div key={idx} className="b2b-card" style={{ background: 'var(--bg-tertiary)' }}>
            <h4 className="b2b-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {idx === 0 ? <Target size={20} color="var(--brand-primary)" /> : <Award size={20} color="var(--brand-primary)" />}
              {pillar.title}
            </h4>
            <p className="b2b-card-desc" style={{ marginBottom: 0 }}>{pillar.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
