import React, { useContext } from 'react';
import { Bot } from 'lucide-react';
import { ContentContext } from '../App';

export default function Home() {
  const { content } = useContext(ContentContext);

  return (
    <div style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
      <div className="glass-panel text-center">
        <h2 className="construction-title" style={{ marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {content.home.constructionTitle}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--brand-primary)' }}>
          <Bot size={56} className="bot-animate" />
        </div>
      </div>
      
      <div className="glass-panel">
        <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>Why Us?</h3>
        <p style={{color: 'var(--text-secondary)'}}>
          We provide high-impact AI automation directly for your business needs. Watch this space for our upcoming partnership badges and certifications.
        </p>
      </div>
    </div>
  );
}
