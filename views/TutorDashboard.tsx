
import React, { useState } from 'react';
import { User, BootcampUpdate, BootcampMaterial, BootcampData, Session, Bootcamp } from '../types';
import { DataService } from '../services/dataService';

interface TutorDashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const TutorDashboard: React.FC<TutorDashboardProps> = ({ user, onLogout, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // State for Real Data
  const [courseStudents, setCourseStudents] = useState<any[]>([]);
  const [materials, setMaterials] = useState<BootcampMaterial[]>([]);
  const [updates, setUpdates] = useState<BootcampUpdate[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Initialize with ownedBootcamps if available
  const [myBootcamps, setMyBootcamps] = useState<Bootcamp[]>(user.ownedBootcamps || []);

  const [isRegistering, setIsRegistering] = useState(myBootcamps.length === 0);
  const [balance, setBalance] = useState(0);

  const [regForm, setRegForm] = useState<BootcampData>(user.bootcampData || {
    title: '',
    description: '',
    category: 'Web Development',
    price: 499
  });

  // Fetch Data Effect
  React.useEffect(() => {
    const loadData = async () => {
      // If we have a selected bootcamp, fetch its data
      if (user.bootcampId) {
        const [sts, mats, ups, sess] = await Promise.all([
          DataService.getStudents(user.bootcampId),
          DataService.getMaterials(user.bootcampId),
          DataService.getUpdates(user.bootcampId),
          DataService.getSessions(user.bootcampId)
        ]);

        setCourseStudents(sts as any);
        setMaterials(mats as BootcampMaterial[]);
        setUpdates(ups as BootcampUpdate[]);
        setSessions(sess as Session[]);

        // Calculate revenue dynamically
        const revenue = (sts as any).filter((s: any) => s.status === 'Paid').length * regForm.price;
        setBalance(prev => revenue > 0 ? revenue * 0.9 : 0); // Simple mock balance logic for now
      }
    };
    loadData();
  }, [user.bootcampId, regForm.price]);


  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    description: ''
  });

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.bootcampId) return;

    const session: any = {
      bootcamp_id: user.bootcampId,
      title: newSession.title,
      start_time: `${newSession.date}T${newSession.time}`, // ISO format for DB
      duration_minutes: newSession.duration,
      description: newSession.description,
      join_url: `https://meet.bootcamp.elite/${Math.random().toString(36).substr(2, 6)}`,
      attendees_count: 0
    };

    // Optimistic Update
    const displaySession = {
      ...session,
      id: Math.random().toString(), // Temp ID
      date: newSession.date,
      time: newSession.time
    };
    setSessions([...sessions, displaySession]);

    await DataService.createSession(session);

    setShowScheduleModal(false);
    alert(`Session Scheduled!`);
    setNewSession({ title: '', date: '', time: '', duration: 60, description: '' });
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm("Are you sure you want to cancel this session?")) {
      setSessions(sessions.filter(s => s.id !== sessionId));
      await DataService.deleteSession(sessionId);
    }
  };

  const paidStudents = courseStudents.filter(s => s.status === 'Paid');
  const studentCount = paidStudents.length;

  const grossRevenue = studentCount * regForm.price;
  const platformFee = grossRevenue * 0.10;
  const netRevenue = grossRevenue - platformFee;



  const handleWithdraw = () => {
    if (balance <= 0) {
      alert("No funds available to withdraw.");
      return;
    }
    if (window.confirm(`Are you sure you want to withdraw $${balance.toLocaleString()} to your connected account?`)) {
      alert(`Withdrawal of $${balance.toLocaleString()} initiated successfully! It will arrive in 2-3 business days.`);
      setBalance(0);
    }
  };

  const handleCreateBootcamp = () => {
    // Reset form for new bootcamp
    setRegForm({
      title: '',
      description: '',
      category: 'Web Development',
      price: 499
    });
    setIsRegistering(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBootcampId = `bc_${Date.now()}`;
    const newBootcamp = {
      id: newBootcampId,
      instructor_id: user.id, // Ensure snake_case for Supabase
      title: regForm.title,
      description: regForm.description,
      price: regForm.price,
      category: regForm.category,
      enrolled_students: 0,
    };

    // Optimistic
    setMyBootcamps([...myBootcamps, newBootcamp as any]);

    // Persist
    await DataService.createBootcamp(newBootcamp);

    const updatedUser: User = {
      ...user,
      bootcampData: regForm,
      bootcampId: newBootcampId,
      ownedBootcamps: [...myBootcamps, newBootcamp as any]
    };

    onUpdateUser(updatedUser);
    setIsRegistering(false);
    setActiveTab('overview');
  };

  const switchToBootcamp = (bc: any) => {
    setRegForm({
      title: bc.title,
      description: bc.description,
      price: bc.price,
      category: bc.category
    });
    const updatedUser: User = {
      ...user,
      bootcampData: {
        title: bc.title,
        description: bc.description,
        price: bc.price,
        category: bc.category
      },
      bootcampId: bc.id
    };
    onUpdateUser(updatedUser);
    setActiveTab('overview');
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
              onChange={e => setRegForm({ ...regForm, title: e.target.value })}
              placeholder="e.g. Master React & Node.js"
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Niche Category</label>
              <select
                value={regForm.category}
                onChange={e => setRegForm({ ...regForm, category: e.target.value })}
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
                onChange={e => setRegForm({ ...regForm, price: Number(e.target.value) })}
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
              onChange={e => setRegForm({ ...regForm, description: e.target.value })}
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
              <button
                onClick={handleCreateBootcamp}
                className="ml-4 px-6 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Create New Bootcamp
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
                <button onClick={handleWithdraw} className="mt-4 text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all">Withdraw Fund</button>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Student Count</p>
                <p className="text-3xl font-black text-slate-900">{studentCount}</p>
                <div className="mt-4 flex -space-x-2">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>)}
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
                  {updates.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">No updates yet. Send your first blast!</td></tr>
                  ) : (
                    updates.map(up => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'sessions':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Live Sessions</h2>
                <p className="text-slate-500 mt-2 font-medium">Manage your video conferences and office hours.</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Schedule New Session
              </button>
            </header>

            {showScheduleModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fadeIn">
                <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl relative animate-scaleUp">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="absolute top-6 right-6 text-slate-300 hover:text-slate-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <h3 className="text-2xl font-black text-slate-900 mb-6">Schedule Session</h3>

                  <form onSubmit={handleScheduleSession} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic</label>
                      <input
                        required
                        type="text"
                        value={newSession.title}
                        onChange={e => setNewSession({ ...newSession, title: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700"
                        placeholder="e.g. Weekly Code Review"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                        <input
                          required
                          type="date"
                          value={newSession.date}
                          onChange={e => setNewSession({ ...newSession, date: e.target.value })}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                        <input
                          required
                          type="time"
                          value={newSession.time}
                          onChange={e => setNewSession({ ...newSession, time: e.target.value })}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (min)</label>
                      <select
                        value={newSession.duration}
                        onChange={e => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none font-bold text-slate-700"
                      >
                        <option value={30}>30 Minutes</option>
                        <option value={60}>1 Hour</option>
                        <option value={90}>1.5 Hours</option>
                        <option value={120}>2 Hours</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
                    >
                      Send Invites
                    </button>
                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map(session => (
                <div key={session.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="text-right">
                      <span className="block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase mb-2">{(session as any).date || session.date} • {(session as any).time || session.time}</span>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="text-[10px] font-black uppercase text-red-400 hover:text-red-600 tracking-widest"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{session.title}</h4>
                  <p className="text-slate-500 text-sm mb-6 flex-1">{session.description}</p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>)}
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">+{session.attendees}</div>
                    </div>
                    <a
                      href={session.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      Start
                    </a>
                  </div>
                </div>
              ))}
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
              {materials.length === 0 ? (
                <div className="col-span-2 py-10 text-center text-slate-400">No materials uploaded yet.</div>
              ) : (
                materials.map(m => (
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
                ))
              )}
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Student Roster</h2>
                <p className="text-slate-500 mt-2 font-medium">Tracking {studentCount} active learners.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">
                  Export CSV
                </button>
                <button className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                  Invite Student
                </button>
              </div>
            </header>

            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="pb-6 px-4">Student</th>
                    <th className="pb-6 px-4">Status</th>
                    <th className="pb-6 px-4">Joined</th>
                    <th className="pb-6 px-4">Progress</th>
                    <th className="pb-6 px-4">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {courseStudents.map(student => (
                    <tr key={student.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            {student.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{student.name}</div>
                            <div className="text-xs text-slate-400">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${student.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                          student.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-sm text-slate-500 font-medium">
                        {student.joinedDate}
                      </td>
                      <td className="py-6 px-4">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${student.progress}%` }}></div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1">{student.progress}%</div>
                      </td>
                      <td className="py-6 px-4 font-bold text-slate-900">
                        ${student.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Earnings & Wallet</h2>
                <p className="text-slate-500 mt-2 font-medium">Manage your payouts and transactions.</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10">
                  <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-2">Available Balance</p>
                  <p className="text-5xl font-black mb-8">${balance.toLocaleString()}</p>

                  <div className="flex gap-4">
                    <button onClick={handleWithdraw} className="px-6 py-3 bg-white text-indigo-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                      Withdraw to Bank
                    </button>
                    <button className="px-6 py-3 bg-indigo-500/50 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500/70 transition-all border border-indigo-400/30">
                      View Statements
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Next Payout</p>
                <p className="text-2xl font-black text-slate-900 mb-1">Friday, May 24</p>
                <p className="text-sm text-slate-500">Scheduled automatically</p>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                {[
                  { id: 1, type: 'Enrollment', user: 'Charlie Davis', amount: `+$${regForm.price}`, date: '2 hours ago', status: 'Cleared' },
                  { id: 2, type: 'Enrollment', user: 'Alice Freeman', amount: `+$${regForm.price}`, date: '5 hours ago', status: 'Cleared' },
                  { id: 3, type: 'Platform Fee', user: 'System', amount: `-$${(regForm.price * 0.1).toFixed(0)}`, date: '5 hours ago', status: 'Deducted' },
                  { id: 4, type: 'Withdrawal', user: 'Bank Transfer', amount: '-$1,200.00', date: 'May 12, 2024', status: 'Processed' },
                ].map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.amount.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {t.amount.startsWith('+') ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{t.type} - {t.user}</p>
                        <p className="text-xs text-slate-500">{t.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black ${t.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-900'}`}>{t.amount}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{t.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-900">Instructor Profile</h2>
              <button className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200">
                Edit Profile
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="md:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                <div className="flex items-start gap-8">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-100 border-4 border-white shadow-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-indigo-300">
                      {user.name ? user.name[0] : 'T'}
                    </div>
                    {/* Mock Image Placeholder */}
                    {/* <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" /> */}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{user.name}</h3>
                    <p className="text-slate-500 font-bold mb-4">{user.email}</p>
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-tighter">Verified Instructor</span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-tighter">Top Rated</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-lg mb-6">
                      Senior software engineer with 10+ years of experience in distributed systems and frontend architecture. Passionate about teaching the next generation of developers.
                    </p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="block font-black text-slate-900 text-lg">4.9/5</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</span>
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 text-lg">{studentCount}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Students</span>
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 text-lg">12</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Courses</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Wallet in Profile */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
                <div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Earnings Wallet</h4>
                  <p className="text-4xl font-black mb-2">${balance.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 font-medium">Available for withdrawal</p>
                </div>

                <div className="mt-8 space-y-3">
                  <button onClick={handleWithdraw} className="w-full py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95">
                    Withdraw Now
                  </button>
                  <button onClick={() => setActiveTab('wallet')} className="w-full py-3 bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all">
                    View History
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h4 className="text-xl font-black text-slate-900 mb-6">Credentials & Socials</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-700 shadow-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      </div>
                      <span className="font-bold text-slate-700">github.com/tutor-dev</span>
                    </div>
                    <button className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">Connect</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                      </div>
                      <span className="font-bold text-slate-700">youtube.com/c/code-master</span>
                    </div>
                    <button className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">Connect</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h4 className="text-xl font-black text-slate-900 mb-6">Payment Settings</h4>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Connected Bank Account</label>
                    <div className="mt-2 p-4 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">VISA</div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Chase Bank **** 4242</p>
                          <p className="text-xs text-slate-400">Expires 12/28</p>
                        </div>
                      </div>
                      <button className="text-indigo-600 font-bold text-xs uppercase">Edit</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payout Frequency</label>
                    <select className="w-full mt-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-600 outline-none font-bold text-slate-700 text-sm">
                      <option>Weekly (Fridays)</option>
                      <option>Bi-Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'bootcamps':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-900">My Bootcamps</h2>
                <p className="text-slate-500 mt-2 font-medium">Manage and switch between your academies.</p>
              </div>
              <button
                onClick={handleCreateBootcamp}
                className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Launch New
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBootcamps.map((bc: any) => {
                // Calculate stats dynamically for this specific bootcamp
                const studentsForBc = MOCK_STUDENTS.filter(s => s.bootcampId === bc.id);
                const studentCountBc = studentsForBc.length;
                const revenueBc = studentCountBc * bc.price;

                return (
                  <div key={bc.id} onClick={() => switchToBootcamp(bc)} className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${user.bootcampId === bc.id ? 'bg-slate-900 border-slate-900 shadow-2xl text-white' : 'bg-white border-slate-100 hover:border-indigo-300 shadow-sm text-slate-900'}`}>
                    {user.bootcampId === bc.id && <div className="absolute top-0 right-0 py-1 px-3 bg-emerald-500 text-white text-[10px] font-black rounded-bl-xl uppercase tracking-widest">Active</div>}

                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${user.bootcampId === bc.id ? 'bg-white/10 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                        {bc.title[0]}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.bootcampId === bc.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{bc.category}</span>
                    </div>

                    <h3 className="text-xl font-black mb-2 line-clamp-1">{bc.title}</h3>
                    <p className={`text-sm mb-6 line-clamp-2 ${user.bootcampId === bc.id ? 'text-slate-400' : 'text-slate-500'}`}>{bc.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-2xl ${user.bootcampId === bc.id ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${user.bootcampId === bc.id ? 'text-slate-400' : 'text-slate-400'}`}>Students</p>
                        <p className="text-2xl font-black">{studentCountBc}</p>
                      </div>
                      <div className={`p-4 rounded-2xl ${user.bootcampId === bc.id ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${user.bootcampId === bc.id ? 'text-slate-400' : 'text-slate-400'}`}>Est. Rev</p>
                        <p className="text-2xl font-black">${revenueBc.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
            { id: 'bootcamps', label: 'My Bootcamps', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { id: 'updates', label: 'Announcements', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
            { id: 'materials', label: 'Curriculum', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            { id: 'students', label: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { id: 'sessions', label: 'Live Sessions', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
            { id: 'wallet', label: 'Earnings', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
            { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${activeTab === item.id
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
