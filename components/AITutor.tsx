
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/gemini';
import { AIChatMessage } from '../types';

const AITutor: React.FC = () => {
  // Fix: Use AIChatMessage instead of ChatMessage to correctly reflect the Gemini content structure (role and parts)
  const [messages, setMessages] = useState<AIChatMessage[]>([
    { role: 'model', parts: [{ text: "Hi there! I'm your Bootcamp AI Tutor. How can I help you with your learning journey today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Fix: Use the correctly typed userMsg with 'parts' property
    const userMsg: AIChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.concat(userMsg);
    const aiText = await getAIResponse(history);

    setMessages(prev => [...prev, { role: 'model', parts: [{ text: aiText || "I'm having a bit of a brain fog. Try again?" }] }]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col glass rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold">Elite AI Tutor</h3>
            <p className="text-xs text-indigo-100">Always active</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100'
                : 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100'
              }`}>
              {m.parts[0].text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-slate-400 text-sm flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-75">.</span>
              <span className="animate-bounce delay-150">.</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about the bootcamp..."
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;