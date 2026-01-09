
import React, { useState, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { DataService } from '../services/dataService';
import { supabase } from '../supabaseClient';

interface DMProps {
  user: User;
}

const DirectMessages: React.FC<DMProps> = ({ user }) => {
  const [activeContact, setActiveContact] = useState({ name: 'Sarah Drasner (Tutor)', id: 't1' });
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [input, setInput] = useState('');
  const [contacts] = useState([
    { name: 'Sarah Drasner (Tutor)', id: 't1', online: true },
    { name: 'Dan Abramov (Tutor)', id: 't2', online: false },
    { name: 'Admissions Support', id: 't3', online: true },
  ]);

  // Load messages for active contact
  useEffect(() => {
    const loadMessages = async () => {
      const data = await DataService.getDirectMessages(user.id, activeContact.id);
      const formatted: ChatMessage[] = data.map((m: any) => ({
        id: m.id,
        sender: m.sender_id === user.id ? user.name : m.sender_name,
        text: m.content,
        timestamp: new Date(m.created_at).getTime(),
        role: m.sender_id === user.id ? 'user' : 'model'
      }));
      setMessages(prev => ({ ...prev, [activeContact.id]: formatted }));
    };
    loadMessages();

    // Subscribe to real-time updates for this conversation
    const channel = supabase
      .channel(`dm_${user.id}_${activeContact.id}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${activeContact.id}),and(sender_id.eq.${activeContact.id},receiver_id.eq.${user.id}))`
        },
        (payload) => {
          const newMsg: ChatMessage = {
            id: payload.new.id,
            sender: payload.new.sender_id === user.id ? user.name : payload.new.sender_name,
            text: payload.new.content,
            timestamp: new Date(payload.new.created_at).getTime(),
            role: payload.new.sender_id === user.id ? 'user' : 'model'
          };
          setMessages(prev => ({
            ...prev,
            [activeContact.id]: [...(prev[activeContact.id] || []), newMsg]
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeContact.id, user.id, user.name]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsgDisplay: ChatMessage = {
      id: Date.now().toString(),
      sender: user.name,
      text: input,
      timestamp: Date.now(),
      role: 'user'
    };

    // Optimistic update
    setMessages(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsgDisplay]
    }));
    setInput('');

    // Send to database
    await DataService.sendDirectMessage({
      sender_id: user.id,
      receiver_id: activeContact.id,
      sender_name: user.name,
      receiver_name: activeContact.name,
      content: input
    });
  };

  return (
    <div className="h-[calc(100vh-180px)] flex bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-fadeIn">
      {/* Contact List */}
      <div className="w-80 border-r border-slate-100 bg-slate-50/50">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Private Messages</h3>
        </div>
        <div className="p-2 space-y-1">
          {[
            { name: 'Sarah Drasner (Tutor)', id: 't1', online: true },
            { name: 'Dan Abramov (Tutor)', id: 't2', online: false },
            { name: 'Admissions Support', id: 't3', online: true },
          ].map(contact => (
            <button
              key={contact.id}
              onClick={() => setActiveContact(contact)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeContact.id === contact.id ? 'bg-white shadow-sm border border-slate-100' : 'hover:bg-white/50'
                }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} alt="avatar" />
                </div>
                {contact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="text-left overflow-hidden">
                <p className={`text-sm font-bold truncate ${activeContact.id === contact.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                  {contact.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Click to message</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
            {activeContact.name[0]}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{activeContact.name}</h3>
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Now</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {(messages[activeContact.id] || []).map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === user.name ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[60%] px-5 py-3 rounded-2xl text-sm ${m.sender === user.name
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-indigo-50 text-indigo-900 rounded-tl-none border border-indigo-100'
                }`}>
                {m.text}
              </div>
              <span className="text-[10px] text-slate-300 mt-2">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-6 border-t border-slate-100">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${activeContact.name}...`}
              className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="px-8 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
            >
              Send DM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectMessages;
