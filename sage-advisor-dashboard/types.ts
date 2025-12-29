
export enum MaslowLevel {
  PHYSIOLOGICAL = 'Physiological Needs',
  SAFETY = 'Safety Needs',
  LOVE_BELONGING = 'Love & Belonging',
  ESTEEM = 'Esteem',
  SELF_ACTUALIZATION = 'Self-Actualization',
  TRANSCENDENCE = 'Transcendence'
}

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface UserProfile {
  name: string;
  age: number;
  profession: string;
  goals: string[];
  aspirations: string;
  financialAmbition: string;
  foodPreferences: string[];
  location: { lat: number; lng: number } | null;
  onboarded: boolean;
  currentLevel: MaslowLevel;
  isDummyMode: boolean;
}

export interface DashboardCard {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'info' | 'suggestion' | 'task';
  category: string;
  icon: string;
  timeContext?: string;
  status?: TaskStatus;
  expectedTime?: string;
  duration?: string;
}

export interface SageNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  type: 'reminder' | 'insight' | 'nudge';
  read: boolean;
  actionLabel?: string;
  cardId?: string;
}

export interface SageNote {
  id: string;
  timestamp: number;
  content: string;
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'reflective';
}

export interface MCPConfig {
  servers: Array<{
    id: string;
    name: string;
    url: string;
    status: 'connected' | 'disconnected';
  }>;
}
