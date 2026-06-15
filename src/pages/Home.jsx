import React, { useContext } from 'react';
import { Bot, ArrowRight, Zap, Database } from 'lucide-react';
import { ContentContext } from '../App';
import { Link } from 'react-router-dom';

export default function Home() {
  const { content } = useContext(ContentContext);

  if (!content) return null;

  return (
    <div className="b2b-container" style={{ marginTop: '5rem', paddingBottom: '4rem' }}>
      {/* HERO SECTION */}
      <div className="glass-panel text-center" style={{ padding: '4rem 2rem', border: 'none', background: 'transparent', boxShadow: 'none', maxWidth: '900px', margin: '0 auto' }}>
        <span className="badge">{content.home.badge}</span>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <span className="text-gradient">{content.home.heroTitle}</span>
        </h2>
        <p className="section-subtitle" style={{ fontSize: '1.25rem' }}>
          {content.home.heroSubtitle}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/contact" className="btn btn-primary" style={{ padding: '0 2rem' }}>
            {content.home.ctaPrimary} <ArrowRight size={18} />
          </Link>
          <Link to="/services" className="btn" style={{ padding: '0 2rem', border: '1px solid var(--border-color)', background: 'var(--glass-bg)' }}>
            {content.home.ctaSecondary}
          </Link>
        </div>

        <div className="hero-stats-bar">
          {content.home.stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PLATFORM SUITE SECTION */}
      <div style={{ marginTop: '4rem' }}>
        <div className="text-center mb-10">
          <span className="badge">{content.services.platformBadge}</span>
          <h3 className="section-title" style={{ fontSize: '2rem' }}>{content.services.title}</h3>
          <p className="section-subtitle">{content.services.subtitle}</p>
        </div>
        
        <div className="b2b-grid">
          {content.services.platform.map((p, idx) => (
            <div key={p.id} className="b2b-card glass-panel" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--brand-primary)' }}>
                {idx === 0 ? <Bot size={32} /> : idx === 1 ? <Zap size={32} /> : <Database size={32} />}
              </div>
              <h4 className="b2b-card-title">{p.title}</h4>
              <p className="b2b-card-desc">{p.description}</p>
              <div className="b2b-card-metric">{p.metric}</div>
            </div>
          ))}
        </div>
      </div>

      {/* VISION / SECTORS SECTION */}
      <div style={{ marginTop: '6rem' }}>
        <div className="text-center mb-10">
          <span className="badge">{content.vision.badge}</span>
          <h3 className="section-title" style={{ fontSize: '2rem' }}>{content.vision.title}</h3>
          <p className="section-subtitle">{content.vision.painSubtitle}</p>
        </div>

        <div className="b2b-grid">
          {content.vision.sectors.map(sector => (
            <div key={sector.id} className="b2b-card" style={{ background: 'var(--glass-bg)' }}>
              <h4 className="b2b-card-title" style={{ color: 'var(--text-primary)' }}>{sector.title}</h4>
              <p className="b2b-card-desc">{sector.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
