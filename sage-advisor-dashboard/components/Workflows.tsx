
import React from 'react';

const Workflows: React.FC = () => {
  const nodes = [
    { id: 1, type: 'trigger', label: 'Time of Day', x: 50, y: 150, icon: 'fa-clock' },
    { id: 2, type: 'action', label: 'Check Budget', x: 250, y: 50, icon: 'fa-wallet' },
    { id: 3, type: 'action', label: 'Find Restaurants', x: 250, y: 250, icon: 'fa-utensils' },
    { id: 4, type: 'ai', label: 'Sage Evaluation', x: 450, y: 150, icon: 'fa-brain' },
    { id: 5, type: 'output', label: 'Create Card', x: 650, y: 150, icon: 'fa-square-plus' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <header className="flex flex-col items-start text-left w-full space-y-1">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3E3E] tracking-tight">
          Cognitive Workflows
        </h2>
        <div className="flex items-center justify-between w-full">
          <p className="text-slate-400 text-sm md:text-base font-medium tracking-tight">
            The underlying autonomous logic powering your agent.
          </p>
          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#3E3E3E] transition-all active:scale-95 border border-black/10 px-4 py-2 rounded-full bg-white/50 hover:bg-white hover:border-black/20 shadow-sm">
            <i className="fa-solid fa-plus text-[10px]"></i>
            Add Node
          </button>
        </div>
      </header>

      <div className="bg-[#FAF7F2]/50 rounded-[2rem] border border-black/[0.03] p-8 relative min-h-[500px] overflow-hidden">
        {/* Canvas Area */}
        <div className="relative w-full h-full min-h-[400px]">
          {/* Connection Lines (Conceptual SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#3E3E3E" opacity="0.1" />
              </marker>
            </defs>
            <path d="M 120 170 L 250 80" stroke="#3E3E3E" strokeOpacity="0.1" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
            <path d="M 120 170 L 250 260" stroke="#3E3E3E" strokeOpacity="0.1" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
            <path d="M 320 80 L 450 160" stroke="#3E3E3E" strokeOpacity="0.1" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
            <path d="M 320 260 L 450 180" stroke="#3E3E3E" strokeOpacity="0.1" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
            <path d="M 520 170 L 650 170" stroke="#3E3E3E" strokeOpacity="0.1" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <div 
              key={node.id}
              className="absolute w-44 p-5 rounded-[2rem] bg-white border border-black/5 flex flex-col items-center gap-3 cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all group"
              style={{ left: node.x, top: node.y }}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 ${
                node.type === 'trigger' ? 'bg-[#D97706]' :
                node.type === 'ai' ? 'bg-[#7C3AED]' :
                node.type === 'output' ? 'bg-[#059669]' : 'bg-[#2563EB]'
              }`}>
                <i className={`fa-solid ${node.icon} text-sm`}></i>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-[#3E3E3E] mb-0.5">{node.label}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold opacity-60">{node.type}</p>
              </div>
            </div>
          ))}
        </div>

        {/* System Status Indicator - Themed */}
        <div className="absolute bottom-8 right-8 bg-white/60 backdrop-blur-md border border-black/5 p-5 rounded-[2rem] shadow-sm">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">System Integrity</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[10px] font-bold text-[#3E3E3E]">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Core: Resonating
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-[#3E3E3E]">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              MCP Status: Synchronized
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflows;
