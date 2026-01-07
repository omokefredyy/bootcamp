
import React, { useState } from 'react';
import Whiteboard from './Whiteboard';

const CollaborationRoom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'board' | 'tasks' | 'submissions'>('board');
  const [collabNotes, setCollabNotes] = useState([
    { user: 'Emily', text: 'Working on the authentication flow.' },
    { user: 'Alex', text: 'I added the database schema to the board.' }
  ]);

  const [submissionData, setSubmissionData] = useState({
    repoUrl: '',
    demoUrl: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Assignment submitted successfully! Our tutors will review it shortly.');
      setIsSubmitting(false);
      setSubmissionData({ repoUrl: '', demoUrl: '', notes: '' });
    }, 1500);
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
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'
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
              <Whiteboard />
            </div>
            <div className="w-80 flex flex-col gap-6">
              <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-y-auto">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Live Activity Feed</h3>
                <div className="space-y-6">
                  {collabNotes.map((n, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 animate-fadeIn">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{n.user}</p>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-black mb-2 text-xl tracking-tight">Real-time Sync</h4>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed">You are collaborating in a low-latency environment. Every stroke is synced.</p>
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-2xl border-4 border-slate-900 bg-indigo-500 flex items-center justify-center text-[10px] font-black">
                         {['A', 'E', 'S', 'J'][i-1]}
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
          <div className="flex-1 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Shared Team Backlog</h3>
              <button className="px-6 py-2 bg-indigo-50 text-indigo-600 text-xs font-black uppercase rounded-xl hover:bg-indigo-600 hover:text-white transition-all">Add Task</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'System Architecture', status: 'In Progress', owner: 'Alex', desc: 'Define the VPC and subnets for the AWS deployment.' },
                { title: 'User Auth Flow', status: 'Pending', owner: 'Emily', desc: 'Implement Cognito or custom JWT solution.' },
                { title: 'Database Migrations', status: 'Completed', owner: 'Sarah (Tutor)', desc: 'Initial schema for Users and Projects table.' },
                { title: 'Frontend UI Scaffold', status: 'In Progress', owner: 'Team', desc: 'Set up Tailwind and layout components.' }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'In Progress' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned: {item.owner}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">{item.desc}</p>
                  <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition-all text-xs uppercase tracking-widest">
                    Manage Task
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="flex-1 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-900 mb-2">Final Assignment Submission</h3>
                <p className="text-slate-500 font-medium">Ready to turn in your work? Provide your links below for tutor evaluation.</p>
              </div>

              <form onSubmit={handleSubmission} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GitHub Repository URL</label>
                    <input 
                      required
                      type="url"
                      value={submissionData.repoUrl}
                      onChange={e => setSubmissionData({...submissionData, repoUrl: e.target.value})}
                      placeholder="https://github.com/..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Demo URL</label>
                    <input 
                      required
                      type="url"
                      value={submissionData.demoUrl}
                      onChange={e => setSubmissionData({...submissionData, demoUrl: e.target.value})}
                      placeholder="https://project.vercel.app"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Self-Reflection & Notes</label>
                  <textarea 
                    rows={5}
                    value={submissionData.notes}
                    onChange={e => setSubmissionData({...submissionData, notes: e.target.value})}
                    placeholder="Tell us about your challenges and what you're most proud of in this project..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-sm font-medium resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-[2rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Submitting for Review...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Turn in Assignment
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
    </div>
  );
};

export default CollaborationRoom;
