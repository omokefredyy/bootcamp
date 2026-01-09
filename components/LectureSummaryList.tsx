import React, { useState, useEffect } from 'react';
import { summarizeLecture } from '../services/gemini';
import { LectureSummary, Session } from '../types';
import { DataService } from '../services/dataService';

interface LectureSummaryListProps {
  bootcampId?: string;
}

const LectureSummaryList: React.FC<LectureSummaryListProps> = ({ bootcampId }) => {
  const [summaries, setSummaries] = useState<LectureSummary[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [bootcampId]);

  const loadData = async () => {
    if (!bootcampId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Load sessions
      const sessionsData = await DataService.getSessions(bootcampId);
      setSessions(sessionsData);

      // Load summaries from database
      const summariesData = await DataService.getLectureSummaries(bootcampId);
      setSummaries(summariesData);
    } catch (error) {
      console.error('Error loading lecture data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (session: Session) => {
    // For demo purposes, we'll generate a summary even without transcript
    // In production, you'd check if transcript exists
    
    setLoadingId(session.id);
    
    try {
      // If no transcript, create a mock one based on session info
      const mockTranscript = `This session covered ${session.title}. ${session.description || 'The instructor discussed key concepts and practical applications.'}`;
      
      const result = await summarizeLecture(session.title, mockTranscript);
      
      if (result) {
        // Save to database
        const newSummary = {
          session_id: session.id,
          bootcamp_id: bootcampId,
          title: session.title,
          summary: result.summary,
          key_points: result.keyPoints
        };

        const created = await DataService.createLectureSummary(newSummary);
        
        if (created) {
          setSummaries(prev => [created, ...prev.filter(s => s.session_id !== session.id)]);
          alert('✅ AI summary generated successfully!');
        }
      }
    } catch (error: any) {
      console.error('Error generating summary:', error);
      alert(`Failed to generate summary: ${error.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRegenerate = async (session: Session) => {
    // Remove old summary and regenerate
    const oldSummary = summaries.find(s => s.session_id === session.id);
    if (oldSummary) {
      setSummaries(prev => prev.filter(s => s.session_id !== session.id));
    }
    await handleSummarize(session);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading lecture summaries...</p>
        </div>
      </div>
    );
  }

  if (!bootcampId) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">No bootcamp selected</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">No sessions scheduled yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {sessions.map(session => {
          const summary = summaries.find(s => s.session_id === session.id);
          const isLoading = loadingId === session.id;

          return (
            <div key={session.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{session.title}</h3>
                  <p className="text-slate-500 text-sm">
                    {new Date(session.start_time).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {session.description && ` • ${session.description}`}
                  </p>
                </div>
                {!summary && (
                  <button
                    onClick={() => handleSummarize(session)}
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        AI Summarizing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate AI Notes
                      </>
                    )}
                  </button>
                )}
              </div>

              {summary ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-indigo-900 text-sm leading-relaxed italic">
                      "{summary.summary}"
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                      Technical Takeaways
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {summary.key_points.map((point, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-[10px] font-bold text-indigo-600">
                            {idx + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleRegenerate(session)} 
                      className="text-xs text-slate-400 hover:text-indigo-600 font-bold uppercase tracking-widest"
                    >
                      Regenerate Summary
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm">No summary generated yet. Click above to get AI notes.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LectureSummaryList;