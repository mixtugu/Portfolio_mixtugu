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
  Trophy,
} from 'lucide-react';
import { experienceItems } from './data/experienceItems';
import { LOCALES } from './data/locales';
import { projectItems } from './data/projectItems';
import { siteConfig } from './data/siteConfig';
import { techStacks } from './data/techStacks';
import { Header } from './Header';
import './styles.css';

function TechTag({ stackId }) {
  const stack = techStacks[stackId] ?? {
    name: stackId,
    color: '#39c5bb',
  };
  const Icon = stack.Icon;

  return (
    <span style={{ '--tag-color': stack.color }} title={stack.name}>
      {Icon && <Icon aria-hidden="true" size={14} />}
      {stack.name}
    </span>
  );
}

function App() {
  const [locale, setLocale] = useState('ko');
  const [copiedContact, setCopiedContact] = useState('');
  const [activeExperiencePhotoIndex, setActiveExperiencePhotoIndex] = useState(0);
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeProjectPhotoIndexes, setActiveProjectPhotoIndexes] = useState({});
  const t = LOCALES[locale];
  const currentSiteConfig = siteConfig[locale] ?? siteConfig.ko;
  const experienceGalleryItems = experienceItems.flatMap((experience) => {
    const photos = experience.photos?.length ? experience.photos : [experience.photo];

    return photos.map((photo, photoIndex) => ({
      key: `${experience.title}-${photoIndex}`,
      src: photo,
      title: experience.title,
    }));
  });
  const activeExperiencePhoto = experienceGalleryItems[activeExperiencePhotoIndex];

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
  const selectProjectPhoto = (projectKey, photoIndex) => {
    setActiveProjectPhotoIndexes((currentIndexes) => ({
      ...currentIndexes,
      [projectKey]: photoIndex,
    }));
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (experienceGalleryItems.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveExperiencePhotoIndex((currentIndex) => (
        currentIndex + 1
      ) % experienceGalleryItems.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [experienceGalleryItems.length]);

  return (
    <main className="page">
      <Header locale={locale} onLocaleChange={setLocale} t={t} />

      <section id="top" className="hero">
        <div className="profilePanel" aria-label={t.profileLabel}>
          <div className="avatar">
            <img src="/images/face.jpg" alt="" />
          </div>
          <div className="profileDetails">
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
            <a className="secondaryButton" href={`mailto:${siteConfig.contact.email}`}>
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
          {activeExperiencePhoto && (
              <div className="experienceGallery" aria-label="Experience photos">
                <div className="experienceGalleryPreview">
                  <img key={activeExperiencePhoto.key} src={activeExperiencePhoto.src} alt="" />
                </div>
              <div className="experienceGalleryGrid">
                {experienceGalleryItems.map((item, index) => (
                  <button
                    aria-label={`Show ${item.title}`}
                    aria-pressed={activeExperiencePhotoIndex === index}
                    className={activeExperiencePhotoIndex === index ? 'active' : ''}
                    key={item.key}
                    onClick={() => setActiveExperiencePhotoIndex(index)}
                    type="button"
                  >
                    <img src={item.src} alt="" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <div className={`experienceList ${showAllExperiences ? 'expanded' : 'collapsed'}`}>
            {experienceItems.map((experience) => (
              <article className="experienceCard" key={`${experience.title}-${experience.date}`}>
                <img src={experience.photo} alt="" />
                <div className="experienceCardBody">
                  <div className="experienceCardHeader">
                    <div>
                      <div className="experienceMetaLine">
                        <time dateTime={experience.date}>{experience.date}</time>
                        {experience.isAwarded && (
                          <span className="awardBadge">
                            <Trophy aria-hidden="true" size={14} />
                            {experience.awardLabel}
                          </span>
                        )}
                      </div>
                      <h3>{experience.title}</h3>
                    </div>
                    {experience.projectLink ? (
                      <a
                        className="relatedProjectButton"
                        href={experience.projectLink}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <ArrowUpRight size={16} />
                      </a>
                    ) : (
                      <button className="relatedProjectButton" disabled type="button">
                        <ArrowUpRight size={16} />
                      </button>
                    )}
                  </div>
                  <p>{experience.description}</p>
                  <div className="tags">
                    {experience.stack.map((item) => (
                      <TechTag key={item} stackId={item} />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {experienceItems.length > 3 && (
            <button
              className={`experienceToggleButton ${showAllExperiences ? 'sticky' : ''}`}
              onClick={() => setShowAllExperiences((currentValue) => !currentValue)}
              type="button"
            >
              {showAllExperiences ? t.sections.collapseExperiences : t.sections.moreExperiences}
            </button>
          )}
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
        <div className={`projectGrid ${showAllProjects ? 'expanded' : 'collapsed'}`}>
          {projectItems.map((project) => (
            <article className="projectCard" key={`${project.title}-${project.date}`}>
              {(() => {
                const projectKey = `${project.title}-${project.date}`;
                const photos = project.photos?.length ? project.photos : [project.photo];
                const activePhotoIndex = activeProjectPhotoIndexes[projectKey] ?? 0;
                const activePhoto = photos[activePhotoIndex] ?? project.photo;

                return (
                  <div className="projectPhoto">
                    <img src={activePhoto} alt="" />
                    {photos.length > 1 && (
                      <div className="projectPhotoGrid">
                        {photos.map((photo, index) => (
                          <button
                            aria-label={`Show ${project.title} image ${index + 1}`}
                            aria-pressed={activePhotoIndex === index}
                            className={activePhotoIndex === index ? 'active' : ''}
                            key={photo}
                            onClick={() => selectProjectPhoto(projectKey, index)}
                            type="button"
                          >
                            <img src={photo} alt="" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
              <div className="projectCardBody">
                <div className="projectCardHeader">
                  <div>
                    <time dateTime={project.date}>{project.date}</time>
                    <h3>{project.title}</h3>
                  </div>
                  {project.link ? (
                    <a className="projectLinkButton" href={project.link} rel="noreferrer" target="_blank">
                      <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <button className="projectLinkButton" disabled type="button">
                      <ArrowUpRight size={16} />
                    </button>
                  )}
                </div>
                <p>{project.description}</p>
                <div className="tags">
                  {project.stack.map((item) => (
                    <TechTag key={item} stackId={item} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        {projectItems.length > 1 && (
          <button
            className={`projectToggleButton ${showAllProjects ? 'sticky' : ''}`}
            onClick={() => setShowAllProjects((currentValue) => !currentValue)}
            type="button"
          >
            {showAllProjects ? t.sections.collapseExperiences : t.sections.moreExperiences}
          </button>
        )}
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
              <small aria-hidden={copiedContact !== 'japanPhone'}>Copied</small>
            </button>
            <button
              aria-label="Copy email address"
              onClick={() => copyContactValue('email', siteConfig.contact.email)}
              type="button"
            >
              <Mail size={18} />
              <span>Email: {siteConfig.contact.email}</span>
              <small aria-hidden={copiedContact !== 'email'}>Copied</small>
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
