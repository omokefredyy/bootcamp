
import React, { useState, useEffect, useRef } from 'react';
import Whiteboard from './Whiteboard';
import VideoConference from './VideoConference';

interface LectureRoomProps {
  isTutor?: boolean;
  sessionId?: string;
  userName?: string;
}

const LectureRoom: React.FC<LectureRoomProps> = ({ isTutor = false, sessionId, userName = 'User' }) => {
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [useRealVideo, setUseRealVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [scribeNotes, setScribeNotes] = useState<string[]>([]);
  const scribeRef = useRef<HTMLDivElement>(null);

  // Simulated AI Scribe behavior
  useEffect(() => {
    const simulationPoints = [
      "AI Scribe: Listening to lecture...",
      "Instructor: 'Today we discuss React Reconciliation...'",
      "Capture: The Virtual DOM is a lightweight copy of the real DOM.",
      "Instructor: 'Use useMemo carefully to avoid memory overhead.'",
      "Analysis: Optimization techniques for high-performance React apps.",
      "Instructor: 'The new useTransition hook handles UI responsiveness.'",
      "Live Note: Key takeaway - Batching is now default in React 18."
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < simulationPoints.length) {
        setScribeNotes(prev => [...prev, simulationPoints[count]]);
        count++;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scribeRef.current) {
      scribeRef.current.scrollTop = scribeRef.current.scrollHeight;
    }
  }, [scribeNotes]);

  // If using real video and sessionId is provided
  if (useRealVideo && sessionId) {
    return <VideoConference channelName={sessionId} userName={userName} onLeave={() => setUseRealVideo(false)} />;
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      <div className="flex-1 flex gap-4 p-4 relative min-h-0">
        {/* Main Content Area */}
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
          {showWhiteboard ? (
            <div className="w-full h-full p-4 animate-scaleUp">
              <div className="flex justify-between items-center mb-4 text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Presenting: Shared Canvas
                </h3>
                <button onClick={() => setShowWhiteboard(false)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors">
                  Switch to Video
                </button>
              </div>
              <Whiteboard />
            </div>
          ) : (
            <div className="w-full h-full relative">
              <img
                src={isScreenSharing ? "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200" : "https://images.unsplash.com/photo-1573163231162-8067345742a4?auto=format&fit=crop&q=80&w=1200"}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isScreenSharing ? 'opacity-80' : 'opacity-40'}`}
                alt="Lecture Feed"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-t from-slate-950 via-transparent to-transparent">
                {!isScreenSharing && (
                  <>
                    <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2">React 18: Fiber Architecture</h2>
                    <p className="text-slate-400 max-w-md mb-4">Streaming live from HQ Room 12-A</p>
                    {sessionId && (
                      <button
                        onClick={() => setUseRealVideo(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
                      >
                        Join Live Video Call
                      </button>
                    )}
                  </>
                )}
                {isScreenSharing && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Screen Share Active
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI Scribe Side Panel */}
        <div className="w-80 flex flex-col gap-4">
          <div className="flex-1 bg-slate-950/80 rounded-2xl flex flex-col border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-indigo-500/10 flex items-center justify-between">
              <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                AI Live Note Scribe
              </h4>
            </div>
            <div ref={scribeRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
              {scribeNotes.map((note, i) => (
                <div key={i} className="animate-fadeIn p-3 bg-white/5 rounded-xl border border-white/5 text-slate-300 leading-relaxed">
                  <span className="text-indigo-500/50 mr-2 opacity-50">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  {note}
                </div>
              ))}
            </div>
            <div className="p-4 bg-white/5">
              <button
                className="w-full py-3 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
                onClick={() => alert('Live summary archived!')}
              >
                Finalize & Save Transcript
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=instructor" alt="Instructor" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Sarah Drasner</p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Presenter</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </button>
          <button onClick={() => setIsCameraOff(!isCameraOff)} className={`p-4 rounded-2xl transition-all ${isCameraOff ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>

          {/* Presenter Controls */}
          {isTutor && (
            <>
              <div className="w-px h-8 bg-slate-800 mx-2"></div>
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-4 rounded-2xl transition-all ${isScreenSharing ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                title="Share Screen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </button>
              <button
                onClick={() => setShowWhiteboard(!showWhiteboard)}
                className={`p-4 rounded-2xl transition-all ${showWhiteboard ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                title="Whiteboard"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </>
          )}
        </div>

        <button className="px-10 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">
          End Session
        </button>
      </div>
    </div>
  );
};

export default LectureRoom;
