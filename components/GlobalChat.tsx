
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';

interface GlobalChatProps {
  user: User;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', text: 'Welcome to the Bootcamp Community Chat!', timestamp: Date.now() - 100000, role: 'system' },
    { id: '2', sender: 'Sarah Drasner', text: 'Great work on the React assignments, everyone!', timestamp: Date.now() - 50000, role: 'model' },
    { id: '3', sender: 'Alex Johnson', text: 'Does anyone have a minute to look at my GraphQL schema?', timestamp: Date.now() - 20000, role: 'user' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: user.name,
      text: input,
      timestamp: Date.now(),
      role: 'user'
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-fadeIn">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
        <div>
          <h3 className="text-xl font-bold text-slate-900">#community-lounge</h3>
          <p className="text-xs text-slate-500 font-medium">Chat with all students and tutors in real-time.</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
            +42
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.sender === user.name ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.sender}</span>
              <span className="text-[10px] text-slate-300">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm ${
              m.sender === user.name 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : m.role === 'system' 
                  ? 'bg-slate-100 text-slate-500 italic text-xs' 
                  : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-6 border-t border-slate-100 bg-white">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to the community..."
            className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
          <button
            type="submit"
            className="px-8 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            Send
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GlobalChat;
