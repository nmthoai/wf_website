import React, { useState, useContext } from 'react';
import { Send, Settings, CheckCircle, AlertCircle, Calendar, Shield } from 'lucide-react';
import { ContentContext } from '../App';

export default function Contact() {
  const { content } = useContext(ContentContext);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  if (!content) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
        setMessage(data.success);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Make sure your local Express backend is running.');
    }
  };

  return (
    <div className="b2b-container" style={{ marginTop: '5rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '3rem', textAlign: 'left' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Calendar size={48} color="var(--brand-primary)" />
          </div>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>{content.contact.title}</h2>
          <p className="section-subtitle" style={{ fontSize: '1rem', marginBottom: 0 }}>
            {content.contact.prompt}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Work Email</label>
            <input type="email" name="email" placeholder="john@company.com" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Phone Number</label>
            <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className="form-input" value={formData.phone} onChange={handleChange} required />
          </div>
          
          <button type="submit" className="btn btn-primary submit-btn" disabled={status === 'loading'} style={{ width: '100%', marginTop: '1rem' }}>
            {status === 'loading' ? <Settings size={18} className="animate-spin" /> : <Send size={18} />}
            {status === 'loading' ? 'Scheduling securely...' : 'Book your Demo'}
          </button>

          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem', textAlign: 'center' }}>
            <Shield size={14} /> Your data is protected by our secure on-premise policy.
          </p>
        </form>

        {status === 'success' && <div className="status-message success animate-fade-in"><CheckCircle size={18} /> {message}</div>}
        {status === 'error' && <div className="status-message error animate-fade-in"><AlertCircle size={18} /> {message}</div>}
      </div>
    </div>
  );
}
