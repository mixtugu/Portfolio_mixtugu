import React from 'react';
import { LOCALES, localeCodes } from './data/locales';
import { siteConfig } from './data/siteConfig';

export function Header({ locale, onLocaleChange, t }) {
  const currentSiteConfig = siteConfig[locale] ?? siteConfig.ko;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="nav" aria-label={t.navLabel}>
      <a className="brand" href="#top">
        <img className="brandMark" src="/images/profile_icon.jpeg" alt="" />
        <span>{currentSiteConfig.brandName}</span>
      </a>
      <div className="navLinks">
        <button onClick={scrollToTop} type="button">
          {t.nav.top}
        </button>
        <a href="#experience">{t.nav.experience}</a>
        <a href="#projects">{t.nav.projects}</a>
        <a href="#contact">{t.nav.contact}</a>
      </div>
      <div className="localeSwitcher" aria-label="Language selector">
        {localeCodes.map((code) => (
          <button
            aria-pressed={locale === code}
            className={locale === code ? 'active' : ''}
            key={code}
            onClick={() => onLocaleChange(code)}
            type="button"
          >
            {LOCALES[code].label}
          </button>
        ))}
      </div>
    </nav>
  );
}
