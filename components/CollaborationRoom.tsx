
import React, { useState, useEffect } from 'react';
import Whiteboard from './Whiteboard';
import { DataService } from '../services/dataService';
import { supabase } from '../supabaseClient';
import { User } from '../types';
import LightningSprintTracker from './LightningSprintTracker';
import LectureRoom from './LectureRoom';
import SubmissionJourney from './SubmissionJourney';
import { auditAssignment } from '../services/gemini';

interface CollaborationRoomProps {
  user: User;
  roomId?: string;
  category?: string;
}

const CollaborationRoom: React.FC<CollaborationRoomProps> = ({ user, roomId = 'default-room', category = 'General' }) => {
  const [activeTab, setActiveTab] = useState<'board' | 'tasks' | 'submissions'>('board');
  const [collabNotes, setCollabNotes] = useState<Array<{ user: string; text: string; id: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [activeSprint, setActiveSprint] = useState<any>(null);

  const [submissionData, setSubmissionData] = useState({
    repoUrl: '',
    demoUrl: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Load collaboration messages
  useEffect(() => {
    const loadMessages = async () => {
      const data = await DataService.getCollaborationMessages(roomId);
      const formatted = data.map((m: any) => ({
        id: m.id,
        user: m.sender_name,
        text: m.content
      }));
      setCollabNotes(formatted);
    };
    loadMessages();

    // Subscribe to real-time collaboration messages
    const channel = supabase
      .channel(`collab_${roomId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'collaboration_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newNote = {
            id: payload.new.id,
            user: payload.new.sender_name,
            text: payload.new.content
          };
          setCollabNotes(prev => [...prev, newNote]);
        }
      )
      .subscribe();

    const loadSubmission = async () => {
      if (user.role === 'student') {
        const subs = await DataService.getStudentSubmissions(user.id, roomId);
        if (subs.length > 0) setCurrentSubmission(subs[0]);
      }
    };
    loadSubmission();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Optimistic update
    const tempNote = {
      id: Date.now().toString(),
      user: user.name,
      text: chatInput
    };
    setCollabNotes(prev => [...prev, tempNote]);
    setChatInput('');

    // Send to database
    await DataService.sendCollaborationMessage({
      room_id: roomId,
      sender_id: user.id,
      sender_name: user.name,
      content: chatInput,
      message_type: 'text'
    });
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.bootcampId) return;

    setIsSubmitting(true);

    try {
      // 1. Save initial submission
      const sub = await DataService.submitAssignment({
        bootcamp_id: user.bootcampId,
        student_id: user.id,
        repo_url: submissionData.repoUrl,
        demo_url: submissionData.demoUrl,
        notes: submissionData.notes,
        status: 'pending'
      });

      setCurrentSubmission(sub);
      setIsSubmitting(false);
      setIsAuditing(true);

      // 2. Trigger AI Pre-flight Audit
      const audit = await auditAssignment(submissionData.repoUrl, submissionData.notes, category);

      if (audit) {
        const updated = await DataService.updateSubmission(sub.id, {
          ai_feedback: audit.feedback,
          score_meter: audit.scoreMeter,
          status: 'ai_audited'
        });
        setCurrentSubmission(updated);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsAuditing(false);
      setSubmissionData({ repoUrl: '', demoUrl: '', notes: '' });
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Project: Cloud Architect</h2>
          <p className="text-slate-500 mt-1 font-medium">Shared Team Workspace • Active: Alex, Emily, Sarah (Tutor)</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-3xl border border-slate-100 shadow-sm">
          {[
            { id: 'board', label: 'Whiteboard' },
            { id: 'tasks', label: 'Project Tasks' },
            { id: 'submissions', label: 'Submit Work' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {activeTab === 'board' && (
          <div className="flex-1 flex gap-8">
            <div className="flex-1 h-full">
              <Whiteboard roomId={roomId} />
            </div>
            <div className="w-80 flex flex-col gap-6">
              <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Live Activity Feed</h3>
                <div className="flex-1 space-y-6 overflow-y-auto mb-4">
                  {collabNotes.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8">No messages yet. Start the conversation!</p>
                  ) : (
                    collabNotes.map((n) => (
                      <div key={n.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 animate-fadeIn">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{n.user}</p>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendNote} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-black mb-2 text-xl tracking-tight">Real-time Sync</h4>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed">You are collaborating in a low-latency environment. Every stroke is synced.</p>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-2xl border-4 border-slate-900 bg-indigo-500 flex items-center justify-center text-[10px] font-black">
                        {['A', 'E', 'S', 'J'][i - 1]}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="flex-1 overflow-y-auto pb-20">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Elite Kanban Board</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Manage team sprints and critical bottlenecks.</p>
              </div>
              <button className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                New Sprint Task
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {['Pending', 'In Progress', 'Completed'].map(status => (
                <div key={status} className="flex flex-col gap-6">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${status === 'In Progress' ? 'bg-indigo-600' : status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      {status}
                    </h4>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {[
                        { title: 'System Architecture', status: 'In Progress', owner: 'Alex', priority: 'High', desc: 'Define the VPC and subnets for the AWS deployment.' },
                        { title: 'User Auth Flow', status: 'Pending', owner: 'Emily', priority: 'Medium', desc: 'Implement Cognito or custom JWT solution.' },
                        { title: 'Database Migrations', status: 'Completed', owner: 'Sarah', priority: 'Critical', desc: 'Initial schema for Users and Projects table.' },
                        { title: 'Frontend UI Scaffold', status: 'In Progress', owner: 'Team', priority: 'Low', desc: 'Set up Tailwind and layout components.' }
                      ].filter(t => t.status === status).length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'System Architecture', status: 'In Progress', owner: 'Alex', priority: 'High', desc: 'Define the VPC and subnets for the AWS deployment.' },
                      { title: 'User Auth Flow', status: 'Pending', owner: 'Emily', priority: 'Medium', desc: 'Implement Cognito or custom JWT solution.' },
                      { title: 'Database Migrations', status: 'Completed', owner: 'Sarah', priority: 'Critical', desc: 'Initial schema for Users and Projects table.' },
                      { title: 'Frontend UI Scaffold', status: 'In Progress', owner: 'Team', priority: 'Low', desc: 'Set up Tailwind and layout components.' }
                    ].filter(t => t.status === status).map((item, i) => (
                      <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-600 transition-all group relative overflow-hidden">
                        {item.priority === 'Critical' && (
                          <div className="absolute top-0 right-0 w-16 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${item.priority === 'Critical' ? 'bg-red-50 text-red-600' :
                            item.priority === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-500'
                            }`}>
                            {item.priority} Priority
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100">
                            {item.owner[0]}
                          </div>
                        </div>
                        <h5 className="text-base font-black text-slate-900 mb-2 leading-tight">{item.title}</h5>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6">{item.desc}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-[10px] font-black text-indigo-600/50 uppercase tracking-widest text-xs">Manage</span>
                          <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="flex-1 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto pb-20">
            {currentSubmission && (
              <SubmissionJourney
                status={currentSubmission.status}
                scoreMeter={currentSubmission.score_meter || 0}
              />
            )}

            {currentSubmission?.ai_feedback && (
              <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group animate-fadeIn">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-100">Elite AI Pre-flight Audit</span>
                  </div>
                  <h4 className="text-2xl font-black mb-4">Immediate Feedback Report</h4>
                  <p className="text-indigo-50 text-lg leading-relaxed font-medium mb-8 max-w-3xl">
                    "{currentSubmission.ai_feedback}"
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-indigo-200">Suggested Refinements</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          Ensure README has setup instructions
                        </li>
                        <li className="flex items-center gap-2 text-sm font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          Check for sensitive keys in public scripts
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-900 mb-2">
                  {currentSubmission ? 'Resubmit Assignment' : 'Final Assignment Submission'}
                </h3>
                <p className="text-slate-500 font-medium">Ready to turn in your work? Provide your links below for tutor evaluation.</p>
              </div>

              <form onSubmit={handleSubmission} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Project Link</label>
                    <input
                      required
                      type="url"
                      value={submissionData.repoUrl}
                      onChange={e => setSubmissionData({ ...submissionData, repoUrl: e.target.value })}
                      placeholder="Link to your work (Behance, GitHub, Drive...)"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">External Preview (Optional)</label>
                    <input
                      type="url"
                      value={submissionData.demoUrl}
                      onChange={e => setSubmissionData({ ...submissionData, demoUrl: e.target.value })}
                      placeholder="Live link, demo, or presentation URL"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Self-Reflection & Notes</label>
                  <textarea
                    rows={5}
                    value={submissionData.notes}
                    onChange={e => setSubmissionData({ ...submissionData, notes: e.target.value })}
                    placeholder="Tell us about your challenges and what you're most proud of in this project..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-sm font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isAuditing}
                  className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-[2rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting || isAuditing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {isAuditing ? 'AI is auditing your work...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {currentSubmission ? 'Update Submission' : 'Confirm Submission'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-3xl">🏆</span>
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900">Elite Certification Track</h4>
                  <p className="text-sm text-indigo-700 font-medium">Successful submission puts you on track for the engineering certificate and priority hire pool.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Lightning Sprint Monitor */}
      {user.bootcampId && (
        <LightningSprintTracker
          user={user}
          bootcampId={user.bootcampId}
          messages={collabNotes}
          onSprintJoined={(session) => setActiveSprint(session)}
        />
      )}

      {/* Sprint Video Modal */}
      {activeSprint && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col">
          <div className="absolute top-8 right-8 z-[110]">
            <button
              onClick={() => setActiveSprint(null)}
              className="px-6 py-2 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-2xl"
            >
              Exit Sprint
            </button>
          </div>
          <LectureRoom
            user={user}
            bootcampId={user.bootcampId || ''}
            isTutor={user.role === 'tutor'}
          />
        </div>
      )}
    </div>
  );
};

export default CollaborationRoom;
