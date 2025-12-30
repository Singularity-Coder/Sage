
import React, { useState, useEffect, useMemo } from 'react';
import { SageNote } from '../types';
import { DUMMY_NOTES } from '../constants';

interface NotesProps {
  isDummy?: boolean;
}

const Notes: React.FC<NotesProps> = ({ isDummy = false }) => {
  const [notes, setNotes] = useState<SageNote[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<SageNote> | null>(null);

  useEffect(() => {
    if (isDummy) {
      setNotes(DUMMY_NOTES);
    } else {
      const saved = localStorage.getItem('sage_memories');
      setNotes(saved ? JSON.parse(saved) : []);
    }
  }, [isDummy]);

  const saveNotes = (updatedNotes: SageNote[]) => {
    setNotes(updatedNotes);
    if (!isDummy) {
      localStorage.setItem('sage_memories', JSON.stringify(updatedNotes));
    }
  };

  const handleOpenEditor = (note?: SageNote) => {
    if (note) {
      setEditingNote(note);
    } else {
      setEditingNote({
        title: '',
        content: '',
        tags: [],
        sentiment: 'neutral'
      });
    }
    setIsEditorOpen(true);
  };

  const handleSaveAndClose = () => {
    if (!editingNote || (!editingNote.content?.trim() && !editingNote.title?.trim())) {
      setIsEditorOpen(false);
      return;
    }

    let updated: SageNote[];
    if (editingNote.id) {
      // Edit existing
      updated = notes.map(n => n.id === editingNote.id ? { ...n, ...editingNote as SageNote, timestamp: Date.now() } : n);
    } else {
      // Create new
      const newNode: SageNote = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        title: editingNote.title || '',
        content: editingNote.content || '',
        tags: editingNote.tags || ['reflection'],
        sentiment: editingNote.sentiment || 'neutral'
      };
      updated = [newNode, ...notes];
    }

    saveNotes(updated);
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(n => 
      (n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [notes, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <header className="flex flex-col items-start text-left w-full space-y-1">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3E3E] tracking-tight">
          The Scroll of Memories
        </h2>
        <div className="flex items-center justify-between w-full">
          <p className="text-slate-400 text-sm md:text-base font-medium tracking-tight">
            Reflection is the mirror of progress.
          </p>
          <div className="flex items-center gap-3">
            <div className="relative mr-2">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
              <input 
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/50 border border-black/5 rounded-full pl-10 pr-4 py-2 text-xs focus:bg-white transition-all outline-none w-48 md:w-64"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-white/50 border border-black/5 rounded-full p-1 shadow-sm">
               <button 
                onClick={() => setViewMode('grid')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-[#3E3E3E] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid View"
              >
                <i className="fa-solid fa-table-cells-large text-xs"></i>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-[#3E3E3E] text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="List View"
              >
                <i className="fa-solid fa-list-ul text-xs"></i>
              </button>
            </div>

            <button 
              onClick={() => handleOpenEditor()}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#3E3E3E] transition-all active:scale-95 border border-black/10 px-6 py-2.5 rounded-full bg-white shadow-sm"
            >
              <i className="fa-solid fa-feather text-[10px]"></i>
              New Entry
            </button>
          </div>
        </div>
      </header>

      {/* Notes Display */}
      <div className={viewMode === 'grid' 
        ? "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6" 
        : "max-w-3xl mx-auto space-y-4"
      }>
        {filteredNotes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-32 text-slate-200">
            <i className="fa-solid fa-feather text-5xl mb-6 opacity-10"></i>
            <p className="font-serif italic text-2xl opacity-40">The scroll remains unwritten.</p>
          </div>
        )}
        
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            onClick={() => handleOpenEditor(note)}
            className={`break-inside-avoid bg-white p-6 rounded-[1.5rem] border border-black/5 hover:border-black/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all group cursor-pointer relative ${viewMode === 'list' ? 'w-full' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                {new Date(note.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="w-7 h-7 rounded-full hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-slate-300 transition-all"
                >
                  <i className="fa-solid fa-trash text-[10px]"></i>
                </button>
              </div>
            </div>
            
            {note.title && (
              <h3 className="text-xl font-serif font-bold text-[#3E3E3E] mb-2 leading-tight">
                {note.title}
              </h3>
            )}
            
            <p className="text-slate-500 leading-relaxed font-serif italic text-lg opacity-90 line-clamp-6">
              {note.content}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {note.tags.map(t => (
                <span key={t} className="text-[8px] font-bold bg-[#FAF7F2] text-slate-400 px-3 py-1 rounded-full border border-black/5 uppercase tracking-widest">
                  #{t}
                </span>
              ))}
            </div>

            {/* Bottom toolbar - visible on hover */}
            <div className="mt-6 pt-4 border-t border-black/[0.03] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-3 text-slate-300">
                <i className="fa-regular fa-bell text-xs hover:text-slate-500"></i>
                <i className="fa-regular fa-palette text-xs hover:text-slate-500"></i>
                <i className="fa-regular fa-image text-xs hover:text-slate-500"></i>
              </div>
              <i className="fa-regular fa-ellipsis-vertical text-xs text-slate-300"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={handleSaveAndClose}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[1.5rem] shadow-2xl border border-black/5 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <input 
                  type="text" 
                  placeholder="Title"
                  value={editingNote?.title || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full text-2xl font-serif font-bold text-[#3E3E3E] bg-transparent border-none focus:ring-0 outline-none placeholder:opacity-20"
                />
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                  <i className="fa-solid fa-thumbtack"></i>
                </button>
              </div>
              
              <textarea 
                autoFocus
                value={editingNote?.content || ''}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                placeholder="What ripples are in your mind?"
                className="w-full h-64 bg-transparent border-none focus:ring-0 outline-none resize-none text-[#3E3E3E] text-lg font-serif italic placeholder:opacity-20 leading-relaxed"
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {editingNote?.tags?.map(t => (
                  <span key={t} className="text-[9px] font-bold bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full border border-black/5 uppercase tracking-widest flex items-center gap-2">
                    #{t}
                    <i className="fa-solid fa-xmark cursor-pointer hover:text-slate-600" onClick={() => setEditingNote({ ...editingNote, tags: editingNote.tags?.filter(tag => tag !== t)})}></i>
                  </span>
                ))}
                <button className="text-[9px] font-bold text-slate-300 hover:text-slate-500 uppercase tracking-widest">
                  <i className="fa-solid fa-plus mr-1"></i> Add Tag
                </button>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-black/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-6 text-slate-400">
                <button className="hover:text-slate-700 transition-colors" title="Background Options"><i className="fa-solid fa-palette text-sm"></i></button>
                <button className="hover:text-slate-700 transition-colors" title="Remind me"><i className="fa-solid fa-bell text-sm"></i></button>
                <button className="hover:text-slate-700 transition-colors" title="Add Image"><i className="fa-solid fa-image text-sm"></i></button>
                <button className="hover:text-slate-700 transition-colors" title="More"><i className="fa-solid fa-ellipsis-vertical text-sm"></i></button>
                <div className="w-[1px] h-4 bg-black/5 mx-1"></div>
                <button className="hover:text-slate-700 transition-colors" title="Undo"><i className="fa-solid fa-rotate-left text-sm"></i></button>
                <button className="hover:text-slate-700 transition-colors" title="Redo"><i className="fa-solid fa-rotate-right text-sm"></i></button>
              </div>
              
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-medium text-slate-300 italic">
                  Edited at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button 
                  onClick={handleSaveAndClose}
                  className="text-[#3E3E3E] px-8 py-3 rounded-xl text-xs font-bold hover:bg-black/5 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
