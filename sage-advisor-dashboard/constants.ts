
import { MaslowLevel } from './types';

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
