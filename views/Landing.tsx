
import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-10">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em]">The Engineering Marketplace</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
              Build. Teach. <br />
              <span className="text-indigo-600">Elevate.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-medium">
              Bootcamp Elite is the premier platform for world-class developers to teach and ambitious learners to master fullstack engineering.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onStart}
                className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transform hover:-translate-y-1 transition-all active:scale-95"
              >
                Start Learning
              </button>
              <button 
                onClick={onStart}
                className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-2xl shadow-slate-200 transform hover:-translate-y-1 transition-all active:scale-95"
              >
                Become an Instructor
              </button>
            </div>
            
            <p className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Instructors keep 90% of revenue • Automated platform management
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-indigo-50/50 rounded-full blur-[120px] -z-10 opacity-60"></div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Active Students', value: '12K+' },
              { label: 'Elite Tutors', value: '450+' },
              { label: 'Avg. Salary Hike', value: '85%' },
              { label: 'Tutor Revenue', value: '$2M+' }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Tutors Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-20">
             <div className="flex-1">
                <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Launch your own academy in minutes.</h2>
                <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                   We handle the hosting, the payments, the AI Scribe notes, and the collaborative whiteboard. You focus on what you do best: <strong>teaching.</strong>
                </p>
                <ul className="space-y-4 mb-10">
                   {[
                     'Direct student-to-tutor payouts',
                     'Customizable curriculum builder',
                     'Integrated AI Tutor for your students',
                     'Robust analytics and growth tracking'
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                        <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                        </div>
                        {item}
                     </li>
                   ))}
                </ul>
                <button onClick={onStart} className="text-indigo-600 font-black uppercase tracking-widest text-sm hover:underline">See Tutor Commission Model →</button>
             </div>
             <div className="flex-1 bg-slate-900 p-12 rounded-[4rem] shadow-3xl text-white">
                <div className="space-y-8">
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Platform Power</p>
                      <h4 className="text-xl font-bold">Instructors keep 90%</h4>
                      <p className="text-xs text-slate-400 mt-2">Transparent fee structure. We only win when you win.</p>
                   </div>
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">AI Integration</p>
                      <h4 className="text-xl font-bold">Live AI Scribe</h4>
                      <p className="text-xs text-slate-400 mt-2">Our AI automatically generates lecture notes while you teach.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
