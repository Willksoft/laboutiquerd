import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent } from '../hooks/useSiteContent';

interface LegalPageProps {
  type: 'terms' | 'privacy';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { t, i18n } = useTranslation();
  const { content, loading } = useSiteContent();
  const [text, setText] = useState('');

  // Determine the key based on current language
  useEffect(() => {
    let lang = i18n.language || 'es';
    if (!['es', 'en', 'fr'].includes(lang)) lang = 'es';
    
    const key = `${type}_${lang}`;
    
    // In our simplified setup, legal keys might not be in DEFAULT_CONTENT, 
    // but they will definitely be in the fetched `content` object if they exist in DB.
    if (content[key]) {
      setText(content[key]);
    } else {
      // Fallback to Spanish or generic
      setText(content[`${type}_es`] || `No ${type} content available.`);
    }
  }, [type, i18n.language, content]);

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-accent/70 font-display">
          {type === 'terms' ? t('Términos y Condiciones') : t('Política de Privacidad')}
        </h1>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
        ) : (
          <div className="prose prose-invert prose-brand max-w-none text-white/70">
            {text.split('\\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalPage;
