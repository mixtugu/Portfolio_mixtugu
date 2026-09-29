import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Github, Languages, MapPin, Pause, Play } from 'lucide-react';
import { ParticleArt } from './ParticleArt';
import { particleScenes } from './data/particleShapes';
import './profileHero.css';

const copy = {
  ko: {
    interests: ['건담', '하츠네 미쿠', 'VR', '코딩'],
    select: '입자 그래픽 선택', pause: '입자 애니메이션 일시정지', play: '입자 애니메이션 재생',
    art: '입자로 표현한', loading: '불러오는 중', loadError: '그래픽을 불러오지 못했습니다', retry: '다시 시도',
  },
  en: {
    interests: ['Gundam', 'Hatsune Miku', 'VR', 'Coding'],
    select: 'Select particle artwork', pause: 'Pause particle animation', play: 'Play particle animation',
    art: 'Particle portrait of', loading: 'Loading', loadError: 'Could not load the artwork', retry: 'Try again',
  },
  ja: {
    interests: ['ガンダム', '初音ミク', 'VR', 'コーディング'],
    select: '粒子グラフィックを選択', pause: '粒子アニメーションを一時停止', play: '粒子アニメーションを再生',
    art: '粒子で描いた', loading: '読み込み中', loadError: 'グラフィックを読み込めませんでした', retry: '再試行',
  },
};

export function ProfileHero({ locale, t, name }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const text = copy[locale] ?? copy.en;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <section id="top" className="profileHero" aria-labelledby="profileHeroTitle">
      <div className="profileHeroInner">
        <div className="profileIntroduction">
          <img className="profileAvatar" src="/images/profile_icon.jpeg" alt="" width="64" height="64" />
          <h1 id="profileHeroTitle" className="profileHeadline">{name}</h1>
          <p className="profileRole">{t.profile.role}</p>
          <p className="profileExpertise">XR · Web · Data</p>
          <ul className="profileDetails">
            <li><MapPin size={16} aria-hidden="true" />{t.profile.location}</li>
            <li><Languages size={16} aria-hidden="true" />{t.profile.languages.join(' · ')}</li>
          </ul>
          <div className="profileLinks">
            <a className="primaryButton" href="#projects">{t.hero.projectsCta}<ArrowUpRight size={17} /></a>
            <a className="secondaryButton" href="#contact">{t.hero.contactCta}</a>
            <a className="profileGithub" href="https://github.com/mixtugu" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={20} /></a>
          </div>
        </div>

        <div className="particleExhibit">
          <div className="particleStage">
            <ParticleArt active={active} paused={paused} onNext={setActive} description={text.art + ' ' + text.interests[active]} loadingLabel={text.loading} errorLabel={text.loadError} retryLabel={text.retry} />
          </div>
          <div className="particleControls">
            <div className="interestChoices" role="group" aria-label={text.select}>
              {particleScenes.map((item, index) => (
                <button key={item.id} type="button" className={'interestChoice' + (active === index ? ' isActive' : '')} aria-pressed={active === index} onClick={() => setActive(index)}>
                  {text.interests[index]}
                </button>
              ))}
            </div>
            {!reducedMotion && <button type="button" className="particlePlayback" onClick={() => setPaused((value) => !value)} aria-label={paused ? text.play : text.pause}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}
          </div>
        </div>
      </div>
    </section>
  );
}