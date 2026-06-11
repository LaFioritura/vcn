export interface Comment {
  nickname: string;
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  content: string;
  likes: number;
  comments: Comment[];
  date: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  imageUrl: string;
  badge: string;
  views: number;
}

export interface GameBooking {
  id: string;
  name: string;
  email: string;
  platform: 'PS5' | 'Xbox Series X' | 'PC';
  edition: string;
  badgeEarned: string;
  discountPercent: number;
  status: string; // 'In Attesa' | 'Approvato' | 'Ritiro Eseguito'
  timestamp: string;
  notes?: string;
  plateText?: string;
  plateStyle?: string;
}

export interface MapSpot {
  id: string;
  name: string;
  coordinates: string;
  rumorTitle: string;
  description: string;
  confidence: number; // percentage (e.g. 85%)
  source: string; // 'Official Trailer' | 'Forum Leak' | 'Analisti'
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
}

export interface RadioStation {
  id: string;
  name: string;
  freq: string;
  genre: string;
  description: string;
  trackName: string;
  accentColor: string;
  iconName: string;
}

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
}
