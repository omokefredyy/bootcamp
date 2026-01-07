
import React, { useState } from 'react';
import { User, BootcampUpdate, BootcampMaterial, BootcampData } from '../types';
import { BOOTCAMP_UPDATES, BOOTCAMP_MATERIALS } from '../constants';

interface TutorDashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const TutorDashboard: React.FC<TutorDashboardProps> = ({ user, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRegistering, setIsRegistering] = useState(!user.bootcampData);
  
  const [regForm, setRegForm] = useState<BootcampData>(user.bootcampData || {
    title: '',
    description: '',
    category: 'Web Development',
    price: 499
  });

  // Derived stats based on pricing and mock data
  const students = 124;
  const grossRevenue = students * regForm.price;
  const platformFee = grossRevenue * 0.10;
  const netRevenue = grossRevenue - platformFee;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = { 
      ...user, 
      bootcampData: regForm, 
      bootcampId: 'bc_' + Math.random().toString(36).substr(2, 5) 
    };
    onUpdateUser(updatedUser);
    setIsRegistering(false);
  };

  const renderRegistration = () => (
    <div className="max-w-2xl mx-auto py-12 animate-fadeIn">
      <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Instructor Access: No Charge</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your Bootcamp Awaits.</h2>
          <p className="text-slate-500 font-medium">Launch your first academy. We only take a 10% fee when you make a sale. Everything else is free.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bootcamp Title</label>
            <input 
              required
              type="text"
              value={regForm.title}
              onChange={e => setRegForm({...regForm, title: e.target.value})}
              placeholder="e.g. Master React & Node.js"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Niche Category</label>
              <select 
                value={regForm.category}
                onChange={e => setRegForm({...regForm, category: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
              >
                <option>Web Development</option>
                <option>Data Science</option>
                <option>Mobile Apps</option>
                <option>Cybersecurity</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enrolment Price ($)</label>
              <input 
                required
                type="number"
                value={regForm.price}
                onChange={e => setRegForm({...regForm, price: Number(e.target.value)})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">The Pitch (Description)</label>
            <textarea 
              required
              rows={4}
              value={regForm.description}
              onChange={e => setRegForm({...regForm, description: e.target.value})}
              placeholder="Describe what makes your curriculum elite..."
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium resize-none"
            />
          </div>

          <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
             <div className="mt-1">
               <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <div>
                <p className="text-xs text-indigo-900 font-bold mb-1 uppercase tracking-tight">Platform Economics</p>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  We take 10% on every enrolment to fund your students' AI Scribe, Whiteboards, and Live feeds. You keep 90%. Your payout per student: <strong>${(regForm.price * 0.9).toFixed(2)}</strong>
                </p>
             </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-[2rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all active:scale-95"
          >
            Go to Instructor Dashboard
          </button>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isRegistering) return renderRegistration();

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-10 animate-fadeIn">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Academy Console 👨‍🏫</h2>
                <p className="text-slate-500 mt-2 text-lg font-medium">Active: <span className="text-indigo-600">{regForm.title}</span></p>
              </div>
              <button 
                onClick={() => setIsRegistering(true)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                Modify Academy Settings
              </button>
            </header>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Enrollments</p>
                <p className="text-3xl font-black text-slate-900">${grossRevenue.toLocaleString()}</p>
                <div className="mt-4 text-[10px] font-bold text-emerald-500">+12% this month</div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Platform Fee (10%)</p>
                <p className="text-3xl font-black text-indigo-400">-${platformFee.toLocaleString()}</p>
                <div className="mt-4 text-[10px] font-bold text-slate-500 uppercase italic">Powering AI Scribe & Tools</div>
              </div>
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white">
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2">Net Payout</p>
                <p className="text-3xl font-black">${netRevenue.toLocaleString()}</p>
                <button className="mt-4 text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all">Withdraw Fund</button>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Student Count</p>
                <p className="text-3xl font-black text-slate-900">{students}</p>
                <div className="mt-4 flex -space-x-2">
                   {[1,2,3,4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Engagement Metrics
                  </h3>
                  <div className="h-48 bg-slate-50 rounded-2xl flex items-end justify-between px-8 pb-4">
                     {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                       <div key={i} className="w-6 bg-indigo-600 rounded-t-lg transition-all hover:bg-indigo-700" style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
                  <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6">Active participation last 7 days</p>
               </div>

               <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                    Live Interaction
                  </h3>
                  <div className="space-y-6">
                    {[
                      { name: 'Alex Johnson', action: 'watching module: Fiber Architecture', time: 'Active' },
                      { name: 'Emily Chen', action: 'drawing on Collab Board', time: 'Active' },
                      { name: 'Marcus Miller', action: 'asking AI Tutor: useMemo hooks', time: 'Active' }
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">{activity.name[0]}</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{activity.name}</p>
                          <p className="text-xs text-slate-500">{activity.action}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                           <span className="text-[10px] text-emerald-500 font-black uppercase">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        );
      case 'updates':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
               <h2 className="text-3xl font-black text-slate-900">Announcements</h2>
               <button className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                 New Blast
               </button>
            </header>
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="pb-6 px-4">Subject</th>
                        <th className="pb-6 px-4">Sent</th>
                        <th className="pb-6 px-4">Type</th>
                        <th className="pb-6 px-4">Reach</th>
                        <th className="pb-6 px-4">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                    {BOOTCAMP_UPDATES.map(up => (
                      <tr key={up.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 px-4 font-bold text-slate-800">{up.title}</td>
                        <td className="py-6 px-4 text-sm text-slate-500">{up.date}</td>
                        <td className="py-6 px-4">
                           <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-tighter">{up.category}</span>
                        </td>
                        <td className="py-6 px-4 text-slate-500 font-bold text-xs uppercase">89% Open</td>
                        <td className="py-6 px-4">
                           <button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        );
      case 'materials':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
               <h2 className="text-3xl font-black text-slate-900">Syllabus Resources</h2>
               <button className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                 Upload New
               </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {BOOTCAMP_MATERIALS.map(m => (
                 <div key={m.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start gap-6 group hover:border-indigo-200 transition-all">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                       <span className="text-[10px] font-black uppercase">{m.type}</span>
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-900 mb-1">{m.title}</h4>
                       <p className="text-xs text-slate-500 mb-4">{m.description}</p>
                       <div className="flex gap-4">
                          <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Config</button>
                          <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Delete</button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-300">Feature Coming Soon</h3>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Tutor Specific */}
      <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 z-50 overflow-y-auto border-r border-slate-800 scrollbar-hide">
        <div className="p-8 sticky top-0 bg-slate-900 z-10">
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tighter">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 transform -rotate-3">
              <span className="text-white font-black text-sm">BE</span>
            </div>
            Tutor Hub
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 mb-8">
          {[
            { id: 'overview', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { id: 'updates', label: 'Announcements', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
            { id: 'materials', label: 'Curriculum', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { id: 'students', label: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { id: 'wallet', label: 'Earnings', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <svg className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50 mt-auto sticky bottom-0 bg-slate-900">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-12 min-h-screen overflow-y-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TutorDashboard;
