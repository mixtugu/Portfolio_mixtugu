import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Rocket,
  Server,
  Sparkles,
} from 'lucide-react';
import './styles.css';

const projects = [
  {
    title: 'Commerce Admin',
    description: '주문, 재고, 고객 데이터를 한 화면에서 관리하는 운영 대시보드.',
    stack: ['React', 'TypeScript', 'TanStack Query'],
  },
  {
    title: 'AI Resume Helper',
    description: '이력서 문장을 분석하고 직무별 개선 제안을 제공하는 웹 서비스.',
    stack: ['Next.js', 'OpenAI API', 'PostgreSQL'],
  },
  {
    title: 'Realtime Chat',
    description: '팀 협업을 위한 실시간 메시징과 알림 기능을 구현한 프로젝트.',
    stack: ['React', 'Node.js', 'Socket.IO'],
  },
];

const skills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'UI Engineering', 'REST API'];

function App() {
  return (
    <main className="page">
      <nav className="nav" aria-label="주요 메뉴">
        <a className="brand" href="#top">
          <span className="brandMark">M</span>
          <span>Mixtugu</span>
        </a>
        <div className="navLinks">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="top" className="hero">
        <div className="heroCopy">
          <p className="eyebrow">
            <Sparkles size={16} />
            Frontend Developer Portfolio
          </p>
          <h1>사용자 경험을 코드로 구체화하는 개발자</h1>
          <p className="intro">
            React 기반 인터페이스, API 연동, 반응형 UI를 중심으로 제품의 첫인상과
            사용 흐름을 탄탄하게 만듭니다.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#projects">
              프로젝트 보기
              <ArrowUpRight size={18} />
            </a>
            <a className="secondaryButton" href="mailto:hello@example.com">
              <Mail size={18} />
              연락하기
            </a>
          </div>
        </div>

        <div className="profilePanel" aria-label="프로필 요약">
          <div className="avatar">
            <Code2 size={54} />
          </div>
          <div>
            <p className="profileName">Your Name</p>
            <p className="profileRole">React Developer</p>
          </div>
          <div className="profileMeta">
            <span>
              <MapPin size={16} />
              Seoul, KR
            </span>
            <span>
              <Rocket size={16} />
              Available for work
            </span>
          </div>
        </div>
      </section>

      <section className="stats" aria-label="핵심 지표">
        <article>
          <strong>3+</strong>
          <span>Production Projects</span>
        </article>
        <article>
          <strong>2 yr</strong>
          <span>Frontend Experience</span>
        </article>
        <article>
          <strong>98%</strong>
          <span>Responsive UI Focus</span>
        </article>
      </section>

      <section id="projects" className="section">
        <div className="sectionHeader">
          <p className="eyebrow">
            <Server size={16} />
            Selected Work
          </p>
          <h2>프로젝트</h2>
        </div>
        <div className="projectGrid">
          {projects.map((project) => (
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

      <section id="skills" className="section splitSection">
        <div className="sectionHeader">
          <p className="eyebrow">
            <Code2 size={16} />
            Tech Stack
          </p>
          <h2>기술 역량</h2>
        </div>
        <div className="skillList">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="contact" className="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>함께 만들 프로젝트가 있나요?</h2>
          <p>포트폴리오 내용은 실제 이름, 이메일, 프로젝트 링크로 바로 교체할 수 있습니다.</p>
        </div>
        <div className="socials">
          <a href="mailto:hello@example.com" aria-label="이메일">
            <Mail size={20} />
          </a>
          <a href="https://github.com/" aria-label="깃허브">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/" aria-label="링크드인">
            <Linkedin size={20} />
          </a>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
