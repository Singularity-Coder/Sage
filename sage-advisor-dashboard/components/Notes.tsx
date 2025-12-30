
import React, { useState, useEffect } from 'react';
import { SageNote } from '../types';
import { DUMMY_NOTES } from '../constants';

interface NotesProps {
  isDummy?: boolean;
}

const Notes: React.FC<NotesProps> = ({ isDummy = false }) => {
  const [notes, setNotes] = useState<SageNote[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (isDummy) {
      setNotes(DUMMY_NOTES);
    } else {
      const saved = localStorage.getItem('sage_memories');
      setNotes(saved ? JSON.parse(saved) : []);
    }
  }, [isDummy]);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: SageNote = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      content: newNote,
      tags: ['experience', isDummy ? 'simulated' : 'real'],
      sentiment: 'neutral'
    };
    
    const updated = [note, ...notes];
    setNotes(updated);
    
    if (!isDummy) {
      localStorage.setItem('sage_memories', JSON.stringify(updated));
    }
    setNewNote('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <header className="flex flex-col items-start text-left w-full space-y-1">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3E3E] tracking-tight">
          The Scroll of Memories
        </h2>
        <div className="flex items-center justify-between w-full">
          <p className="text-slate-400 text-sm md:text-base font-medium tracking-tight">
            Reflection is the mirror of progress.
          </p>
          <button 
            onClick={addNote}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-[#3E3E3E] transition-all active:scale-95 border border-black/10 px-4 py-2 rounded-full bg-white/50 hover:bg-white hover:border-black/20 shadow-sm"
          >
            <i className="fa-solid fa-pen-nib text-[10px]"></i>
            New Entry
          </button>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[2.5rem] border border-black/5 mb-16 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="What ripples are in your mind today?"
          className="w-full h-40 bg-[#FAF7F2] border-none rounded-[2rem] p-8 focus:ring-0 outline-none resize-none text-[#3E3E3E] text-xl font-serif italic placeholder:opacity-30 leading-relaxed"
        />
        <div className="flex justify-between items-center mt-10 px-2">
          <div className="flex gap-6 text-slate-300">
            <button className="hover:text-slate-600 transition-colors"><i className="fa-light fa-microphone text-lg"></i></button>
            <button className="hover:text-slate-600 transition-colors"><i className="fa-light fa-camera text-lg"></i></button>
          </div>
          <button 
            onClick={addNote}
            className="bg-[#3E3E3E] text-white px-10 py-4 rounded-full text-xs font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Preserve Reflection
          </button>
        </div>
      </div>

      <div className="space-y-10 pb-20 max-w-4xl mx-auto">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-200">
            <i className="fa-solid fa-feather text-4xl mb-6 opacity-20"></i>
            <p className="font-serif italic text-2xl opacity-40">The scroll remains unwritten.</p>
          </div>
        )}
        {notes.map(note => (
          <div key={note.id} className="bg-white p-10 rounded-[3rem] border border-black/5 relative group hover:border-black/10 transition-all shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                {new Date(note.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </span>
              <div className="flex gap-3">
                {note.tags.map(t => (
                  <span key={t} className="text-[9px] font-bold bg-[#FAF7F2] text-slate-400 px-4 py-1.5 rounded-full border border-black/5 uppercase tracking-widest">#{t}</span>
                ))}
              </div>
            </div>
            <p className="text-[#3E3E3E] leading-relaxed font-serif italic text-2xl opacity-90">{note.content}</p>
            <div className="mt-10 flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-slate-300 hover:text-slate-500"><i className="fa-solid fa-share-nodes"></i></button>
              {!isDummy && <button className="text-slate-300 hover:text-rose-400"><i className="fa-solid fa-trash"></i></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
