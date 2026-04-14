import React, { useContext } from 'react';
import { ContentContext } from '../App';

export default function About() {
  const { content } = useContext(ContentContext);

  return (
    <div className="glass-panel" style={{ marginTop: '6rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{content.about.title}</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--brand-primary)', marginBottom: '2rem', fontWeight: 500 }}>
        "{content.about.vision}"
      </p>
      
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Our Team</h3>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {content.about.team.map((member, idx) => (
          <div key={idx} style={{ padding: '1rem 2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', background: 'var(--bg-tertiary)' }}>
            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{member.name}</strong>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
