
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DashboardCard } from '../types';
import { suggestions } from '../constants';

interface TaskChatProps {
  task: DashboardCard | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const TaskChat: React.FC<TaskChatProps> = ({ task, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && task) {
      setMessages([
        { 
          role: 'model', 
          text: `Seeker, I am here to guide you through "${task.title}". How can I assist in its manifestation?` 
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [isOpen, task]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !task) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Added await here to resolve the promise before iterating over the stream
      const chat = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `Task Context: ${task.title} - ${task.description}. Category: ${task.category}.` }] },
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text }] }
        ],
        config: {
          systemInstruction: "You are the Sage Advisor. Provide concise, philosophical, and practical guidance on the specific task. Keep responses focused on the user's progress through Maslow's hierarchy. Use a calm, wise tone."
        }
      });

      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of chat) {
        fullText += chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: fullText };
          return updated;
        });
      }
    } catch (error) {
      console.error("Sage communication error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Forgive me, my connection to the ether is weak. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-[0_0_80px_rgba(0,0,0,0.1)] z-[100] transform transition-transform duration-500 ease-out flex flex-col border-l border-black/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <header className="p-8 border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] flex items-center justify-center border border-black/5">
            <i className={`fa-solid ${task.icon} text-[#3E3E3E]`}></i>
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#3E3E3E] text-lg">{task.title}</h3>
            <p className="text-[10px] uppercase font-bold text-slate-300 tracking-[0.2em]">{task.category}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-300 transition-colors">
          <i className="fa-light fa-xmark"></i>
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAF7F2]/30 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-6 rounded-[2rem] text-[15px] leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#3E3E3E] text-white shadow-xl rounded-br-none' 
                : 'bg-white text-[#3E3E3E] shadow-sm border border-black/5 rounded-bl-none font-serif italic text-lg'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-black/5 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-black/5 space-y-4">
        {/* Chat Suggestions - Staggered Grid (Pinterest-style) using flex-col wrap */}
        <div className="h-[96px] overflow-x-auto scrollbar-hide">
          <div className="flex flex-col flex-wrap gap-2 h-full content-start">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className="whitespace-nowrap bg-[#FAF7F2] border border-black/5 text-slate-500 px-5 py-2.5 rounded-full text-[10px] font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="relative pt-2">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Whisper your query..."
            className="w-full pl-6 pr-14 py-4 bg-[#FAF7F2] border border-black/5 rounded-full focus:ring-0 outline-none text-sm placeholder:text-slate-300"
          />
          <button 
            onClick={() => handleSendMessage(input)}
            className="absolute right-2 top-[calc(50%+4px)] -translate-y-1/2 w-10 h-10 bg-[#3E3E3E] text-white rounded-full flex items-center justify-center hover:bg-black transition-all"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskChat;
