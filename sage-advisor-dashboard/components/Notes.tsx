
import React, { useState, useEffect } from 'react';
import { SageNote } from '../types';
import { DUMMY_NOTES } from '../constants';

interface NotesProps {
  isDummy?: boolean;
}

const Notes: React.FC<NotesProps> = ({ isDummy = false }) => {
  const [notes, setNotes] = useState<SageNote[]>([]);
  const [newNote, setNewNote] = useState('');

  // Synchronize notes based on dummy mode
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
    
    // In dummy mode, we can still "add" notes to the local state for the session
    // but we don't persist them to local storage as "real" memories
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
    <div className="max-w-4xl mx-auto h-full flex flex-col animate-in slide-in-from-bottom duration-700">
      <header className="mb-8">
        <h2 className="text-4xl font-serif font-bold text-slate-800 tracking-tight">The Scroll of Memories</h2>
        <p className="text-slate-500 mt-2 text-lg">
          {isDummy ? 'Currently viewing simulated spiritual logs.' : 'Every experience is a note on your path to realization.'}
        </p>
      </header>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10 transition-all hover:shadow-md">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Speak your mind, Seeker..."
          className="w-full h-32 bg-slate-50 border-none rounded-2xl p-6 focus:ring-2 focus:ring-indigo-100 outline-none resize-none text-slate-800 text-lg font-serif italic"
        />
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-4">
            <button className="text-slate-400 hover:text-indigo-600 p-2 transition-colors"><i className="fa-solid fa-paperclip text-lg"></i></button>
            <button className="text-slate-400 hover:text-indigo-600 p-2 transition-colors"><i className="fa-solid fa-microphone text-lg"></i></button>
            <button className="text-slate-400 hover:text-indigo-600 p-2 transition-colors"><i className="fa-solid fa-camera text-lg"></i></button>
          </div>
          <button 
            onClick={addNote}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-100 flex items-center gap-3 active:scale-95"
          >
            Preserve Memory
            <i className="fa-solid fa-feather"></i>
          </button>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-20 px-2">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <i className="fa-solid fa-book-open text-4xl mb-4 opacity-20"></i>
            <p className="italic font-medium">Your scroll is currently blank.</p>
          </div>
        )}
        {notes.map(note => (
          <div key={note.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 border-l-[6px] border-l-indigo-600 transform transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {new Date(note.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <div className="flex gap-2">
                {note.tags.map(t => (
                  <span key={t} className="text-[9px] font-bold bg-slate-50 text-slate-500 px-3 py-1 rounded-full border border-slate-100">#{t}</span>
                ))}
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed font-serif italic text-xl">{note.content}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button className="text-slate-300 hover:text-slate-500"><i className="fa-solid fa-share-nodes"></i></button>
              {!isDummy && <button className="text-slate-300 hover:text-red-400"><i className="fa-solid fa-trash-can"></i></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
