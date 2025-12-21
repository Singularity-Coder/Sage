
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
    <div className="h-full flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 underline decoration-indigo-200 underline-offset-8">Cognitive Workflows</h2>
          <p className="text-slate-500 mt-3">The underlying autonomous logic powering your agent.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
          Add Node
        </button>
      </header>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 relative overflow-hidden shadow-inner p-4">
        {/* Connection Lines (Conceptual SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
            </marker>
          </defs>
          <path d="M 120 170 L 250 80" stroke="#cbd5e1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          <path d="M 120 170 L 250 260" stroke="#cbd5e1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          <path d="M 320 80 L 450 160" stroke="#cbd5e1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          <path d="M 320 260 L 450 180" stroke="#cbd5e1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
          <path d="M 520 170 L 650 170" stroke="#cbd5e1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <div 
            key={node.id}
            className={`absolute w-40 p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center gap-2 bg-white cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all`}
            style={{ left: node.x, top: node.y }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
              node.type === 'trigger' ? 'bg-amber-500' :
              node.type === 'ai' ? 'bg-purple-600' :
              node.type === 'output' ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}>
              <i className={`fa-solid ${node.icon}`}></i>
            </div>
            <span className="text-xs font-bold text-slate-800">{node.label}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{node.type}</span>
          </div>
        ))}

        <div className="absolute bottom-6 right-6 bg-slate-900/5 backdrop-blur-md border border-slate-900/10 p-4 rounded-2xl max-w-xs">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">System Status</p>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Agent Core: Running
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            MCP Connectivity: 120ms
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflows;
