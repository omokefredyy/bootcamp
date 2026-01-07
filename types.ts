
export interface Bootcamp {
  id: string;
  title: string;
  description: string;
  price: number;
  instructorId: string;
  category: string;
  enrolledStudents: number;
  totalRevenue: number;
}

export interface BootcampData {
  title: string;
  description: string;
  category: string;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPaid: boolean;
  role: 'student' | 'tutor';
  tier: 'full-access' | null;
  bootcampId?: string; 
  bootcampData?: BootcampData; // Added to store tutor's bootcamp info
  referralCode?: string;
  referralCount?: number;
}

export interface BootcampUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Announcement' | 'Material' | 'Schedule';
}

export interface BootcampMaterial {
  id: string;
  title: string;
  type: 'PDF' | 'Video' | 'Link' | 'Zip';
  description: string;
  url: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  instructor: string;
  topic: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  role: 'user' | 'model' | 'system';
}

export interface AIChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface DirectMessage {
  id: string;
  participants: string[];
  messages: ChatMessage[];
}

export interface Assignment {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  collaborators: string[];
  dueDate: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  repoUrl: string;
  demoUrl: string;
  notes: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface Lecture {
  id: string;
  title: string;
  instructor: string;
  date: string;
  transcript: string;
}

export interface LectureSummary {
  lectureId: string;
  summary: string;
  keyPoints: string[];
  generatedAt: number;
}
