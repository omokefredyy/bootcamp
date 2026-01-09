import React, { useState, useEffect } from 'react';
import Landing from './views/Landing';
import Auth from './views/Auth';
import Paywall from './views/Paywall';
import Dashboard from './views/Dashboard';
import TutorDashboard from './views/TutorDashboard';
import { User } from './types';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'paywall' | 'dashboard' | 'tutor_dashboard'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing Supabase session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Check if user is already logged in via Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch profile from database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setLoading(false);
          return;
        }

        if (profile) {
          const appUser: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            isPaid: false, // TODO: Check actual payment status from enrollments
            role: profile.role,
            tier: null,
            avatar_url: profile.avatar_url
          };

          setUser(appUser);

          // Route based on role
          if (profile.role === 'tutor') {
            setView('tutor_dashboard');
          } else {
            // For students, check if they have paid enrollments
            const { data: enrollments } = await supabase
              .from('enrollments')
              .select('status')
              .eq('student_email', profile.email)
              .eq('status', 'Paid');

            if (enrollments && enrollments.length > 0) {
              appUser.isPaid = true;
              appUser.tier = 'full-access';
              setUser(appUser);
              setView('dashboard');
            } else {
              setView('paywall');
            }
          }
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setView('auth');
  };

  const handleAuthComplete = (newUser: User) => {
    setUser(newUser);
    
    // Tutors go straight to their dashboard - NO PAYWALL
    if (newUser.role === 'tutor') {
      setView('tutor_dashboard');
    } else {
      // Students go to paywall (unless already paid - handled in checkSession)
      setView('paywall');
    }
  };

  const handlePaymentSuccess = async () => {
    if (!user) return;

    // In a real app, this would create an enrollment record after payment
    // For now, we'll just update the local user state
    const updatedUser: User = { 
      ...user, 
      isPaid: true, 
      tier: 'full-access' 
    };
    setUser(updatedUser);
    setView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setView('landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading spinner while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Bootcamp Elite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased selection:bg-indigo-100">
      {view === 'landing' && <Landing onStart={handleStart} />}
      
      {view === 'auth' && (
        <Auth 
          onAuthComplete={handleAuthComplete} 
          onBack={() => setView('landing')} 
        />
      )}
      
      {view === 'paywall' && (
        <Paywall 
          onSuccess={handlePaymentSuccess} 
          onCancel={handleLogout} 
        />
      )}
      
      {view === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          onUpdateUser={handleUpdateUser}
        />
      )}
      
      {view === 'tutor_dashboard' && user && (
        <TutorDashboard 
          user={user} 
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default App;