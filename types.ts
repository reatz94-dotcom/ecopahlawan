
export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  content?: string; // Detailed content from Gemini
  image?: string;
}

export interface UserProfile {
  name: string;
  points: number;
  completedMissions: number;
  badges: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  isStreaming?: boolean;
}
