import React, { useState, useEffect } from 'react';
import { analyzeStruggle } from '../services/gemini';
import { DataService } from '../services/dataService';
import { User } from '../types';

interface LightningSprintTrackerProps {
    user: User;
    bootcampId: string;
    messages: Array<{ user: string; text: string }>;
    onSprintJoined: (session: any) => void;
}

const LightningSprintTracker: React.FC<LightningSprintTrackerProps> = ({ user, bootcampId, messages, onSprintJoined }) => {
    const [suggestion, setSuggestion] = useState<{ topic: string, breakdown: string } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [availableTutor, setAvailableTutor] = useState<any>(null);

    // Analyze messages every 5 new messages or after a significant pause
    useEffect(() => {
        if (messages.length > 0 && messages.length % 3 === 0) {
            triggerAnalysis();
        }
    }, [messages.length]);

    const triggerAnalysis = async () => {
        if (isAnalyzing || suggestion) return;

        setIsAnalyzing(true);
        const context = messages.slice(-5).map(m => `${m.user}: ${m.text}`).join('\n');

        try {
            const result = await analyzeStruggle(context);

            if (result.isStruggling) {
                // Check if a tutor is actually ready before showing the WOW suggestion
                const tutors = await DataService.getReadyTutors(bootcampId);
                if (tutors.length > 0) {
                    setAvailableTutor(tutors[0]);
                    setSuggestion({ topic: result.topic, breakdown: result.breakdown });
                }
            }
        } catch (err) {
            console.error("Sprint Trigger Error:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleJoinSprint = async () => {
        if (!suggestion || !availableTutor) return;

        try {
            const session = await DataService.createLightningSprint(
                bootcampId,
                suggestion.topic,
                suggestion.breakdown
            );

            if (session) {
                onSprintJoined(session);
                setSuggestion(null);
            }
        } catch (err) {
            alert("Flash Sprint failed to initialize. Try again.");
        }
    };

    if (!suggestion) return null;

    return (
        <div className="fixed bottom-10 right-10 z-[60] animate-bounce-subtle">
            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-[0_30px_100px_rgba(99,102,241,0.5)] border border-white/10 max-w-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-indigo-600/40">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">AI Lightning Sprint</span>
                    </div>

                    <h4 className="text-xl font-black mb-2 leading-tight">Stuck on {suggestion.topic}?</h4>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">
                        Tutor <span className="text-white font-bold">{availableTutor.name}</span> is available for a **10-minute lightning breakdown** right now.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={handleJoinSprint}
                            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
                        >
                            Jump In ⚡
                        </button>
                        <button
                            onClick={() => setSuggestion(null)}
                            className="px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
                        >
                            Ignore
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LightningSprintTracker;
