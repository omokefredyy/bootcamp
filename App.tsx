
import React, { useState, useEffect } from 'react';
import Landing from './views/Landing';
import Auth from './views/Auth';
import Paywall from './views/Paywall';
import Dashboard from './views/Dashboard';
import TutorDashboard from './views/TutorDashboard';
import { User } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'paywall' | 'dashboard' | 'tutor_dashboard'>('landing');
  const [user, setUser] = useState<User | null>(null);

  // Load persistence from local storage
  useEffect(() => {
    const saved = localStorage.getItem('bootcamp_auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      if (parsed.role === 'tutor') {
        setView('tutor_dashboard');
      } else {
        if (parsed.isPaid) {
          setView('dashboard');
        } else {
          setView('paywall');
        }
      }
    }
  }, []);

  const handleStart = () => {
    setView('auth');
  };

  const handleAuthComplete = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('bootcamp_auth', JSON.stringify(newUser));
    
    // Tutors go straight to their dashboard - NO PAYWALL for instructors
    if (newUser.role === 'tutor') {
      setView('tutor_dashboard');
    } else {
      // Students go to the paywall unless already paid (mock)
      setView('paywall');
    }
  };

  const handlePaymentSuccess = () => {
    if (!user) return;
    const updatedUser: User = { 
      ...user, 
      isPaid: true, 
      tier: 'full-access' 
    };
    setUser(updatedUser);
    localStorage.setItem('bootcamp_auth', JSON.stringify(updatedUser));
    setView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('bootcamp_auth', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('bootcamp_auth');
    setUser(null);
    setView('landing');
  };

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
          onCancel={() => setView('landing')} 
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
