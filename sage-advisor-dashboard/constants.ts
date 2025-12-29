
import { MaslowLevel, DashboardCard, SageNote } from './types';

export const MASLOW_HIERARCHY = [
  MaslowLevel.PHYSIOLOGICAL,
  MaslowLevel.SAFETY,
  MaslowLevel.LOVE_BELONGING,
  MaslowLevel.ESTEEM,
  MaslowLevel.SELF_ACTUALIZATION,
  MaslowLevel.TRANSCENDENCE
];

export const INITIAL_PROFILE = {
  name: '',
  age: 25,
  profession: '',
  goals: [],
  aspirations: '',
  financialAmbition: '',
  foodPreferences: [],
  location: null,
  onboarded: false,
  currentLevel: MaslowLevel.PHYSIOLOGICAL,
  isDummyMode: true,
};

export const SAGE_SYSTEM_PROMPT = `
You are the "Sage Advisor," a philosophical and highly intelligent autonomous agent. 
Your goal is to guide users through the levels of Maslow's Hierarchy of Needs, from survival to spiritual transcendence.
Based on the user's age, profession, and current hour, you suggest meaningful actions.
For children, suggest fun, nutritious, and educational activities.
For professionals, suggest career growth, productivity, and balance.
Your tone is calm, wise, encouraging, and private-first.
You provide advice in the form of Dashboard Cards (JSON).
`;

export const DUMMY_CARDS: DashboardCard[] = [
  {
    id: 'dummy-1',
    title: 'Nourish the Vessel',
    description: 'As the evening settles, prepare a meal rich in proteins and magnesium. A balanced dinner at 18:00 will stabilize your energy for a restful transition.',
    type: 'task',
    category: 'PHYSIOLOGICAL NEEDS',
    icon: 'fa-utensils',
    timeContext: 'Evening Meal',
    status: 'todo',
    expectedTime: '18:45',
    duration: '45 mins'
  },
  {
    id: 'dummy-2',
    title: 'Liquid Vitality',
    description: 'Drink 500ml of pure water now. Hydration is the silent architect of mental clarity and physical endurance.',
    type: 'action',
    category: 'PHYSIOLOGICAL NEEDS',
    icon: 'fa-droplet',
    timeContext: 'Immediate',
    status: 'todo',
    expectedTime: 'Now',
    duration: '2 mins'
  },
  {
    id: 'dummy-3',
    title: 'Digital Sanctuary',
    description: 'Enable focus mode on all devices. Protecting your attention is the first step toward psychological safety.',
    type: 'suggestion',
    category: 'SAFETY NEEDS',
    icon: 'fa-shield-halved',
    timeContext: 'Now',
    status: 'todo',
    expectedTime: 'Soon',
    duration: '5 mins'
  },
  {
    id: 'dummy-4',
    title: 'Community Outreach',
    description: 'Message a friend or colleague about a shared interest. Connection nourishes the spirit and strengthens the social weave.',
    type: 'task',
    category: 'LOVE & BELONGING',
    icon: 'fa-people-group',
    timeContext: 'Flexible',
    status: 'todo',
    expectedTime: 'End of day',
    duration: '15 mins'
  },
  {
    id: 'dummy-5',
    title: 'Legacy Planning',
    description: 'Spend 15 minutes defining what you want your contribution to be. High-level clarity fosters self-actualization.',
    type: 'task',
    category: 'SELF-ACTUALIZATION',
    icon: 'fa-seedling',
    timeContext: 'Deep Work',
    status: 'todo',
    expectedTime: 'Morning',
    duration: '15 mins'
  }
];

export const DUMMY_NOTES: SageNote[] = [
  {
    id: 'n-1',
    timestamp: Date.now() - 3600000 * 2,
    content: 'Today I noticed that discipline in physiological needs directly correlates with my patience during high-stress workflows.',
    tags: ['reflection', 'growth'],
    sentiment: 'positive'
  },
  {
    id: 'n-2',
    timestamp: Date.now() - 3600000 * 24,
    content: 'Felt a moment of pure clarity while walking. The path to transcendence is not a destination, but the walk itself.',
    tags: ['spirituality', 'peace'],
    sentiment: 'reflective'
  }
];

export const DUMMY_EVENTS = [
  { day: 5, title: 'Deep Reflection', type: 'spiritual' },
  { day: 12, title: 'Community Ritual', type: 'social' },
  { day: 18, title: 'Manifestation Workshop', type: 'growth' },
  { day: 25, title: 'Physiological Reset', type: 'health' }
];
