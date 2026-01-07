
import React, { useState } from 'react';

interface PaywallProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onSuccess();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-20">
      <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Plan Details */}
        <div className="md:w-1/2 p-12 bg-indigo-600 text-white">
          <h2 className="text-4xl font-black mb-6">Master Fullstack Development</h2>
          <p className="text-indigo-100 mb-8 leading-relaxed">Join our comprehensive 12-week bootcamp and gain lifetime access to all future cohorts, materials, and our AI Tutor network.</p>
          
          <div className="space-y-6 mb-12">
            {[
              '12 Weeks Intensive Curriculum',
              'Personalized AI Career Tutor',
              'Collaborative Live Scribe Notes',
              'Private Community Access',
              'Certificate of Engineering Excellence'
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-indigo-500/50">
            <div className="text-6xl font-black mb-2">$999</div>
            <p className="text-indigo-200 text-sm">One-time payment. Lifetime access.</p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="md:w-1/2 p-12 bg-white">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h3>
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cardholder Name</label>
              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Card Details</label>
              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Expiry</label>
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="MM/YY" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">CVV</label>
                <input required type="password" size={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="***" />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all flex items-center justify-center"
            >
              {isProcessing ? (
                <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Pay $999 Now'
              )}
            </button>
            <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest">SSL Secure & Encrypted</p>
          </form>
          <button onClick={onCancel} className="w-full mt-6 text-slate-400 text-sm hover:text-slate-600">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
