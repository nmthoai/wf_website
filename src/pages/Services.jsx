import React, { useContext } from 'react';
import { Layers, FileText, Mic, Phone, MessageSquare, Mail, ShieldAlert } from 'lucide-react';
import { ContentContext } from '../App';

export default function Services() {
  const { content } = useContext(ContentContext);

  if (!content) return null;

  const icons = {
    docinsight: <FileText size={24} />,
    voiceagent: <Mic size={24} />,
    callinsight: <Phone size={24} />,
    chatagent: <MessageSquare size={24} />,
    emailinsight: <Mail size={24} />,
    fraudagent: <ShieldAlert size={24} />
  };

  return (
    <div className="b2b-container" style={{ marginTop: '5rem', paddingBottom: '4rem' }}>
      <div className="text-center mb-10">
        <span className="badge">{content.services.agentsBadge}</span>
        <h2 className="section-title">Specialized AI Agents</h2>
        <p className="section-subtitle">Ready-to-deploy agents that integrate seamlessly into your workflows without exposing any data to the public cloud.</p>
      </div>

      <div className="b2b-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {content.services.agents.map(agent => (
          <div key={agent.id} className="b2b-card glass-panel" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', color: 'var(--brand-primary)', flexShrink: 0 }}>
              {icons[agent.id] || <Layers size={24} />}
            </div>
            <div>
              <h3 className="b2b-card-title">{agent.title}</h3>
              <p className="b2b-card-desc" style={{ marginBottom: '1rem' }}>{agent.description}</p>
              <div className="b2b-card-metric">{agent.metric}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
