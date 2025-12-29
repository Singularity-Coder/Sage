
import React from 'react';
import { SageNotification } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SageNotification[];
  onMarkAsRead: (id: string) => void;
  onAction: (cardId?: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead,
  onAction
}) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <aside 
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out border-l border-slate-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-800">Sage Whispers</h3>
              <p className="text-xs text-slate-500 font-medium">Insights and Reminders</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <i className="fa-solid fa-bell-slash text-2xl"></i>
                </div>
                <p className="text-sm font-medium text-slate-400 italic">"Silence is the sleep that nourishes wisdom."</p>
                <p className="text-xs text-slate-300 mt-2">No new whispers at this moment.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-2xl border transition-all ${n.read ? 'bg-white border-slate-100 opacity-60' : 'bg-indigo-50/30 border-indigo-100 shadow-sm'}`}
                  onClick={() => onMarkAsRead(n.id)}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center text-xs ${
                      n.type === 'reminder' ? 'bg-amber-100 text-amber-600' :
                      n.type === 'insight' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      <i className={`fa-solid ${
                        n.type === 'reminder' ? 'fa-clock' :
                        n.type === 'insight' ? 'fa-lightbulb' : 'fa-shoe-prints'
                      }`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm font-bold truncate ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{n.message}</p>
                      
                      {n.actionLabel && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAction(n.cardId);
                          }}
                          className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          {n.actionLabel}
                          <i className="fa-solid fa-chevron-right text-[8px]"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <footer className="p-4 border-t border-slate-100 bg-slate-50/30">
            <button 
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
              onClick={() => notifications.forEach(n => onMarkAsRead(n.id))}
            >
              Mark all as recognized
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
};

export default NotificationPanel;
