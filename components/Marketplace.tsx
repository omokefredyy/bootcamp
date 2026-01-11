import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Bootcamp, User } from '../types';

interface MarketplaceProps {
    user: User;
    onRegister: (bootcamp: Bootcamp) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ user, onRegister }) => {
    const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBootcamps = async () => {
            // Fetch all bootcamps (we'll need a method for this in DataService)
            try {
                const data = await DataService.getAllBootcamps();
                setBootcamps(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBootcamps();
    }, []);

    const filtered = bootcamps.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Explore Bootcamps</h2>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Find your next expertise. Accelerate your career with Elite tracks.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search category, instructor or tech..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-8 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none pl-14 font-medium"
                    />
                    <svg className="w-6 h-6 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Curating Excellence...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((bc) => (
                        <div key={bc.id} className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col">
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                <img
                                    src={`https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={bc.title}
                                />
                                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                    {bc.category}
                                </div>
                            </div>

                            <div className="p-10 flex-1 flex flex-col">
                                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                    {bc.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 font-medium">
                                    {bc.description}
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                    <div>
                                        <p className="text-3xl font-black text-slate-900">${bc.price}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">One-time payment</p>
                                    </div>
                                    <button
                                        onClick={() => onRegister(bc)}
                                        className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-2xl font-black text-slate-900">No bootcamps found</h3>
                            <p className="text-slate-500 mt-2">Try searching for something else like "Web" or "Design"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
