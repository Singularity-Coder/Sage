
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userName }) => {
  const navItems = [
    { id: 'dashboard', icon: 'fa-gauge-high', label: 'Sanctum' },
    { id: 'workflows', icon: 'fa-diagram-project', label: 'Workflows' },
    { id: 'notes', icon: 'fa-book-open', label: 'Memories' },
    { id: 'mcp', icon: 'fa-server', label: 'MCP Links' },
    { id: 'settings', icon: 'fa-sliders', label: 'Essence' },
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-feather-pointed text-indigo-600"></i>
            Sage
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Personal Advisor</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {userName.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{userName || 'Seeker'}</p>
              <p className="text-xs text-slate-500">Autonomous Core</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
