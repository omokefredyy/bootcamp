
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: 'Aspiring Fullstack Engineer at Bootcamp Elite. Passionate about React, AI, and scalable systems.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...user, name: formData.name, email: formData.email });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-indigo-50 border-4 border-white shadow-xl overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-black text-slate-900">{user.name}</h2>
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                {user.tier} Plan
              </span>
            </div>
            <p className="text-slate-500 mb-4">{user.email}</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">Cohort 2024</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">Student #BE-2024-001</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Professional Bio</label>
            <textarea 
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white overflow-hidden relative">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2 relative z-10">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Account Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-bold mb-2">Billing & Subscription</h4>
            <p className="text-sm text-slate-400 mb-4">You are currently on the {user.tier} plan. Your access expires May 2025.</p>
            <button className="text-indigo-400 text-sm font-bold hover:underline">View Invoices →</button>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
            <h4 className="font-bold mb-2">Data & Privacy</h4>
            <p className="text-sm text-slate-400 mb-4">Manage your data or download a full report of your bootcamp progress.</p>
            <button className="text-indigo-400 text-sm font-bold hover:underline">Download Data →</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>
    </div>
  );
};

export default Profile;
