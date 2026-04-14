import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Sun, Moon, Monitor, Layers, Lock } from 'lucide-react';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export const ContentContext = React.createContext(null);

function App() {
  const [content, setContent] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('wf_theme') || 'system');
  const [lang, setLang] = useState(localStorage.getItem('wf_lang') || 'en');
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('wf_lang', lang);
    fetch(`/api/content?lang=${lang}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error("Backend CMS Error:", data.error);
          return; // Do not overwrite content state on backend failure
        }
        setContent(data);
      })
      .catch(err => console.error("Could not load content CMS", err));
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('wf_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  if (!content) return null; // Wait for CMS

  return (
    <HelmetProvider>
      <ContentContext.Provider value={{ content, setContent, lang, setLang }}>
        <Router>
          <div className="fixed-bg"></div>
          
          <div className="app-content-wrapper">
            <div className="app-container">
              <Helmet>
                <title>{content.seo.siteName}</title>
                <meta name="description" content={content.seo.description} />
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": content.seo.siteName,
                    "description": content.seo.description
                  })}
                </script>
              </Helmet>
              
              <header className="top-nav">
                <div className="brand-section">
                  <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Layers size={36} color="var(--brand-primary)" />
                    <h1 className="brand-title">{content.seo.siteName}</h1>
                  </Link>
                  <div className="slogan-glow" style={{ marginLeft: '1rem', marginTop: '0.2rem' }}>
                    {content.home.heroSubtitle}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <nav className="main-nav">
                    <Link to="/">{content.nav.home}</Link>
                    <Link to="/services">{content.nav.services}</Link>
                    <Link to="/about">{content.nav.about}</Link>
                    <Link to="/contact">{content.nav.contact}</Link>
                  </nav>
                </div>

                <div className="theme-toggle" style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <button className="theme-btn" style={{ fontSize: '0.95rem', fontWeight: 600, paddingRight: '0.2rem', textTransform: 'lowercase', letterSpacing: '0.5px' }} onClick={() => setLangOpen(!langOpen)}>
                      {lang === 'en' ? '.en' : lang === 'vn' ? '.vn' : lang === 'de' ? '.de' : '.cn'}
                    </button>
                    {langOpen && (
                      <div 
                        className="glass-dropdown"
                        onMouseLeave={() => setLangOpen(false)}
                        style={{ 
                          position: 'absolute', top: '-0.25rem', left: '50%', transform: 'translateX(-50%)', 
                          padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 1000
                        }}
                      >
                        <button className={`theme-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => { setLang('en'); setLangOpen(false); }} title="English" style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'lowercase' }}>.en</button>
                        <button className={`theme-btn ${lang === 'vn' ? 'active' : ''}`} onClick={() => { setLang('vn'); setLangOpen(false); }} title="Vietnamese" style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'lowercase' }}>.vn</button>
                        <button className={`theme-btn ${lang === 'de' ? 'active' : ''}`} onClick={() => { setLang('de'); setLangOpen(false); }} title="German" style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'lowercase' }}>.de</button>
                        <button className={`theme-btn ${lang === 'cn' ? 'active' : ''}`} onClick={() => { setLang('cn'); setLangOpen(false); }} title="Chinese" style={{ fontSize: '0.95rem', fontWeight: 600, textTransform: 'lowercase' }}>.cn</button>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 0.25rem' }}></div>
                  
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <button className="theme-btn" onClick={() => setThemeOpen(!themeOpen)}>
                      {theme === 'system' ? <Monitor size={16} /> : theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    {themeOpen && (
                      <div 
                        className="glass-dropdown"
                        onMouseLeave={() => setThemeOpen(false)}
                        style={{ 
                          position: 'absolute', top: '-0.25rem', left: '50%', transform: 'translateX(-50%)', 
                          padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 1000
                        }}
                      >
                        <button className={`theme-btn ${theme === 'system' ? 'active' : ''}`} onClick={() => { setTheme('system'); setThemeOpen(false); }} title="System"><Monitor size={16} /></button>
                        <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => { setTheme('light'); setThemeOpen(false); }} title="Light"><Sun size={16} /></button>
                        <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => { setTheme('dark'); setThemeOpen(false); }} title="Dark"><Moon size={16} /></button>
                      </div>
                    )}
                  </div>

                  <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 0.25rem' }}></div>
                  <Link to="/admin" className="theme-btn admin-lock"><Lock size={16} /></Link>
                </div>
              </header>

              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services/*" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
              
              <div className="footer-credits">
                Created by {content.seo.siteName} - 2026
              </div>
            </div>
          </div>
        </Router>
      </ContentContext.Provider>
    </HelmetProvider>
  );
}

export default App;
