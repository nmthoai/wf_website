import React, { useState, useContext } from 'react';
import { ContentContext } from '../App';

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const { content } = useContext(ContentContext);
  const [translating, setTranslating] = useState(false);

  const handleSaveTranslation = async () => {
    setTranslating(true);
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterContent: content })
      });
      if (res.ok) {
        alert('SUCCESS! Master file saved and AI automatically generated VN, DE, and CN files.');
      } else {
        const data = await res.json();
        alert('AI Build Failed: ' + data.error);
      }
    } catch (err) {
      alert('Network error while hitting AI translation build process.');
    } finally {
      setTranslating(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setAuth(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };
  
  if (!auth) {
    return (
      <div className="glass-panel" style={{ marginTop: '6rem', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Access</h2>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <input type="text" placeholder="Username" className="form-input" style={{ marginBottom: '1rem' }} value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" className="form-input" style={{ marginBottom: '1.5rem' }} value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>Secure Login</button>
      </div>
    );
  }

  const renderTabContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3>KPI Overview</h3>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Welcome to the Admin Blueprint. Metrics from GA4/PostHog will eventually display here.</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', flex: 1, textAlign: 'center' }}>
              <strong>Unique Visitors</strong>
              <div style={{ fontSize: '2rem', color: 'var(--brand-primary)', fontWeight: 'bold' }}>142</div>
            </div>
            <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', flex: 1, textAlign: 'center' }}>
              <strong>Form Submissions</strong>
              <div style={{ fontSize: '2rem', color: 'var(--brand-secondary)', fontWeight: 'bold' }}>3</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'content') {
      return (
        <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Flat-File Content Editor</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            This is a live preview of the Flat-File JSON CMS data driving your site. Editing capabilities will map directly back to <code>data/content.json</code>.
          </p>
          <textarea 
            className="form-input" 
            style={{ width: '100%', height: '300px', fontFamily: 'monospace', fontSize: '0.9rem', resize: 'vertical' }}
            defaultValue={JSON.stringify(content, null, 2)}
          />
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={handleSaveTranslation} disabled={translating}>
              {translating ? 'Initiating Master-Build...' : 'Save & Auto-Translate All Languages'}
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'aeo') {
      return (
        <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Answer Engine Optimization (AEO)</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Configure Structured Schema here so ChatGPT, Google AI, and Perplexity can instantly summarize and recommend Workfactory.ai.
          </p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Site Name / Brand Entity</label>
            <input type="text" className="form-input" defaultValue={content.seo.siteName} />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Global Direct Answer (TL;DR for AI bots)</label>
            <textarea className="form-input" style={{ width: '100%', height: '80px', resize: 'none' }} defaultValue={content.seo.description} />
          </div>

          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Inject Schema Data (Demo)</button>
        </div>
      );
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '4rem', maxWidth: '1000px', width: '90vw' }}>
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : ''}`} 
            style={activeTab !== 'dashboard' ? { background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' } : {}}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          
          <button 
            className={`btn ${activeTab === 'content' ? 'btn-primary' : ''}`} 
            style={activeTab !== 'content' ? { background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' } : {}}
            onClick={() => setActiveTab('content')}
          >
            Content Editor
          </button>
          
          <button 
            className={`btn ${activeTab === 'aeo' ? 'btn-primary' : ''}`} 
            style={activeTab !== 'aeo' ? { background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' } : {}}
            onClick={() => setActiveTab('aeo')}
          >
            AEO Settings
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </div>
  );
}
