// frontend/app/constants/parties.ts
import type { PoliticalParty } from '@/types/parties';

export const POLITICAL_PARTIES: readonly PoliticalParty[] = [
  {
    id: 'bjp',
    name: 'BJP',
    fullName: 'Bharatiya Janata Party',
    imagePath: '/logos-loop/bjp-logo.png',  // ✅ Original path
    color: '#FF9933',
  },
  {
    id: 'inc',
    name: 'INC',
    fullName: 'Indian National Congress',
    imagePath: '/logos-loop/inc-logo.png',  // ✅ Original path
    color: '#00BFFF',
  },
  {
    id: 'aap',
    name: 'AAP',
    fullName: 'Aam Aadmi Party',
    imagePath: '/logos-loop/aap-logo.png',  // ✅ Original path
    color: '#00BFFF',
  },
  {
    id: 'tmc',
    name: 'TMC',
    fullName: 'Trinamool Congress',
    imagePath: '/logos-loop/tmc-logo.png',  // ✅ Original path
    color: '#008000',
  },
  {
    id: 'dmk',
    name: 'DMK',
    fullName: 'Dravida Munnetra Kazhagam',
    imagePath: '/logos-loop/dmk-logo.png',  // ✅ Original path
    color: '#FF0000',
  },
  {
    id: 'sp',
    name: 'SP',
    fullName: 'Samajwadi Party',
    imagePath: '/logos-loop/sp-logo.png',   // ✅ Original path
    color: '#FF0000',
  },
  {
    id: 'bsp',
    name: 'BSP',
    fullName: 'Bahujan Samaj Party',
    imagePath: '/logos-loop/bsp-logo.png', // ✅ Original path
    color: '#0000FF',
  },
  {
    id: 'cpim',
    name: 'CPI(M)',
    fullName: 'Communist Party of India (Marxist)',
    imagePath: '/logos-loop/cpi-logo.png',  // ✅ Original path
    color: '#FF0000',
  },
  {
    id: 'jdu',
    name: 'JD(U)',
    fullName: 'Janata Dal (United)',
    imagePath: '/logos-loop/jdu-logo.png', // ✅ Original path
    color: '#008000',
  },
  {
    id: 'ncp',
    name: 'NCP',
    fullName: 'Nationalist Congress Party',
    imagePath: '/logos-loop/ncp-logo.png', // ✅ Original path
    color: '#0000FF',
  },
  {
    id: 'tvk',
    name: 'TVK',
    fullName: 'Tamilaga Vettri Kazhagam',
    imagePath: '/logos-loop/tvk-logo.png', // ✅ Original path
    color: '#FF0000',
  },
  {
    id: 'rjd',
    name: 'RJD',
    fullName: 'Rashtriya Janata Dal',
    imagePath: '/logos-loop/rjd-logo.png', // ✅ Original path
    color: '#008000',
  },
] as const;

export default POLITICAL_PARTIES;
