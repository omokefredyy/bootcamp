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

    async createBootcamp(bootcamp: any) {
        if (!checkEnv()) return null;
        const { data, error } = await supabase.from('bootcamps').insert([bootcamp]).select();
        if (error) throw error;
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
    }
};
