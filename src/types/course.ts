export interface Document {
  id: string;
  name: string;
  uploadedAt: string;
  url: string;
  size?: string;
}

export interface Homework {
  id: string;
  name: string;
  submittedAt: string;
  dueDate: string;
  url?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  imageUrl: string;
  documents?: Document[];
  homework?: Homework[];
}

export interface Level {
  id: string;
  name: string;
  code: string;
  password: string;
  description: string;
  courses: Course[];
  meetLink: string;
  imageUrl?: string;
}