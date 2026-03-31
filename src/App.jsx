import React, { useState, useEffect } from 'react';
import { Settings, Send, CheckCircle, AlertCircle, Sun, Moon, Monitor, Layers, Bot } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  
  // Theme state: 'system', 'light', 'dark'
  const [theme, setTheme] = useState('system');

  // Handle Theme Application
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Add listener to automatically switch if user changes OS preferences while on 'system'
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => {
        if (e.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);

    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.success || 'Information received. We will contact you soon!');
        setFormData({ name: '', email: '', phone: '' }); // Clear form
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to send information.');
      }
    } catch (err) {
      console.error('Request failed. Is server.js running?', err);
      setStatus('error');
      setMessage('Network error. Make sure your local Express backend is running.');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation Pane (Header) */}
      <header className="top-nav">
        <div className="brand-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={36} color="var(--brand-primary)" />
            <h1 className="brand-title">WorkFactory.AI</h1>
          </div>
          <div className="slogan-glow" style={{ marginTop: '0.2rem', marginLeft: '3rem' }}>
            Every Business Work Gets Done with AI
          </div>
        </div>

        {/* Theme Toggle Selector */}
        <div className="theme-toggle">
          <button 
            className={`theme-btn ${theme === 'system' ? 'active' : ''}`} 
            onClick={() => setTheme('system')}
            title="System Default"
          >
            <Monitor size={16} />
          </button>
          <button 
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`} 
            onClick={() => setTheme('light')}
            title="Light Mode"
          >
            <Sun size={16} />
          </button>
          <button 
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} 
            onClick={() => setTheme('dark')}
            title="Dark Mode"
          >
            <Moon size={16} />
          </button>
        </div>
      </header>

      {/* Target Status Panel */}
      <div className="glass-panel" style={{ marginTop: '6rem', marginBottom: '2rem' }}>
        <h2 className="construction-title" style={{ marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Our website is currently under construction
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--brand-primary)' }}>
          <Bot size={56} className="bot-animate" />
        </div>
      </div>

      {/* Secure Contact Form Panel */}
      <div className="glass-panel contact-panel">
        <p className="contact-prompt">
          Hi, I'm <strong>Thomas Nguyen</strong> - Founder/CEO of Workfactory.ai<br />
          If you are interested in our work, kindly drop your contact, I will reply you shortly.
        </p>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              className="form-input" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              className="form-input" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="tel" 
              name="phone" 
              placeholder="Phone Number" 
              className="form-input" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary submit-btn" 
            disabled={status === 'loading'}
          >
            {status === 'loading' ? <Settings size={18} className="animate-spin" /> : <Send size={18} />}
            {status === 'loading' ? 'Sending securely...' : 'Send Details'}
          </button>
        </form>

        {status === 'success' && (
          <div className="status-message success animate-fade-in">
            <CheckCircle size={18} /> {message}
          </div>
        )}
        {status === 'error' && (
          <div className="status-message error animate-fade-in">
            <AlertCircle size={18} /> {message}
          </div>
        )}
      </div>
      
      <div className="footer-credits">
        Created by WorkFactory.ai - 2026
      </div>
    </div>
  );
}

export default App;
