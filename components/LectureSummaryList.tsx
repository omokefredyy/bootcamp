import React, { useState, useEffect } from 'react';
import { summarizeLecture } from '../services/gemini';
import { Lecture, LectureSummary, Session } from '../types';
import { DataService } from '../services/dataService';

interface LectureSummaryListProps {
  bootcampId?: string;
}

const LectureSummaryList: React.FC<LectureSummaryListProps> = ({ bootcampId }) => {
  const [summaries, setSummaries] = useState<LectureSummary[]>([]);
  const [lectures, setLectures] = useState<Session[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const loadLectures = async () => {
      if (bootcampId) {
        const data = await DataService.getSessions(bootcampId);
        setLectures(data);
      }
    };
    loadLectures();
  }, [bootcampId]);
  useEffect(() => {
    const saved = localStorage.getItem('lecture_summaries');
    if (saved) setSummaries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('lecture_summaries', JSON.stringify(summaries));
  }, [summaries]);

  const handleSummarize = async (lecture: Session) => {
    if (!lecture.transcript) {
      alert("No transcript available for this session.");
      return;
    }
    setLoadingId(lecture.id);
    const result = await summarizeLecture(lecture.title, lecture.transcript);
    if (result) {
      const newSummary: LectureSummary = {
        lectureId: lecture.id,
        summary: result.summary,
        keyPoints: result.keyPoints,
        generatedAt: Date.now()
      };
      setSummaries(prev => [newSummary, ...prev.filter(s => s.lectureId !== lecture.id)]);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {lectures.map(lecture => {
          const summary = summaries.find(s => s.lectureId === lecture.id);
          const isLoading = loadingId === lecture.id;

          return (
            <div key={lecture.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{lecture.title}</h3>
                  <p className="text-slate-500 text-sm">{lecture.instructor} • {new Date(lecture.date).toLocaleDateString()}</p>
                </div>
                {!summary && (
                  <button
                    onClick={() => handleSummarize(lecture)}
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
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Takeaways</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {summary.keyPoints.map((point, idx) => (
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
                    <button onClick={() => setSummaries(prev => prev.filter(s => s.lectureId !== lecture.id))} className="text-xs text-slate-400 hover:text-red-500">Regenerate</button>
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
