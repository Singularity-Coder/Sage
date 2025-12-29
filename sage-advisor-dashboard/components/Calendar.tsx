
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
    days.push(<div key={`empty-${i}`} className="h-32 border-b border-r border-slate-50 bg-slate-50/20"></div>);
  }
  
  for (let i = 1; i <= daysInMonth(year, currentDate.getMonth()); i++) {
    const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
    
    // In dummy mode, show pre-defined events
    const dummyEvents = isDummy ? DUMMY_EVENTS.filter(e => e.day === i) : [];

    days.push(
      <div key={i} className={`h-32 border-b border-r border-slate-100 p-2 hover:bg-indigo-50/20 transition-colors group relative ${isToday ? 'bg-indigo-50/10' : ''}`}>
        <span className={`text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 group-hover:text-slate-600'}`}>
          {i}
        </span>
        
        <div className="mt-2 space-y-1 overflow-hidden">
          {dummyEvents.map((evt, idx) => (
            <div key={idx} className={`p-1.5 rounded text-[10px] font-bold truncate border-l-2 ${
              evt.type === 'spiritual' ? 'bg-purple-50 text-purple-700 border-purple-600' :
              evt.type === 'growth' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' :
              'bg-emerald-50 text-emerald-700 border-emerald-600'
            }`}>
              {evt.title}
            </div>
          ))}
          
          {!isDummy && i === 15 && (
            <div className="bg-indigo-100 text-indigo-700 p-1.5 rounded text-[10px] font-bold border-l-2 border-indigo-600 truncate">
              Manifestation Workshop
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-800 tracking-tight">Temporal Sanctum</h2>
          <p className="text-slate-500 mt-2 text-lg">Harmonizing your Earthly schedule with spiritual goals.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm active:scale-95">
            <i className="fa-brands fa-google text-red-500"></i>
            Link Calendar
          </button>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-3 shadow-lg active:scale-95">
            <i className="fa-solid fa-plus"></i>
            Set Intention
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between p-8 border-b border-slate-50">
          <div className="flex items-center gap-6">
            <h3 className="text-2xl font-bold text-slate-800">{monthName} {year}</h3>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button onClick={prevMonth} className="w-10 h-10 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-slate-400 transition-all">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button onClick={nextMonth} className="w-10 h-10 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center text-slate-400 transition-all">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
            <button onClick={() => setCurrentDate(new Date())} className="text-xs font-bold text-indigo-600 border border-indigo-100 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
              Today
            </button>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button className="px-5 py-2 text-xs font-bold bg-white shadow-sm rounded-lg text-slate-800">Month</button>
            <button className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Week</button>
            <button className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Day</button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center bg-slate-50/30 border-b border-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{d}</div>
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
