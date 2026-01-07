
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AITutor from '../components/AITutor';
import TaskManager from '../components/TaskManager';
import LectureRoom from '../components/LectureRoom';
import LectureSummaryList from '../components/LectureSummaryList';
import Profile from '../components/Profile';
import GlobalChat from '../components/GlobalChat';
import DirectMessages from '../components/DirectMessages';
import CollaborationRoom from '../components/CollaborationRoom';
import ReferralPanel from '../components/ReferralPanel';
import { BOOTCAMP_UPDATES, BOOTCAMP_MATERIALS, BOOTCAMP_SCHEDULE } from '../constants';
import { User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMeetingActive, setIsMeetingActive] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-10 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Focus on the prize, {user.name.split(' ')[0]}. 🚀</h2>
                <p className="text-slate-500 mt-2 text-lg">You are on the <span className="font-bold text-indigo-600">Elite Pathway</span>. {34}% of curriculum complete.</p>
              </div>
              <div 
                onClick={() => setActiveTab('lecture')}
                className="group cursor-pointer bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 hover:border-indigo-300 transition-all transform hover:-translate-y-1"
              >
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">LIVE NOW</p>
                  <p className="font-bold text-slate-800">Advanced React Flow</p>
                </div>
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg shadow-indigo-100/50">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Project Milestones', value: '4/12', color: 'bg-indigo-600' },
                { label: 'Community Karma', value: '750', color: 'bg-emerald-500' },
                { label: 'Daily Streak', value: '14 Days', color: 'bg-amber-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{stat.value}</p>
                  <div className="mt-8 h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: '70%' }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    Board Announcements
                  </h3>
                  <button onClick={() => setActiveTab('updates')} className="text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-8">
                  {BOOTCAMP_UPDATES.slice(0, 2).map((up) => (
                    <div key={up.id} className="group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">{up.category}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{up.date}</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{up.title}</h4>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{up.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">Collaborate & Build</h3>
                  <p className="text-slate-400 mb-10 leading-relaxed">
                    Don't code alone. Join your team in the Collaboration Room or chat with the community to solve blockers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setActiveTab('collab')}
                      className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                      Enter Team Room
                    </button>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      Community Chat
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>
              </div>
            </div>
          </div>
        );
      case 'lecture':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              Lecture Hall
              {isMeetingActive && <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-full animate-pulse">Live</span>}
            </h2>
            {isMeetingActive ? (
              <LectureRoom isTutor={user.role === 'tutor' || true} />
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm text-center px-10">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                  <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Quiet on Set.</h3>
                <p className="text-slate-500 max-w-md mb-10 text-lg">No active lecture found. The instructor hasn't opened the meeting yet.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setIsMeetingActive(true)}
                    className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    Simulate Join Call
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'collab':
        return <CollaborationRoom />;
      case 'chat':
        return <GlobalChat user={user} />;
      case 'messages':
        return <DirectMessages user={user} />;
      case 'referral':
        return <ReferralPanel user={user} />;
      case 'notes':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">AI Session Summaries</h2>
            <LectureSummaryList />
          </div>
        );
      case 'profile':
        return <Profile user={user} onUpdate={onUpdateUser} />;
      case 'updates':
        return (
          <div className="space-y-6 max-w-4xl animate-fadeIn">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">Bootcamp Updates</h2>
            {BOOTCAMP_UPDATES.map((up) => (
              <div key={up.id} className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    up.category === 'Announcement' ? 'bg-indigo-100 text-indigo-700' :
                    up.category === 'Schedule' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {up.category}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">{up.date}</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6">{up.title}</h3>
                <p className="text-slate-600 leading-relaxed text-xl">{up.content}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <main className="flex-1 ml-64 p-12 min-h-screen overflow-y-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto pb-20">
          {renderContent()}
        </div>
      </main>
      
      {/* Floating AI Assistant Trigger */}
      <button 
        onClick={() => setActiveTab('chat')}
        className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 text-white rounded-3xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>
    </div>
  );
};

export default Dashboard;
