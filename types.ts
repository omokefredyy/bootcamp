// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  isPaid: boolean;
  role: 'student' | 'tutor';
  tier: 'full-access' | null;
  avatar_url?: string;
  referralCode?: string;
  referralCount?: number;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor';
  avatar_url?: string;
  created_at: string;
}

// ============================================
// BOOTCAMPS
// ============================================

export interface Bootcamp {
  id: string;
  instructor_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
  // Joined data
  profiles?: Profile;
}

export interface BootcampData {
  title: string;
  description: string;
  category: string;
  price: number;
}

// ============================================
// ENROLLMENTS
// ============================================

export interface Enrollment {
  id: string;
  bootcamp_id: string;
  student_email: string;
  student_name: string;
  status: 'Paid' | 'Pending' | 'Refunded';
  progress: number;
  amount_paid: number;
  joined_at: string;
  // Joined data
  bootcamps?: Bootcamp;
}

// ============================================
// SESSIONS
// ============================================

export interface Session {
  id: string;
  bootcamp_id: string;
  title: string;
  description: string;
  start_time: string; // ISO timestamp
  duration_minutes: number;
  join_url: string;
  attendees_count: number;
  created_at: string;
}

// ============================================
// MATERIALS
// ============================================

export interface BootcampMaterial {
  id: string;
  bootcamp_id: string;
  title: string;
  type: 'PDF' | 'Video' | 'Link' | 'Zip';
  description: string;
  url: string;
  created_at: string;
}

// ============================================
// UPDATES / ANNOUNCEMENTS
// ============================================

export interface BootcampUpdate {
  id: string;
  bootcamp_id: string;
  title: string;
  content: string;
  category: 'Announcement' | 'Material' | 'Schedule';
  date: string;
  created_at: string;
}

// ============================================
// TRANSACTIONS
// ============================================

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'enrollment' | 'withdrawal' | 'platform_fee';
  description: string;
  status: string;
  created_at: string;
}

// ============================================
// CHAT
// ============================================

export interface ChatMessage {
  id: string;
  sender_id?: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  messages: ChatMessage[];
}

// ============================================
// AI & SUMMARIES
// ============================================

export interface AIChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface LectureSummary {
  id: string;
  session_id?: string;
  bootcamp_id?: string;
  title: string;
  summary: string;
  key_points: string[];
  created_at: string;
}

// ============================================
// LEGACY / UI-ONLY TYPES
// ============================================

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  instructor: string;
  topic: string;
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

// ============================================
// REVENUE TYPES
// ============================================

export interface RevenueStats {
  gross: number;
  net: number;
  withdrawn: number;
  available: number;
}