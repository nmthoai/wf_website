import React, { useState, useContext } from 'react';
import { Send, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { ContentContext } from '../App';

export default function Contact() {
  const { content } = useContext(ContentContext);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

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
    <div className="glass-panel contact-panel" style={{ marginTop: '6rem' }}>
      <p className="contact-prompt" style={{ whiteSpace: 'pre-wrap' }}>
        {content.home.prompt}
      </p>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group"><input type="text" name="name" placeholder="Your Name" className="form-input" value={formData.name} onChange={handleChange} required /></div>
        <div className="form-group"><input type="email" name="email" placeholder="Email Address" className="form-input" value={formData.email} onChange={handleChange} required /></div>
        <div className="form-group"><input type="tel" name="phone" placeholder="Phone Number" className="form-input" value={formData.phone} onChange={handleChange} required /></div>
        <button type="submit" className="btn btn-primary submit-btn" disabled={status === 'loading'}>
          {status === 'loading' ? <Settings size={18} className="animate-spin" /> : <Send size={18} />}
          {status === 'loading' ? 'Sending securely...' : 'Send Details'}
        </button>
      </form>

      {status === 'success' && <div className="status-message success animate-fade-in"><CheckCircle size={18} /> {message}</div>}
      {status === 'error' && <div className="status-message error animate-fade-in"><AlertCircle size={18} /> {message}</div>}
    </div>
  );
}
