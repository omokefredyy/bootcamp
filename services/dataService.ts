import { supabase } from '../supabaseClient';

// Helper to check if Supabase is configured
const checkEnv = () => {
  const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
  const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!hasUrl || !hasKey) {
    console.warn('⚠️ Supabase not configured. Check your .env file.');
    return false;
  }
  return true;
};

export const DataService = {
  // ============================================
  // PROFILES
  // ============================================
  
  async getProfile(userId: string) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async createProfile(profile: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, updates: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // ============================================
  // BOOTCAMPS
  // ============================================
  
  async getAllBootcamps() {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('bootcamps')
        .select('*, profiles(name, email)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bootcamps:', error);
      return [];
    }
  },

  async getBootcamps(instructorId: string) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('bootcamps')
        .select('*')
        .eq('instructor_id', instructorId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching instructor bootcamps:', error);
      return [];
    }
  },

  async getBootcamp(bootcampId: string) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('bootcamps')
        .select('*, profiles(name, email, avatar_url)')
        .eq('id', bootcampId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bootcamp:', error);
      return null;
    }
  },

  async createBootcamp(bootcamp: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('bootcamps')
        .insert([bootcamp])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating bootcamp:', error);
      throw error;
    }
  },

  async updateBootcamp(bootcampId: string, updates: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('bootcamps')
        .update(updates)
        .eq('id', bootcampId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating bootcamp:', error);
      throw error;
    }
  },

  async deleteBootcamp(bootcampId: string) {
    if (!checkEnv()) return;
    try {
      const { error } = await supabase
        .from('bootcamps')
        .delete()
        .eq('id', bootcampId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting bootcamp:', error);
      throw error;
    }
  },

  // ============================================
  // ENROLLMENTS
  // ============================================
  
  async getStudents(bootcampId: string) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('bootcamp_id', bootcampId)
        .order('joined_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  },

  async getEnrollment(bootcampId: string, studentEmail: string) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('bootcamp_id', bootcampId)
        .eq('student_email', studentEmail)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      return null;
    }
  },

  async getUserEnrollments(studentEmail: string) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, bootcamps(*)')
        .eq('student_email', studentEmail)
        .order('joined_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      return [];
    }
  },

  async createEnrollment(enrollment: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([enrollment])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  },

  async updateEnrollment(enrollmentId: string, updates: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .update(updates)
        .eq('id', enrollmentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  },

  // ============================================
  // SESSIONS
  // ============================================
  
  async getSessions(bootcampId: string) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('bootcamp_id', bootcampId)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  },

  async createSession(session: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([session])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  async updateSession(sessionId: string, updates: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  },

  async deleteSession(sessionId: string) {
    if (!checkEnv()) return;
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  },

  // ============================================
  // MATERIALS
  // ============================================
  
  async getMaterials(bootcampId: string) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('bootcamp_id', bootcampId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching materials:', error);
      return [];
    }
  },

  async createMaterial(material: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('materials')
        .insert([material])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  },

  async deleteMaterial(materialId: string) {
    if (!checkEnv()) return;
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  },

  // ============================================
  // UPDATES / ANNOUNCEMENTS
  // ============================================
  
  async getUpdates(bootcampId: string) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('bootcamp_id', bootcampId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching updates:', error);
      return [];
    }
  },

  async createUpdate(update: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('updates')
        .insert([update])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating update:', error);
      throw error;
    }
  },

  async deleteUpdate(updateId: string) {
    if (!checkEnv()) return;
    try {
      const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', updateId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting update:', error);
      throw error;
    }
  },

  // ============================================
  // CHAT MESSAGES
  // ============================================
  
  async getChatMessages(limit = 100) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  },

  async sendChatMessage(message: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([message])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  // ============================================
  // TRANSACTIONS (REVENUE)
  // ============================================
  
  async getTransactions(userId: string) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  async createTransaction(transaction: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Calculate instructor revenue (90% of enrollments minus withdrawals)
  async getInstructorRevenue(instructorId: string) {
    if (!checkEnv()) return { gross: 0, net: 0, withdrawn: 0, available: 0 };
    
    try {
      // Get all bootcamps by this instructor
      const bootcamps = await this.getBootcamps(instructorId);
      const bootcampIds = bootcamps.map(b => b.id);

      if (bootcampIds.length === 0) {
        return { gross: 0, net: 0, withdrawn: 0, available: 0 };
      }

      // Get all paid enrollments for these bootcamps
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('amount_paid')
        .in('bootcamp_id', bootcampIds)
        .eq('status', 'Paid');

      if (enrollError) throw enrollError;

      const grossRevenue = enrollments?.reduce((sum, e) => sum + (e.amount_paid || 0), 0) || 0;
      const netRevenue = grossRevenue * 0.9; // 90% after platform fee

      // Get withdrawals
      const { data: withdrawals, error: withdrawError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', instructorId)
        .eq('type', 'withdrawal');

      if (withdrawError) throw withdrawError;

      const totalWithdrawn = withdrawals?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
      const available = netRevenue - totalWithdrawn;

      return {
        gross: grossRevenue,
        net: netRevenue,
        withdrawn: totalWithdrawn,
        available: available
      };
    } catch (error) {
      console.error('Error calculating revenue:', error);
      return { gross: 0, net: 0, withdrawn: 0, available: 0 };
    }
  },

  // ============================================
  // LECTURE SUMMARIES
  // ============================================
  
  async getLectureSummaries(bootcampId: string) {
    if (!checkEnv()) return [];
    try {
      const { data, error } = await supabase
        .from('lecture_summaries')
        .select('*')
        .eq('bootcamp_id', bootcampId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching lecture summaries:', error);
      return [];
    }
  },

  async createLectureSummary(summary: any) {
    if (!checkEnv()) return null;
    try {
      const { data, error } = await supabase
        .from('lecture_summaries')
        .insert([summary])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating lecture summary:', error);
      throw error;
    }
  }
};