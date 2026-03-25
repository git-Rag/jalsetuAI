import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function formatClock(date) {
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function Navbar() {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('jalsetu-lang') || 'en');

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('jalsetu-lang', lang);
    window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-solid' : 'navbar-transparent'}`}>
      <div className='navbar-inner'>
        <div className='navbar-left' style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className='brand'>
            <span className='emblem'>🇮🇳</span>
            <div>
              <h1>जलसेतु एआई · JalSetu AI</h1>
              <p>Smart Water Distribution Network — मध्यप्रदेश</p>
            </div>
          </div>
        </div>

        <div className='navbar-right'>
          <div className='lang-toggle'>
            <button className={`lang-btn ${language === 'en' ? 'active' : ''}`} onClick={() => handleLanguage('en')}>EN</button>
            <button className={`lang-btn ${language === 'hi' ? 'active' : ''}`} onClick={() => handleLanguage('hi')}>हिंदी</button>
          </div>
          <div>Madhya Pradesh Water Authority</div>
          <div>{formatClock(now)}</div>
        </div>
      </div>
      <div className='tricolor-strip'>
        <span className='stripe saffron'></span>
        <span className='stripe white'></span>
        <span className='stripe green'></span>
      </div>
    </header>
  );
}
