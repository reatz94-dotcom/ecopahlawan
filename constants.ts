
import { Mission, LearningTopic } from './types'; // Add this import

export enum AppRoute {
  HOME = '/',
  LEARN = '/learn',
  MISSIONS = '/missions',
  PROFILE = '/profile',
}

export const NAV_LINKS = [
  { path: AppRoute.HOME, label: 'Beranda' },
  { path: AppRoute.LEARN, label: 'Belajar' },
  { path: AppRoute.MISSIONS, label: 'Misi' },
  { path: AppRoute.PROFILE, label: 'Profil' },
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Daur Ulang Sampah Plastik',
    description: 'Kumpulkan 5 botol plastik bekas dan daur ulang dengan benar.',
    points: 50,
    completed: false,
    category: 'Reduce Waste',
  },
  {
    id: 'm2',
    title: 'Hemat Air',
    description: 'Matikan keran saat menyikat gigi selama 3 hari berturut-turut.',
    points: 30,
    completed: false,
    category: 'Conservation',
  },
  {
    id: 'm3',
    title: 'Tanam Pohon',
    description: 'Tanam setidaknya satu bibit pohon di halaman rumah atau area sekitar.',
    points: 100,
    completed: false,
    category: 'Reforestation',
  },
  {
    id: 'm4',
    title: 'Kurangi Penggunaan Listrik',
    description: 'Cabut perangkat elektronik yang tidak digunakan selama seharian penuh.',
    points: 40,
    completed: false,
    category: 'Energy Saving',
  },
];

export const INITIAL_LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'lt1',
    title: 'Apa itu Perubahan Iklim?',
    description: 'Pelajari dasar-dasar perubahan iklim dan dampaknya.',
    image: 'https://picsum.photos/400/200?random=1',
  },
  {
    id: 'lt2',
    title: 'Manfaat Daur Ulang',
    description: 'Temukan mengapa daur ulang penting untuk planet kita.',
    image: 'https://picsum.photos/400/200?random=2',
  },
  {
    id: 'lt3',
    title: 'Sumber Energi Terbarukan',
    description: 'Jelajahi berbagai jenis energi bersih.',
    image: 'https://picsum.photos/400/200?random=3',
  },
  {
    id: 'lt4',
    title: 'Konservasi Air di Rumah',
    description: 'Tips mudah untuk menghemat air setiap hari.',
    image: 'https://picsum.photos/400/200?random=4',
  },
];
