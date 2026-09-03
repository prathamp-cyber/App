export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SurveyMetrics {
  communication: number;
  versatility: number;
  timeliness: number;
  professionalism: number;
}

export interface Designer {
  id: string;
  name: string;
  firm: string;
  area: string;
  city: 'Gandhidham' | 'Ahmedabad';
  address: string;
  rating: number;
  googleReviewCount: number;
  experience: number;
  completedProjects: number;
  specialties: string[];
  avatar: string;
  coverImage: string;
  portfolio: string[];
  description: string;
  contactNumber: string;
  email: string;
  responseTime: string;
  surveyMetrics: SurveyMetrics;
  reviews: Review[];
}
