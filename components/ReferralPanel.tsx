
import React from 'react';
import { User } from '../types';

interface ReferralPanelProps {
  user: User;
}

const ReferralPanel: React.FC<ReferralPanelProps> = ({ user }) => {
  const referralCode = `ELITE-${user.name.toUpperCase().slice(0, 3)}-2024`;
  
  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Grow with your friends.</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              Invite your friends to join Bootcamp Elite. For every friend who signs up using your code, 
              you get <span className="text-indigo-600 font-bold">$100 cashback</span> and they get a 10% discount.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl flex items-center justify-between">
                <span className="font-mono font-bold text-slate-700">{referralCode}</span>
                <button onClick={copyCode} className="text-indigo-600 font-bold text-xs uppercase hover:underline">Copy Code</button>
              </div>
              <button onClick={copyCode} className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                Invite Friends
              </button>
            </div>
          </div>
          <div className="w-64 h-64 bg-indigo-50 rounded-full flex items-center justify-center relative">
             <div className="text-center">
                <p className="text-5xl font-black text-indigo-600 mb-1">3</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Successful Referrals</p>
             </div>
             <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center transform rotate-12">
               <span className="text-2xl">🎁</span>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
          <h3 className="text-xl font-bold mb-6">Your Earnings</h3>
          <div className="flex items-end gap-2 mb-8">
            <span className="text-5xl font-black">$300</span>
            <span className="text-slate-400 text-sm font-medium mb-2">Total Cashback</span>
          </div>
          <button className="w-full py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
            Redeem Rewards
          </button>
        </div>
        <div className="bg-indigo-50 p-10 rounded-[2.5rem] border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { name: 'Michael Chen', date: '2 days ago', reward: '$100' },
              { name: 'Sofia Rodriguez', date: '1 week ago', reward: '$100' },
              { name: 'James Wilson', date: '2 weeks ago', reward: '$100' }
            ].map((ref, i) => (
              <div key={i} className="flex justify-between items-center bg-white/50 p-4 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-900">{ref.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{ref.date}</p>
                </div>
                <span className="font-black text-emerald-600">{ref.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPanel;
