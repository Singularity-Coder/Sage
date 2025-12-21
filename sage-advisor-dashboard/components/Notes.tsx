
import React, { useState } from 'react';
import { SageNote } from '../types';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<SageNote[]>([
    { id: '1', timestamp: Date.now() - 1000000, content: 'Felt a great sense of calm while working on the architecture today. Moving toward Esteem.', tags: ['productivity', 'reflection'], sentiment: 'positive' },
    { id: '2', timestamp: Date.now() - 2000000, content: 'Worried about financial runway. Reverting focus to Safety needs.', tags: ['finance', 'worry'], sentiment: 'reflective' },
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: SageNote = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      content: newNote,
      tags: ['experience'],
      sentiment: 'neutral'
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-800">The Scroll of Memories</h2>
        <p className="text-slate-500 mt-2">Every experience is a note on your path to realization.</p>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Speak your mind, Seeker..."
          className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 outline-none resize-none text-slate-800"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <button className="text-slate-400 hover:text-indigo-600 p-2"><i className="fa-solid fa-paperclip"></i></button>
            <button className="text-slate-400 hover:text-indigo-600 p-2"><i className="fa-solid fa-microphone"></i></button>
          </div>
          <button 
            onClick={addNote}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            Preserve Memory
            <i className="fa-solid fa-feather"></i>
          </button>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-10">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {new Date(note.timestamp).toLocaleDateString()}
              </span>
              <div className="flex gap-1">
                {note.tags.map(t => (
                  <span key={t} className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">#{t}</span>
                ))}
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed font-serif italic text-lg">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
