
import React from 'react';
import { UserProfile, DashboardCard, MaslowLevel } from '../types';
import { MASLOW_HIERARCHY } from '../constants';

interface DashboardProps {
  profile: UserProfile;
  cards: DashboardCard[];
  isLoading: boolean;
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, cards, isLoading, onRefresh }) => {
  const currentLevelIndex = MASLOW_HIERARCHY.indexOf(profile.currentLevel);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header & Status */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800">Peace be with you, {profile.name}</h2>
          <p className="text-slate-500 mt-2 max-w-lg">
            Your journey toward <span className="italic font-medium text-indigo-600">{MASLOW_HIERARCHY[MASLOW_HIERARCHY.length - 1]}</span> is unfolding. 
            Here is what the Sage recommends for your current state.
          </p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <i className={`fa-solid fa-rotate ${isLoading ? 'animate-spin' : ''}`}></i>
          Recalibrate
        </button>
      </header>

      {/* Maslow Progress */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
          <i className="fa-solid fa-mountain-sun text-orange-400"></i>
          The Path of Needs
        </h3>
        <div className="relative flex justify-between items-center px-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-10"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-400 to-indigo-600 -translate-y-1/2 -z-10 transition-all duration-1000"
            style={{ width: `${(currentLevelIndex / (MASLOW_HIERARCHY.length - 1)) * 100}%` }}
          ></div>
          
          {MASLOW_HIERARCHY.map((level, idx) => (
            <div key={level} className="flex flex-col items-center group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                idx <= currentLevelIndex 
                  ? 'bg-white border-indigo-600 text-indigo-600 scale-110' 
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                <i className={`fa-solid ${
                  level === MaslowLevel.PHYSIOLOGICAL ? 'fa-apple-whole' :
                  level === MaslowLevel.SAFETY ? 'fa-shield-halved' :
                  level === MaslowLevel.LOVE_BELONGING ? 'fa-heart' :
                  level === MaslowLevel.ESTEEM ? 'fa-award' :
                  level === MaslowLevel.SELF_ACTUALIZATION ? 'fa-seedling' : 'fa-sun'
                }`}></i>
              </div>
              <p className={`text-[10px] mt-2 font-bold transition-colors ${
                idx <= currentLevelIndex ? 'text-indigo-600' : 'text-slate-400'
              }`}>{level.split(' ')[0]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))
        ) : (
          cards.map((card) => (
            <div 
              key={card.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
                  <i className={`fa-solid ${card.icon}`}></i>
                </div>
                {card.timeContext && (
                  <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded-full border border-orange-100">
                    <i className="fa-regular fa-clock mr-1"></i>
                    {card.timeContext}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-2">{card.title}</h4>
              <p className="text-slate-500 text-sm flex-grow leading-relaxed">{card.description}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  {card.category}
                </span>
                <button className="text-indigo-600 font-bold text-xs hover:underline flex items-center gap-1 group/btn">
                  Acknowledge
                  <i className="fa-solid fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Agent Insights Box */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h3 className="text-xl font-serif italic mb-4">"The journey of a thousand miles begins with a single step, and your path is currently aligned with personal security and mental clarity."</h3>
            <div className="flex gap-4">
              <div className="bg-white/10 px-4 py-2 rounded-lg text-sm">
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Focus Point</span>
                <span className="font-medium">Financial Stability</span>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg text-sm">
                <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Spirit Health</span>
                <span className="font-medium">78% - Refreshed</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <p className="text-xs font-bold text-indigo-300 uppercase mb-3">Today's Reflection</p>
            <p className="text-sm italic text-slate-300 leading-relaxed">
              "How many of your daily tasks truly serve your long-term goal of building that enterprise?"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
