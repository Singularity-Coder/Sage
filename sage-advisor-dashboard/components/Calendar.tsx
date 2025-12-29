
import React, { useState } from 'react';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));

  const days = [];
  // Padding for start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-32 border-b border-r border-slate-100 bg-slate-50/30"></div>);
  }
  
  // Actual days
  for (let i = 1; i <= daysInMonth(year, currentDate.getMonth()); i++) {
    const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
    days.push(
      <div key={i} className={`h-32 border-b border-r border-slate-100 p-2 hover:bg-indigo-50/30 transition-colors group relative ${isToday ? 'bg-indigo-50/20' : ''}`}>
        <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
          {i}
        </span>
        
        {i === 15 && (
          <div className="mt-2 bg-indigo-100 text-indigo-700 p-1.5 rounded text-[10px] font-bold border-l-2 border-indigo-600 truncate">
            Manifestation Workshop
          </div>
        )}
        {i === 22 && (
          <div className="mt-2 bg-emerald-100 text-emerald-700 p-1.5 rounded text-[10px] font-bold border-l-2 border-emerald-600 truncate">
            Review Goals
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800">Temporal Sanctum</h2>
          <p className="text-slate-500 mt-2">Harmonizing your Earthly schedule with spiritual goals.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-6 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
            <i className="fa-brands fa-google text-red-500"></i>
            Import from Google
          </button>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
            <i className="fa-solid fa-plus"></i>
            Add Intention
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-slate-800">{monthName} {year}</h3>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
            <button onClick={() => setCurrentDate(new Date())} className="text-xs font-bold text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full hover:bg-indigo-50">
              Today
            </button>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-md text-slate-800">Month</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Week</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Day</button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{d}</div>
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
