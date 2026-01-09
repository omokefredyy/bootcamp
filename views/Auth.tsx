import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../supabaseClient';

interface AuthProps {
  onAuthComplete: (user: User) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let authUser;
      let profile;

      if (isLogin) {
        // ============================================
        // LOGIN FLOW
        // ============================================
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (signInError) throw signInError;
        authUser = data.user;

        // Fetch existing profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser?.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error('Profile not found. Please contact support.');
        }
        
        profile = profileData;

      } else {
        // ============================================
        // SIGNUP FLOW (FIXED)
        // ============================================
        
        // Step 1: Sign up with metadata (this triggers the database trigger)
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: role
            }
          }
        });

        if (signUpError) throw signUpError;
        authUser = data.user;

        if (!authUser) {
          throw new Error('Signup failed. Please try again.');
        }

        // Step 2: Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 3: Try to fetch the profile (created by trigger)
        let retries = 3;
        let profileData = null;
        
        while (retries > 0 && !profileData) {
          const { data: fetchedProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (fetchedProfile) {
            profileData = fetchedProfile;
            break;
          }

          if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 = row not found (expected during retries)
            console.error('Profile fetch error:', fetchError);
          }

          retries--;
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Step 4: If trigger didn't work, manually create profile
        if (!profileData) {
          console.warn('Trigger failed, manually creating profile...');
          
          const newProfile = {
            id: authUser.id,
            email: formData.email,
            name: formData.name,
            role: role,
            avatar_url: null
          };

          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (insertError) {
            console.error('Manual profile creation error:', insertError);
            throw new Error(`Failed to create profile: ${insertError.message}`);
          }

          profileData = insertedProfile;
        }

        profile = profileData;
      }

      // ============================================
      // SUCCESS - Create App User Object
      // ============================================
        if (authUser && profile) {
      const appUser: User = {
    id: authUser.id,
    name: profile.name || formData.name,
    email: profile.email || formData.email,
    isPaid: false,
    role: profile.role || role,
    tier: null
  };
  
  // Show success message
  if (!isLogin) {
    alert(`✅ Welcome to Bootcamp Elite, ${formData.name}! Your account has been created successfully.`);
  } else {
    console.log('✅ Login successful');
  }
  
  onAuthComplete(appUser);
}
    } catch (err: any) {
      console.error('❌ Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp">
        {/* Header */}
        <div className="p-10 bg-indigo-600 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">
              {isLogin ? 'Welcome Back' : 'Join Elite'}
            </h2>
            <p className="text-indigo-100 text-sm font-medium">
              Elevate your engineering career today.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}

          {/* Role Selector - Only show during signup */}
          {!isLogin && (
            <div className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    role === 'student' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-400'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('tutor')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    role === 'tutor' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-400'
                  }`}
                >
                  Instructor
                </button>
              </div>
              {role === 'tutor' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 animate-fadeIn">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Free to join for instructors
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Name Input - Only for signup */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                required
                type="text"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              required
              type="email"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              required
              type="password"
              minLength={6}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? 'Processing...' 
              : isLogin 
                ? 'Sign In' 
                : role === 'tutor' 
                  ? 'Create Free Account' 
                  : 'Create Account'
            }
          </button>

          {/* Toggle Login/Signup */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-indigo-600 font-black uppercase tracking-widest hover:underline"
            >
              {isLogin ? "Need an account? Sign up" : "Already registered? Sign in"}
            </button>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-600 pt-4"
          >
            ← Back to home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;