import React from 'react';
import { LOCALES, localeCodes } from './locales';
import { siteConfig } from './siteConfig';

export function Header({ locale, onLocaleChange, t }) {
  const currentSiteConfig = siteConfig[locale] ?? siteConfig.ko;

  return (
    <nav className="nav" aria-label={t.navLabel}>
      <a className="brand" href="#top">
        <span className="brandMark">M</span>
        <span>{currentSiteConfig.brandName}</span>
      </a>
      <div className="navLinks">
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
