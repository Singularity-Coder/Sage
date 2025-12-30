
import React, { useState } from 'react';
import { DUMMY_EVENTS } from '../constants';

interface CalendarProps {
  isDummy?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ isDummy = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-32 border-b border-r border-black/[0.02] bg-[#FAF7F2]/20"></div>);
  }
  
  for (let i = 1; i <= daysInMonth(year, currentDate.getMonth()); i++) {
    const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
    const dummyEvents = isDummy ? DUMMY_EVENTS.filter(e => e.day === i) : [];

    days.push(
      <div key={i} className={`h-32 border-b border-r border-black/[0.03] p-3 hover:bg-black/[0.01] transition-colors group relative ${isToday ? 'bg-blue-50/20' : ''}`}>
        <span className={`text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[#3E3E3E] text-white shadow-sm' : 'text-slate-400 group-hover:text-black transition-colors'}`}>
          {i}
        </span>
        
        <div className="mt-2 space-y-1 overflow-hidden">
          {dummyEvents.map((evt, idx) => (
            <div key={idx} className={`px-2 py-1.5 rounded-lg text-[9px] font-bold truncate border-l-2 shadow-sm ${
              evt.type === 'spiritual' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              evt.type === 'growth' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {evt.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <header className="flex flex-col items-start text-left w-full space-y-1">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3E3E] tracking-tight">
          Temporal Sanctum
        </h2>
        <div className="flex items-center justify-between w-full">
          <p className="text-slate-400 text-sm md:text-base font-medium tracking-tight">
            Harmonizing your Earthly schedule with spiritual goals.
          </p>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#3E3E3E] transition-all active:scale-95 border border-black/10 px-4 py-2 rounded-full bg-white/50 hover:bg-white hover:border-black/20 shadow-sm">
                <i className="fa-brands fa-google text-[10px] text-rose-400"></i>
                Link
             </button>
             <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3E3E3E] hover:bg-black hover:text-white transition-all active:scale-95 border border-black/10 px-4 py-2 rounded-full bg-white hover:border-black/20 shadow-sm">
                <i className="fa-solid fa-plus text-[10px]"></i>
                Intention
             </button>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-black/5 overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between p-8 border-b border-black/[0.03] bg-[#FAF7F2]/30">
          <div className="flex items-center gap-6">
            <h3 className="text-xl font-bold text-[#3E3E3E]">{monthName} {year}</h3>
            <div className="flex bg-black/5 p-1 rounded-full border border-black/5">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-white hover:shadow-sm flex items-center justify-center text-slate-400 transition-all">
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-white hover:shadow-sm flex items-center justify-center text-slate-400 transition-all">
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
            <button onClick={() => setCurrentDate(new Date())} className="text-[10px] font-bold text-blue-600 bg-blue-50/50 border border-blue-100/50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-colors uppercase tracking-widest">
              Today
            </button>
          </div>
          <div className="flex bg-black/5 p-1 rounded-full border border-black/5">
            <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest bg-white shadow-sm rounded-full text-[#3E3E3E]">Month</button>
            <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black">Week</button>
            <button className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black">Day</button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center bg-[#FAF7F2]/10 border-b border-black/[0.03]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">{d}</div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 overflow-y-auto">
          {days}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
