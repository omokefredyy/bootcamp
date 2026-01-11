import { supabase } from '../supabaseClient';

// Helper to return empty array if no Supabase URL (graceful degradation if keys missing)
const checkEnv = () => !!import.meta.env.VITE_SUPABASE_URL;

export const DataService = {
    // BOOTCAMPS
    async getBootcamps(instructorId: string) {
        if (!checkEnv()) return [];
        const { data } = await supabase.from('bootcamps').select('*').eq('instructor_id', instructorId);
        return data || [];
    },

    async getAllBootcamps() {
        if (!checkEnv()) return [];
        const { data } = await supabase.from('bootcamps').select('*').order('created_at', { ascending: false });
        return data || [];
    },

    async createBootcamp(bootcamp: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('bootcamps').insert([bootcamp]).select();
        if (error) throw error;
        return data[0];
    },

    async registerForBootcamp(bootcampId: string, studentId: string, studentName: string, studentEmail: string, amount: number) {
        if (!checkEnv()) return null;

        // Create enrollment
        const { data, error } = await supabase.from('enrollments').insert([{
            bootcamp_id: bootcampId,
            student_id: studentId, // Need to ensure student_id column exists or use email
            student_name: studentName,
            student_email: studentEmail,
            status: 'Paid',
            amount_paid: amount
        }]).select();

        if (error) throw error;

        // Also create a transaction for the instructor
        // (Fetch instructor_id first)
        const { data: bc } = await supabase.from('bootcamps').select('instructor_id').eq('id', bootcampId).single();
        if (bc) {
            await supabase.from('transactions').insert([{
                user_id: bc.instructor_id,
                amount: amount * 0.9, // 90% goes to instructor
                type: 'enrollment',
                description: `Student enrollment: ${studentName}`
            }]);
        }

        return data[0];
    },

    // STUDENTS
    async getStudents(bootcampId: string) {
        if (!checkEnv()) return [];
        const { data } = await supabase.from('enrollments').select('*').eq('bootcamp_id', bootcampId);
        return data || [];
    },

    // SESSIONS
    async getSessions(bootcampId: string) {
        if (!checkEnv()) return [];
        const { data } = await supabase.from('sessions').select('*').eq('bootcamp_id', bootcampId);
        return data || [];
    },

    async createSession(session: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('sessions').insert([session]).select();
        if (error) throw error;
        return data[0];
    },

    async deleteSession(sessionId: string) {
        if (!checkEnv()) return;
        await supabase.from('sessions').delete().eq('id', sessionId);
    },

    // MATERIALS
    async getMaterials(bootcampId: string) {
        if (!checkEnv()) return [];
        const { data } = await supabase.from('materials').select('*').eq('bootcamp_id', bootcampId);
        return data || [];
    },

    async createMaterial(material: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('materials').insert([material]).select();
        if (error) throw error;
        return data[0];
    },

    // UPDATES / ANNOUNCEMENTS
    async getUpdates(bootcampId: string) {
        if (!checkEnv()) return [];
        const { data } = await supabase.from('updates').select('*').eq('bootcamp_id', bootcampId);
        return data || [];
    },

    async createUpdate(update: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('updates').insert([update]).select();
        if (error) throw error;
        return data[0];
    },

    // CHAT
    async getChatMessages() {
        if (!checkEnv()) return [];
        const { data } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(50);
        return data || [];
    },

    async sendChatMessage(message: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('chat_messages').insert([message]).select();
        if (error) throw error;
        return data[0];
    },

    // DIRECT MESSAGES
    async getDirectMessages(userId: string, contactId: string) {
        if (!checkEnv()) return [];
        const { data } = await supabase
            .from('direct_messages')
            .select('*')
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
            .order('created_at', { ascending: true });
        return data || [];
    },

    async sendDirectMessage(message: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('direct_messages').insert([message]).select();
        if (error) throw error;
        return data[0];
    },

    // COLLABORATION
    async getCollaborationRooms() {
        if (!checkEnv()) return [];
        const { data } = await supabase.from('collaboration_rooms').select('*');
        return data || [];
    },

    async createCollaborationRoom(room: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('collaboration_rooms').insert([room]).select();
        if (error) throw error;
        return data[0];
    },

    async getCollaborationMessages(roomId: string) {
        if (!checkEnv()) return [];
        const { data } = await supabase
            .from('collaboration_messages')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true });
        return data || [];
    },

    async sendCollaborationMessage(message: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('collaboration_messages').insert([message]).select();
        if (error) throw error;
        return data[0];
    },

    async joinCollaborationRoom(roomId: string, userId: string) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase
            .from('collaboration_room_members')
            .insert([{ room_id: roomId, user_id: userId }])
            .select();
        if (error) throw error;
        return data[0];
    },

    // TWILIO NOTIFICATIONS
    async notifyStudents(bootcampId: string, message: string) {
        console.log(`[Twilio Notification] Sending to all students in bootcamp ${bootcampId}: ${message}`);

        // In a real app, you would call a Supabase Edge Function or your backend here
        // example: await fetch(`${EDGE_FUNCTION_URL}/send-sms`, { method: 'POST', body: JSON.stringify({ bootcampId, message }) });

        // Mock success for UI feedback
        return { success: true, count: 24 };
    },

    // LIGHTNING SPRINTS (AI + CAL.COM)
    async setSprintReadiness(userId: string, isReady: boolean) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('profiles').update({ is_sprint_ready: isReady }).eq('id', userId).select();
        if (error) throw error;
        return data ? data[0] : null;
    },

    async getReadyTutors(bootcampId: string) {
        if (!checkEnv()) return [];
        const { data: bc } = await supabase.from('bootcamps').select('instructor_id').eq('id', bootcampId).single();
        if (!bc) return [];

        const { data } = await supabase.from('profiles')
            .select('*')
            .eq('id', bc.instructor_id)
            .eq('is_sprint_ready', true);

        return data || [];
    },

    async createLightningSprint(bootcampId: string, title: string, context: string) {
        if (!checkEnv()) return null;
        const session = {
            bootcamp_id: bootcampId,
            title: `Lightning Sprint: ${title}`,
            description: "High-intensity 1-on-1 sprint triggered by AI analysis.",
            is_lightning_sprint: true,
            context_ai: context,
            join_url: `https://meet.bootcamp.elite/sprint-${Math.random().toString(36).substr(2, 6)}`,
            duration_minutes: 10,
            start_time: new Date().toISOString()
        };
        const { data, error } = await supabase.from('sessions').insert([session]).select();
        if (error) throw error;
        return data[0];
    },

    // SUBMISSIONS & AI AUDITS
    async submitAssignment(submission: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('submissions').insert([submission]).select();
        if (error) throw error;
        return data[0];
    },

    async updateSubmission(submissionId: string, updates: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('submissions').update(updates).eq('id', submissionId).select();
        if (error) throw error;
        return data[0];
    },

    async getStudentSubmissions(studentId: string, bootcampId: string) {
        if (!checkEnv()) return [];
        const { data } = await supabase
            .from('submissions')
            .select('*')
            .eq('student_id', studentId)
            .eq('bootcamp_id', bootcampId)
            .order('created_at', { ascending: false });
        return data || [];
    }
};
