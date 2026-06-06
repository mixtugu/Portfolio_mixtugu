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
  X,
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
  const [activeExperiencePhotoIndexes, setActiveExperiencePhotoIndexes] = useState({});
  const [selectedProjectKey, setSelectedProjectKey] = useState('');
  const [selectedExperienceKey, setSelectedExperienceKey] = useState('');
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const t = LOCALES[locale];
  const currentSiteConfig = siteConfig[locale] ?? siteConfig.ko;
  const experienceGalleryItems = experienceItems.flatMap((experience) => {
    const photos = experience.photos?.length ? experience.photos : [experience.photo];

    return photos.map((photo, photoIndex) => ({
      key: `${experience.title.ko}-${photoIndex}`,
      src: photo,
      title: experience.title[locale],
    }));
  });
  const activeExperiencePhoto = experienceGalleryItems[activeExperiencePhotoIndex];
  const selectedProject = projectItems.find((project) => (
    `${project.title.ko}-${project.date}` === selectedProjectKey
  ));
  const selectedProjectPhotos = selectedProject
    ? (selectedProject.photos?.length ? selectedProject.photos : [selectedProject.photo])
    : [];
  const selectedProjectPhotoIndex = activeProjectPhotoIndexes[selectedProjectKey] ?? 0;
  const selectedProjectPhoto = selectedProjectPhotos[selectedProjectPhotoIndex] ?? selectedProject?.photo;
  const selectedExperience = experienceItems.find((experience) => (
    `${experience.title.ko}-${experience.date}` === selectedExperienceKey
  ));
  const selectedExperiencePhotos = selectedExperience
    ? (selectedExperience.photos?.length ? selectedExperience.photos : [selectedExperience.photo])
    : [];
  const selectedExperiencePhotoIndex = activeExperiencePhotoIndexes[selectedExperienceKey] ?? 0;
  const selectedExperiencePhoto = selectedExperiencePhotos[selectedExperiencePhotoIndex]
    ?? selectedExperience?.photo;

  const heroBgImages = [
    ...experienceItems.flatMap((e) => e.photos?.length ? e.photos : [e.photo]),
    ...projectItems.flatMap((p) => p.photos?.length ? p.photos : [p.photo]),
  ].filter((src, i, arr) => arr.indexOf(src) === i);
  const stats = [
    { value: `${projectItems.length}+`, label: t.stats.projects },
    { value: `${experienceItems.length}+`, label: t.stats.experiences },
    { value: 'XR · Web · Data', label: t.stats.coreExpertise },
  ];

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
  const selectExperiencePhoto = (experienceKey, photoIndex) => {
    setActiveExperiencePhotoIndexes((currentIndexes) => ({
      ...currentIndexes,
      [experienceKey]: photoIndex,
    }));
  };
  const openProjectModal = (projectKey) => {
    setSelectedProjectKey(projectKey);
  };

  const closeProjectModal = () => {
    setSelectedProjectKey('');
  };
  const openExperienceModal = (experienceKey) => {
    setSelectedExperienceKey(experienceKey);
  };

  const closeExperienceModal = () => {
    setSelectedExperienceKey('');
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

  useEffect(() => {
    if (heroBgImages.length <= 1) return undefined;
    const intervalId = window.setInterval(() => {
      setHeroBgIndex((i) => (i + 1) % heroBgImages.length);
    }, 2800);
    return () => window.clearInterval(intervalId);
  }, [heroBgImages.length]);

  useEffect(() => {
    if (!selectedProject && !selectedExperience) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeProjectModal();
        closeExperienceModal();
      }
    };
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, selectedExperience]);

  return (
    <main className="page">
      <Header locale={locale} onLocaleChange={setLocale} t={t} />

      <section id="top" className="hero">
        <div className="heroBackground" aria-hidden="true">
          {heroBgImages.map((src, i) => (
            <img key={src} src={src} alt="" className={heroBgIndex === i ? 'active' : ''} />
          ))}
        </div>
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
        </div>
      </section>

      <section className="stats" aria-label={t.statsLabel}>
        {stats.map((stat) => (
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
              <article
                className="experienceCard"
                key={`${experience.title.ko}-${experience.date}`}
                onClick={() => openExperienceModal(`${experience.title.ko}-${experience.date}`)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) {
                    return;
                  }
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openExperienceModal(`${experience.title.ko}-${experience.date}`);
                  }
                }}
                role="button"
                tabIndex={0}
              >
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
                      <h3>{experience.title[locale]}</h3>
                    </div>
                    {/* {experience.projectLink ? (
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
                    )} */}
                  </div>
                  <p>{experience.description[locale]}</p>
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

      {selectedExperience && (
        <div
          aria-labelledby="experienceModalTitle"
          aria-modal="true"
          className="projectModalOverlay"
          onClick={closeExperienceModal}
          role="dialog"
        >
          <article className="projectModal experienceModal" onClick={(event) => event.stopPropagation()}>
            <button
              aria-label="Close experience popup"
              className="projectModalClose"
              onClick={closeExperienceModal}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="projectModalMedia">
              <img src={selectedExperiencePhoto} alt="" />
              {selectedExperiencePhotos.length > 1 && (
                <div className="projectPhotoGrid modalPhotoGrid">
                  {selectedExperiencePhotos.map((photo, index) => (
                    <button
                      aria-label={`Show ${selectedExperience.title.ko} image ${index + 1}`}
                      aria-pressed={selectedExperiencePhotoIndex === index}
                      className={selectedExperiencePhotoIndex === index ? 'active' : ''}
                      key={photo}
                      onClick={() => selectExperiencePhoto(selectedExperienceKey, index)}
                      type="button"
                    >
                      <img src={photo} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="projectModalBody">
              <div className="experienceMetaLine">
                <time dateTime={selectedExperience.date}>{selectedExperience.date}</time>
                {selectedExperience.isAwarded && (
                  <span className="awardBadge">
                    <Trophy aria-hidden="true" size={14} />
                    {selectedExperience.awardLabel}
                  </span>
                )}
              </div>
              <h3 id="experienceModalTitle">{selectedExperience.title[locale]}</h3>
              <p>{selectedExperience.description[locale]}</p>
              <div className="tags">
                {selectedExperience.stack.map((item) => (
                  <TechTag key={item} stackId={item} />
                ))}
              </div>
            </div>
          </article>
        </div>
      )}

      <section id="projects" className="section">
        <div className="sectionHeader">
          <p className="eyebrow">
            <Server size={16} />
            {t.sections.selectedWork}
          </p>
          <h2>{t.sections.projects}</h2>
          <p className="sectionNote">{t.sections.projectNote}</p>
        </div>
        <div className={`projectGrid ${showAllProjects ? 'expanded' : 'collapsed'}`}>
          {projectItems.map((project) => (
            <article
              className="projectCard"
              key={`${project.title.ko}-${project.date}`}
              onClick={() => openProjectModal(`${project.title.ko}-${project.date}`)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) {
                  return;
                }
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openProjectModal(`${project.title.ko}-${project.date}`);
                }
              }}
              role="button"
              tabIndex={0}
            >
              {(() => {
                const projectKey = `${project.title.ko}-${project.date}`;
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
                            aria-label={`Show ${project.title.ko} image ${index + 1}`}
                            aria-pressed={activePhotoIndex === index}
                            className={activePhotoIndex === index ? 'active' : ''}
                            key={photo}
                            onClick={(event) => {
                              event.stopPropagation();
                              selectProjectPhoto(projectKey, index);
                            }}
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
                    <h3>{project.title[locale]}</h3>
                  </div>
                  {project.link ? (
                    <a
                      className="projectLinkButton"
                      href={project.link}
                      onClick={(event) => event.stopPropagation()}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <button
                      className="projectLinkButton"
                      disabled
                      onClick={(event) => event.stopPropagation()}
                      type="button"
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  )}
                </div>
                <p>{project.description[locale]}</p>
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

      {selectedProject && (
        <div
          aria-labelledby="projectModalTitle"
          aria-modal="true"
          className="projectModalOverlay"
          onClick={closeProjectModal}
          role="dialog"
        >
          <article className="projectModal" onClick={(event) => event.stopPropagation()}>
            <button
              aria-label="Close project popup"
              className="projectModalClose"
              onClick={closeProjectModal}
              type="button"
            >
              <X size={18} />
            </button>
            <div className="projectModalMedia">
              <img src={selectedProjectPhoto} alt="" />
              {selectedProjectPhotos.length > 1 && (
                <div className="projectPhotoGrid modalPhotoGrid">
                  {selectedProjectPhotos.map((photo, index) => (
                    <button
                      aria-label={`Show ${selectedProject.title.ko} image ${index + 1}`}
                      aria-pressed={selectedProjectPhotoIndex === index}
                      className={selectedProjectPhotoIndex === index ? 'active' : ''}
                      key={photo}
                      onClick={() => selectProjectPhoto(selectedProjectKey, index)}
                      type="button"
                    >
                      <img src={photo} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="projectModalBody">
              <time dateTime={selectedProject.date}>{selectedProject.date}</time>
              <h3 id="projectModalTitle">{selectedProject.title[locale]}</h3>
              <p>{selectedProject.description[locale]}</p>
              <div className="tags">
                {selectedProject.stack.map((item) => (
                  <TechTag key={item} stackId={item} />
                ))}
              </div>
              {selectedProject.link && (
                <a className="projectModalLink" href={selectedProject.link} rel="noreferrer" target="_blank">
                  <span>{t.sections.projects}</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </article>
        </div>
      )}

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
            <button
              aria-label="Copy email address"
              onClick={() => copyContactValue('email', siteConfig.contact.email)}
              type="button"
            >
              <Mail size={20} />
            </button>
            <a href="https://github.com/mixtugu" aria-label={t.contact.github} rel="noreferrer" target="_blank">
              <Github size={20} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
