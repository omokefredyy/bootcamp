import React, { useState, useEffect } from 'react';

interface SubmissionJourneyProps {
    status: 'pending' | 'ai_audited' | 'reviewed' | 'completed';
    scoreMeter: number;
}

const SubmissionJourney: React.FC<SubmissionJourneyProps> = ({ status, scoreMeter }) => {
    const steps = [
        { id: 'pending', label: 'Submitted', subtext: 'Received by Academy', icon: '📤' },
        { id: 'ai_audited', label: 'AI Audit', subtext: 'Pre-flight Feedback', icon: '🤖' },
        { id: 'reviewed', label: 'Evaluation', subtext: 'Tutor Review', icon: '👨‍🏫' },
        { id: 'completed', label: 'Certified', subtext: 'Result Released', icon: '🏆' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === status);

    return (
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden relative group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Submission Journey</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1">Real-time status of your evaluation.</p>
                </div>

                {/* Elite Score Gauge */}
                <div className="flex items-center gap-6 bg-slate-50 px-8 py-4 rounded-[2.5rem] border border-slate-100">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-200" strokeWidth="3" />
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-600 transition-all duration-1000" strokeWidth="3" strokeDasharray={`${scoreMeter}, 100`} />
                        </svg>
                        <span className="absolute text-xs font-black text-indigo-600">{scoreMeter}%</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness Score</p>
                        <p className="text-sm font-bold text-slate-800">{scoreMeter > 80 ? 'Elite Standard' : 'Rising Talent'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Connection Line */}
                <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-100 -translate-y-1/2 z-0">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-1000"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>

                {steps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border-2 border-slate-100 text-slate-300'
                                    } ${isCurrent ? 'animate-pulse scale-110' : ''}`}
                            >
                                {step.icon}
                            </div>
                            <div className="mt-4">
                                <p className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                                    {step.label}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">{step.subtext}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubmissionJourney;
