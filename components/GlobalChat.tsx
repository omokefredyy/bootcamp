import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User } from '../types';
import { DataService } from '../services/dataService';

interface GlobalChatProps {
  user: User;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll for new messages every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await DataService.getChatMessages(100);
      const formatted: ChatMessage[] = data.map((m: any) => ({
        id: m.id,
        sender: m.sender_name,
        text: m.message, // FIXED: was m.content, now m.message
        timestamp: new Date(m.created_at).getTime(),
        role: m.sender_id === user.id ? 'user' : 'model'
      }));
      setMessages(formatted);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    } finally {
      setLoading(false);
    }
  };

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
    setMessages([...messages, newMsgDisplay]);
    setInput('');

    try {
      await DataService.sendChatMessage({
        sender_id: user.id,
        sender_name: user.name,
        message: input // FIXED: was content, now message
      });
      
      // Reload messages to get the real ID from database
      setTimeout(loadMessages, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-180px)] flex items-center justify-center bg-white rounded-3xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-fadeIn">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
        <div>
          <h3 className="text-xl font-bold text-slate-900">#community-lounge</h3>
          <p className="text-xs text-slate-500 font-medium">Chat with all students and tutors in real-time.</p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
            +{messages.length}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === user.name ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.sender}</span>
                <span className="text-[10px] text-slate-300">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
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
          ))
        )}
      </div>

      {/* Input Form */}
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
            disabled={!input.trim()}
            className="px-8 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GlobalChat;