export type MinorLanguage = 'Русский' | 'Английский';
export type MinorFormat = 'Онлайн' | 'Очно' | 'Смешанный';

export type SortCriterion = 'overall' | 'difficulty' | 'usefulness' | 'workload' | 'interest' | 'reviews' | 'title';
export type SortDirection = 'asc' | 'desc';
export type CriterionKey = 'overall' | 'difficulty' | 'usefulness' | 'workload' | 'interest';

export interface SortPriorityItem {
  criterion: CriterionKey;
  direction: 'asc' | 'desc';
}

export interface Discipline {
  id: string;
  name: string;
  module: string;
  credits: number;
  format: string;
  examType: string;
  description: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  department: string;
  photoUrl?: string;
  verdictTag: string;
}

export interface MinorRatings {
  overall: number; // Общий (1-5)
  difficulty: number; // Сложность (1-5)
  usefulness: number; // Полезность (1-5)
  workload: number; // Энергозатраты/время (1-5)
  interest: number; // Интересность (1-5)
  reviewCount: number;
  recommendPercent: number;
}

export interface Review {
  id: string;
  minorId: string;
  authorName: string;
  isAnonymous: boolean;
  faculty: string;
  studyYear: string;
  date: string;
  ratings: {
    overall: number;
    difficulty: number;
    usefulness: number;
    workload: number;
    interest: number;
  };
  text: string;
  pros?: string;
  cons?: string;
  advice?: string;
  likes: number;
}

export interface Minor {
  id: string;
  code: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  department: string;
  facultyOwner: string;
  campus: string;
  language: MinorLanguage;
  format: MinorFormat;
  imageUrl: string;
  officialUrl: string;
  quota: number;
  availableSpots: number;
  formula: {
    formulaText: string;
    description: string;
    blockingElements: string;
    roundingRule: string;
  };
  disciplines: Discipline[];
  teachers: Teacher[];
  ratings: MinorRatings;
  reviews: Review[];
  restrictedFaculties: string[];
  recommendedFor: string[];
  tags: string[];
}

export interface CriterionFilter {
  enabled: boolean;
  min: number;
  max: number;
}

export interface FilterState {
  searchQuery: string;
  languages: MinorLanguage[];
  formats: MinorFormat[];
  departments: string[];
  studentFaculty: string;
  onlyEligibleForMyFaculty: boolean;
  
  // 5 criteria filters with checkboxes & range sliders
  criteria: {
    overall: CriterionFilter;
    difficulty: CriterionFilter;
    usefulness: CriterionFilter;
    workload: CriterionFilter;
    interest: CriterionFilter;
  };

  // Multi-criteria Priority Sorting
  sortPriorities: SortPriorityItem[];
  
  // Optional secondary basic sort (reviews, title)
  generalSort: 'priority' | 'reviews' | 'title';
}
