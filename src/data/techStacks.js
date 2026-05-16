import { MdDevices, MdDesignServices } from 'react-icons/md';
import {
  SiCss,
  SiGooglegemini,
  SiIos,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiReactquery,
  SiSocketdotio,
  SiSupabase,
  SiThreedotjs,
  SiTypescript,
} from 'react-icons/si';

export const techStacks = {
  react: {
    name: 'React',
    color: '#61dafb',
    Icon: SiReact,
  },
  typescript: {
    name: 'TypeScript',
    color: '#3178c6',
    Icon: SiTypescript,
  },
  tanstackQuery: {
    name: 'TanStack Query',
    color: '#ff4154',
    Icon: SiReactquery,
  },
  javascript: {
    name: 'JavaScript',
    color: '#f7df1e',
    Icon: SiJavascript,
  },
  css: {
    name: 'CSS',
    color: '#1572b6',
    Icon: SiCss,
  },
  responsiveUi: {
    name: 'Responsive UI',
    color: '#39c5bb',
    Icon: MdDevices,
  },
  gemini: {
    name: 'Gemini',
    color: '#8e75ff',
    Icon: SiGooglegemini,
  },
  iosArApi: {
    name: 'iOS AR API',
    color: '#050505',
    Icon: SiIos,
  },
  threejs: {
    name: 'Three.js',
    color: '#050505',
    Icon: SiThreedotjs,
  },
  nextjs: {
    name: 'Next.js',
    color: '#050505',
    Icon: SiNextdotjs,
  },
  openaiApi: {
    name: 'OpenAI API',
    color: '#10a37f',
    Icon: SiOpenai,
  },
  postgresql: {
    name: 'PostgreSQL',
    color: '#4169e1',
    Icon: SiPostgresql,
  },
  prisma: {
    name: 'Prisma',
    color: '#2d3748',
    Icon: SiPrisma,
  },
  supabase: {
    name: 'Supabase',
    color: '#3ecf8e',
    Icon: SiSupabase,
  },
  nodejs: {
    name: 'Node.js',
    color: '#5fa04e',
    Icon: SiNodedotjs,
  },
  socketio: {
    name: 'Socket.IO',
    color: '#050505',
    Icon: SiSocketdotio,
  },
  uiEngineering: {
    name: 'UI Engineering',
    color: '#e73535',
    Icon: MdDesignServices,
  },
};
