import React, { useContext } from 'react';
import { ContentContext } from '../App';

export default function Services() {
  const { content } = useContext(ContentContext);

  return (
    <div className="glass-panel" style={{ marginTop: '6rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{content.services.title}</h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {content.services.items.map(item => (
          <div key={item.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--brand-primary)' }}>{item.name}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
