"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('site_language') as Language;
    if (saved && (saved === 'en' || saved === 'ta' || saved === 'tanglish')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('site_language', lang);
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '50px', backdropFilter: 'blur(5px)' }}>
      <button
        onClick={() => setLanguage('en')}
        style={{
          background: language === 'en' ? '#fff' : 'transparent',
          color: language === 'en' ? '#0f172a' : '#fff',
          border: 'none', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: '0.2s'
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ta')}
        style={{
          background: language === 'ta' ? '#fff' : 'transparent',
          color: language === 'ta' ? '#0f172a' : '#fff',
          border: 'none', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: '0.2s'
        }}
      >
        தமிழ்
      </button>
      <button
        onClick={() => setLanguage('tanglish')}
        style={{
          background: language === 'tanglish' ? '#fff' : 'transparent',
          color: language === 'tanglish' ? '#0f172a' : '#fff',
          border: 'none', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', transition: '0.2s'
        }}
      >
        Tanglish
      </button>
    </div>
  );
};
