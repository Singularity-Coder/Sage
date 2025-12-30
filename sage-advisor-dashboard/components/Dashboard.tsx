
import React from 'react';
import { UserProfile, DashboardCard, TaskStatus, MaslowLevel } from '../types';
import { MASLOW_HIERARCHY } from '../constants';

interface DashboardProps {
  profile: UserProfile;
  cards: DashboardCard[];
  isLoading: boolean;
  onRefresh: () => void;
  onUpdateCardStatus: (cardId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: DashboardCard) => void;
  onAskSage: (task: DashboardCard) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, cards, isLoading, onRefresh, onUpdateCardStatus, onTaskClick, onAskSage }) => {
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

  const renderTaskCard = (card: DashboardCard) => (
    <div 
      key={card.id}
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onClick={() => onTaskClick(card)}
      className="bg-white p-6 rounded-[2rem] border border-black/5 cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-slate-400 border border-black/5">
          <i className={`fa-solid ${card.icon} text-xs`}></i>
        </div>
        {card.timeContext && (
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-black/5">
            {card.timeContext}
          </span>
        )}
      </div>
      
      <h5 className="font-serif text-xl font-bold text-[#3E3E3E] mb-2 group-hover:text-black transition-colors">{card.title}</h5>
      <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 opacity-80">{card.description}</p>
      
      {(card.expectedTime || card.duration) && (
        <div className="flex gap-4 mb-6">
          {card.expectedTime && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <i className="fa-regular fa-clock text-[10px]"></i>
              <span className="text-[9px] font-bold tracking-tight uppercase">{card.expectedTime}</span>
            </div>
          )}
          {card.duration && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <i className="fa-regular fa-hourglass-half text-[10px]"></i>
              <span className="text-[9px] font-bold tracking-tight uppercase">{card.duration}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-black/[0.03]">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAskSage(card);
          }}
          className="flex items-center gap-2 bg-[#FAF7F2] text-slate-600 px-4 py-2 rounded-full text-[10px] font-bold hover:bg-slate-100 transition-all border border-black/5 shadow-sm"
        >
          Ask
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const nextStatus = card.status === 'todo' ? 'doing' : card.status === 'doing' ? 'done' : 'todo';
            onUpdateCardStatus(card.id, nextStatus as TaskStatus);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
            card.status === 'done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-200 border-black/5'
          }`}
        >
          <i className={`fa-solid ${card.status === 'done' ? 'fa-check' : 'fa-circle-check'} text-xs`}></i>
        </button>
      </div>
    </div>
  );

  const renderColumn = (status: TaskStatus, label: string, count: number) => (
    <div 
      className="flex-1 min-w-[320px] lg:min-w-0 space-y-6"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex flex-col items-center mb-8">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">
          {label} <span className="ml-1 opacity-60">({count})</span>
        </h4>
        <div className="h-[1px] w-8 bg-black/10"></div>
      </div>
      <div className="space-y-4">
        {cards.filter(c => (c.status || 'todo') === status).map(renderTaskCard)}
        {count === 0 && (
          <div className="py-12 bg-[#FAF7F2]/30 rounded-[2.5rem] border border-dashed border-black/5 flex flex-col items-center justify-center text-slate-300">
            <p className="font-serif italic text-sm opacity-40">Stillness</p>
          </div>
        )}
      </div>
    </div>
  );

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const todoCount = cards.filter(c => (c.status || 'todo') === 'todo').length;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header - Date size reduced and items aligned as per screenshot */}
      <header className="flex flex-col items-start text-left w-full space-y-1">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3E3E] tracking-tight">
          {formattedDate}
        </h2>
        <div className="flex items-center justify-between w-full">
          <p className="text-slate-400 text-sm md:text-base font-medium tracking-tight">
            You have <span className="text-[#3E3E3E] font-bold">{todoCount} sessions</span> waiting today.
          </p>
          <button 
            onClick={onRefresh}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#3E3E3E] transition-all active:scale-95 border border-black/10 px-4 py-2 rounded-full bg-white/50 hover:bg-white hover:border-black/20 shadow-sm"
          >
            <i className={`fa-solid fa-arrows-rotate ${isLoading ? 'animate-spin' : ''}`}></i>
            Recalibrate Core
          </button>
        </div>
      </header>

      {/* Progress Path - Removed max-w-3xl, reduced corner radius to rounded-[2rem], and adjusted inner padding */}
      <section className="flex flex-col items-center">
        <div className="relative flex justify-center items-center w-full px-8 py-10 bg-[#FAF7F2]/50 rounded-[2rem] border border-black/[0.03]">
          <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-black/5 -translate-y-1/2"></div>
          
          <div className="relative flex justify-between w-full px-2">
            {MASLOW_HIERARCHY.map((level, idx) => {
              const isActive = idx <= currentLevelIndex;
              const isCurrent = idx === currentLevelIndex;
              
              return (
                <div key={level} className="flex flex-col items-center relative group">
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    isActive ? 'bg-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-black/5' : 'bg-transparent border border-black/[0.05]'
                  }`}>
                    {isCurrent && (
                      <div className="absolute inset-[-4px] rounded-full border-2 border-blue-200 border-t-transparent animate-spin duration-[3000ms]"></div>
                    )}
                    <i className={`fa-solid ${
                      level === MaslowLevel.PHYSIOLOGICAL ? 'fa-apple-whole' :
                      level === MaslowLevel.SAFETY ? 'fa-shield-halved' :
                      level === MaslowLevel.LOVE_BELONGING ? 'fa-people-group' :
                      level === MaslowLevel.ESTEEM ? 'fa-medal' :
                      level === MaslowLevel.SELF_ACTUALIZATION ? 'fa-seedling' : 'fa-mountain-sun'
                    } text-xs ${isActive ? 'text-[#3E3E3E] opacity-100' : 'text-slate-300 opacity-50'}`}></i>
                  </div>
                  <span className={`absolute -bottom-8 text-[8px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    isActive ? 'text-[#3E3E3E] opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                  }`}>
                    {level.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kanban Board Layout */}
      <div className="flex flex-col lg:flex-row gap-12 items-start overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
        {renderColumn('todo', 'Seeking Focus', todoCount)}
        {renderColumn('doing', 'In Communion', cards.filter(c => c.status === 'doing').length)}
        {renderColumn('done', 'Manifested', cards.filter(c => c.status === 'done').length)}
      </div>

      {/* Reflection Footer */}
      <footer className="pt-16">
        <div className="bg-[#E8EDE7] p-10 rounded-[3.5rem] border border-black/5 flex flex-col md:flex-row gap-10 items-center overflow-hidden relative">
          <div className="flex-1 text-center md:text-left relative z-10">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#3E3E3E] leading-tight mb-4 italic">
              "The path is long, but the morning is clear."
            </h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-white/40 px-5 py-2 rounded-full border border-black/5">
                Continuity: 3 Day Streak
              </span>
            </div>
          </div>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/40 rounded-full animate-pulse"></div>
            <i className="fa-solid fa-mountain-sun text-5xl text-[#3E3E3E] opacity-10 relative z-10"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
