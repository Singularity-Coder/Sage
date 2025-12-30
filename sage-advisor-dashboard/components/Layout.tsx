
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
  unreadCount: number;
  onOpenNotifications: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  userName, 
  unreadCount,
  onOpenNotifications 
}) => {
  const navItems = [
    { id: 'dashboard', icon: 'fa-leaf', label: 'Home' },
    { id: 'workflows', icon: 'fa-wind', label: 'Workflows' },
    { id: 'calendar', icon: 'fa-moon', label: 'Calendar' },
    { id: 'notes', icon: 'fa-feather', label: 'Memories' },
    { id: 'mcp', icon: 'fa-seedling', label: 'Growth' },
    { id: 'settings', icon: 'fa-gear', label: 'Settings' },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#FAF7F2]">
      {/* Sidebar - pt-16 (64px) provides small padding above the Sage title */}
      <aside className="w-64 flex flex-col pt-16 pb-8 px-6">
        <div className="mb-12 px-4">
          <h1 className="text-3xl font-serif font-bold text-[#3E3E3E]">
            Sage
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold">Personal Advisor</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-full transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-[#E7EEF2] text-[#3E3E3E] font-semibold'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-black/5'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-sm opacity-80`}></i>
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto px-2 space-y-4">
          <button 
            onClick={onOpenNotifications}
            className="relative w-full flex items-center gap-4 px-5 py-3 rounded-full text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-all duration-300 group"
            title="Whispers"
          >
            <div className="relative">
              <i className="fa-solid fa-bell text-sm opacity-80 group-hover:opacity-100"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-400 rounded-full border border-[#FAF7F2]"></span>
              )}
            </div>
            <span className="text-sm tracking-tight">Whispers</span>
          </button>

          <div className="flex items-center gap-4 p-4 bg-white/40 rounded-[2rem] border border-black/5">
            <div className="w-10 h-10 rounded-full bg-[#F5EAE8] flex items-center justify-center text-[#3E3E3E] font-serif font-bold border border-black/5">
              {userName.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#3E3E3E] truncate">{userName || 'Seeker'}</p>
              <p className="text-[10px] text-slate-400 font-medium">Core Presence</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative mr-4 my-4 bg-white rounded-[3rem] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-black/[0.02]">
        {/* h-12 (48px) + my-4 (16px) = 64px to align with sidebar pt-16 (64px) */}
        <header className="h-12 flex items-center justify-end px-8 shrink-0 invisible">
           {/* Header height increased to match sidebar title vertical offset */}
        </header>
        
        <div className="flex-1 px-10 pb-12 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
