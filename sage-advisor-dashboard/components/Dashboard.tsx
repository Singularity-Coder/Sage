
import React, { useState, useEffect } from 'react';
// Import MaslowLevel to resolve "Cannot find name 'MaslowLevel'" errors
import { UserProfile, DashboardCard, TaskStatus, MaslowLevel } from '../types';
import { MASLOW_HIERARCHY } from '../constants';

interface DashboardProps {
  profile: UserProfile;
  cards: DashboardCard[];
  isLoading: boolean;
  onRefresh: () => void;
  onUpdateCardStatus: (cardId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: DashboardCard) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, cards, isLoading, onRefresh, onUpdateCardStatus, onTaskClick }) => {
  const currentLevelIndex = MASLOW_HIERARCHY.indexOf(profile.currentLevel);

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('cardId', id);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: TaskStatus) => {
    const cardId = e.dataTransfer.getData('cardId');
    onUpdateCardStatus(cardId, status);
  };

  const renderColumn = (status: TaskStatus, label: string, colorClass: string) => {
    const filteredCards = cards.filter(c => (c.status || 'todo') === status);
    
    return (
      <div 
        className="flex-1 min-w-[300px] flex flex-col bg-slate-100/30 rounded-2xl p-4 min-h-[500px]"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, status)}
      >
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {label}
          </h4>
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">{filteredCards.length}</span>
        </div>
        
        <div className="space-y-4">
          {filteredCards.map(card => (
            <div 
              key={card.id}
              draggable
              onDragStart={(e) => onDragStart(e, card.id)}
              onClick={() => onTaskClick(card)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all group border-l-[6px] border-l-indigo-600 relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-5 h-5 rounded-full bg-indigo-50/50 flex items-center justify-center">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                </div>
                {card.timeContext && (
                  <span className="text-[9px] font-bold bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100/50 uppercase tracking-tighter">
                    {card.timeContext}
                  </span>
                )}
              </div>
              
              <h5 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">{card.title}</h5>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">{card.description}</p>
              
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.1em]">
                  {card.category}
                </span>
                <button className="text-slate-300 hover:text-slate-600 p-1">
                  <i className="fa-solid fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
          ))}
          {filteredCards.length === 0 && !isLoading && (
            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-300">
              <i className="fa-solid fa-layer-group mb-2 opacity-20"></i>
              <p className="text-[10px] font-medium italic">Nothing here yet</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const todoCount = cards.filter(c => (c.status || 'todo') === 'todo').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header & Status */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-800 tracking-tight">{formattedDate}</h2>
          <p className="text-slate-500 mt-2 text-lg">
            You have <span className="font-bold text-indigo-600">{todoCount} tasks</span> pending for today.
          </p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 active:scale-95"
        >
          <i className={`fa-solid fa-rotate ${isLoading ? 'animate-spin' : ''}`}></i>
          Recalibrate
        </button>
      </header>

      {/* Maslow Progress */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3 px-2">
          <i className="fa-solid fa-mountain-sun text-orange-400"></i>
          The Path of Needs
        </h3>
        <div className="relative flex justify-between items-center px-6">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -translate-y-1/2 -z-10 mx-6"></div>
          <div 
            className="absolute top-1/2 left-0 h-[2px] bg-indigo-600 -translate-y-1/2 -z-10 transition-all duration-1000 ease-in-out mx-6"
            style={{ width: `calc(${(currentLevelIndex / (MASLOW_HIERARCHY.length - 1)) * 100}% - 12px)` }}
          ></div>
          
          {MASLOW_HIERARCHY.map((level, idx) => (
            <div key={level} className="flex flex-col items-center group relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                idx <= currentLevelIndex 
                  ? 'bg-white border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-100' 
                  : 'bg-slate-50 border-slate-100 text-slate-300'
              }`}>
                <i className={`fa-solid ${
                  level === MaslowLevel.PHYSIOLOGICAL ? 'fa-apple-whole' :
                  level === MaslowLevel.SAFETY ? 'fa-shield-halved' :
                  level === MaslowLevel.LOVE_BELONGING ? 'fa-heart' :
                  level === MaslowLevel.ESTEEM ? 'fa-award' :
                  level === MaslowLevel.SELF_ACTUALIZATION ? 'fa-seedling' : 'fa-sun'
                } text-sm`}></i>
              </div>
              <p className={`text-[10px] mt-3 font-bold uppercase tracking-widest transition-colors ${
                idx <= currentLevelIndex ? 'text-indigo-600' : 'text-slate-400 opacity-0 group-hover:opacity-100'
              }`}>{level.split(' ')[0]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kanban Board View - Update to List Style as per screenshot */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {renderColumn('todo', 'Seeking Focus', 'bg-amber-400')}
        {renderColumn('doing', 'In Communion', 'bg-indigo-500')}
        {renderColumn('done', 'Manifested', 'bg-emerald-500')}
      </div>

      {/* Agent Insights Box */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h3 className="text-2xl font-serif italic mb-6 leading-relaxed text-indigo-100">"The journey of a thousand miles begins with a single step, and your path is currently aligned with personal security and mental clarity."</h3>
            <div className="flex gap-6">
              <div className="bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Focus Point</span>
                <span className="font-semibold text-white">Financial Stability</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-widest mb-1">Spirit Health</span>
                <span className="font-semibold text-white">78% - Refreshed</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-80 bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4">
               <i className="fa-solid fa-quote-left"></i>
            </div>
            <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-3">Today's Reflection</p>
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
