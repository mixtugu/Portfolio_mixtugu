import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Calendar,
  Code2,
  GraduationCap,
  Globe2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Server,
  Sparkles,
} from 'lucide-react';
import { Header } from './Header';
import { LOCALES } from './locales';
import { siteConfig } from './siteConfig';
import './styles.css';

const experiences = ['Company Name', 'Frontend Team', 'Open Source Contributor'];

function App() {
  const [locale, setLocale] = useState('ko');
  const [copiedContact, setCopiedContact] = useState('');
  const t = LOCALES[locale];
  const currentSiteConfig = siteConfig[locale] ?? siteConfig.ko;

  const copyContactValue = async (key, value) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopiedContact(key);
    window.setTimeout(() => setCopiedContact(''), 1400);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <main className="page">
      <Header locale={locale} onLocaleChange={setLocale} t={t} />

      <section id="top" className="hero">
        <div className="profilePanel" aria-label={t.profileLabel}>
          <div className="avatar">
            <Code2 size={54} />
          </div>
          <div>
            <p className="profileName">{currentSiteConfig.brandName}</p>
            <p className="profileRole">{t.profile.role}</p>
          </div>
          <div className="profileMeta">
            <span>
              <MapPin size={16} />
              {t.profile.location}
            </span>
            <span>
              <GraduationCap size={16} />
              {currentSiteConfig.schoolName}
            </span>
            <span>
              <Calendar size={16} />
              {siteConfig.birthDate}
            </span>
            <span>
              <Globe2 size={16} />
              {t.profile.nationalityLabel}: {t.profile.nationalityValue}
            </span>
          </div>
        </div>

        <div className="heroCopy">
          <p className="eyebrow">
            <Sparkles size={16} />
            {t.hero.eyebrow}
          </p>
          <h1>{t.hero.title}</h1>
          <p className="intro">{t.hero.intro}</p>
          <div className="heroActions">
            <a className="primaryButton" href="#projects">
              {t.hero.projectsCta}
              <ArrowUpRight size={18} />
            </a>
            <a className="secondaryButton" href="mailto:hello@example.com">
              <Mail size={18} />
              {t.hero.contactCta}
            </a>
          </div>
        </div>
      </section>

      <section className="stats" aria-label={t.statsLabel}>
        {t.stats.map((stat) => (
          <article key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section id="experience" className="section splitSection">
        <div className="sectionHeader">
          <p className="eyebrow">
            <Code2 size={16} />
            {t.sections.experienceEyebrow}
          </p>
          <h2>{t.sections.experience}</h2>
        </div>
        <div className="skillList">
          {experiences.map((experience) => (
            <span key={experience}>{experience}</span>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <div className="sectionHeader">
          <p className="eyebrow">
            <Server size={16} />
            {t.sections.selectedWork}
          </p>
          <h2>{t.sections.projects}</h2>
        </div>
        <div className="projectGrid">
          {t.projects.map((project) => (
            <article className="projectCard" key={project.title}>
              <div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <div className="tags">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact">
        <div>
          <p className="eyebrow">{t.sections.contact}</p>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.body}</p>
        </div>
        <div className="contactSide">
          <div className="contactDetails">
            <button
              aria-label="Copy Japan phone number"
              onClick={() => copyContactValue('japanPhone', siteConfig.contact.japanPhone)}
              type="button"
            >
              <Phone size={18} />
              <span>Japan: {siteConfig.contact.japanPhone}</span>
              {copiedContact === 'japanPhone' && <small>Copied</small>}
            </button>
            <button
              aria-label="Copy Korea phone number"
              onClick={() => copyContactValue('koreaPhone', siteConfig.contact.koreaPhone)}
              type="button"
            >
              <Phone size={18} />
              <span>Korea: {siteConfig.contact.koreaPhone}</span>
              {copiedContact === 'koreaPhone' && <small>Copied</small>}
            </button>
            <button
              aria-label="Copy email address"
              onClick={() => copyContactValue('email', siteConfig.contact.email)}
              type="button"
            >
              <Mail size={18} />
              <span>Email: {siteConfig.contact.email}</span>
              {copiedContact === 'email' && <small>Copied</small>}
            </button>
          </div>
          <div className="socials">
            <a href={`mailto:${siteConfig.contact.email}`} aria-label={t.contact.email}>
              <Mail size={20} />
            </a>
            <a href="https://github.com/" aria-label={t.contact.github}>
              <Github size={20} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
