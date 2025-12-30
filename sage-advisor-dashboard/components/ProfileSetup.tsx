
import React, { useState } from 'react';
import { UserProfile, MaslowLevel } from '../types';
import { MASLOW_HIERARCHY } from '../constants';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    profession: '',
    goals: [],
    aspirations: '',
    financialAmbition: '',
    currentLevel: MaslowLevel.PHYSIOLOGICAL,
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    onComplete({
      ...form,
      onboarded: true,
      location: null,
      foodPreferences: [],
    } as UserProfile);
  };

  const steps = [
    {
      title: "Begin the Journey",
      desc: "Tell us about your presence in the physical world.",
      fields: (
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Name</label>
            <input 
              type="text" 
              className="w-full bg-[#FAF7F2] border border-black/5 p-5 rounded-[1.5rem] focus:ring-0 outline-none font-serif text-lg placeholder:opacity-30"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Your name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Age</label>
              <input 
                type="number" 
                className="w-full bg-[#FAF7F2] border border-black/5 p-5 rounded-[1.5rem] focus:ring-0 outline-none font-serif text-lg"
                value={form.age}
                onChange={e => setForm({...form, age: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Craft</label>
              <input 
                type="text" 
                className="w-full bg-[#FAF7F2] border border-black/5 p-5 rounded-[1.5rem] focus:ring-0 outline-none font-serif text-lg placeholder:opacity-30"
                value={form.profession}
                onChange={e => setForm({...form, profession: e.target.value})}
                placeholder="Profession"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Core Resonance",
      desc: "Where do you currently feel your energy settling?",
      fields: (
        <div className="space-y-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Current Baseline</label>
          <div className="grid grid-cols-1 gap-3">
            {MASLOW_HIERARCHY.map(level => (
              <button
                key={level}
                onClick={() => setForm({...form, currentLevel: level})}
                className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  form.currentLevel === level 
                    ? 'bg-white border-black/10 shadow-sm text-[#3E3E3E]' 
                    : 'bg-[#FAF7F2] border-black/5 text-slate-400 opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${form.currentLevel === level ? 'bg-black/5' : 'bg-transparent'}`}>
                  <i className={`fa-solid ${
                    level === MaslowLevel.PHYSIOLOGICAL ? 'fa-apple-whole' :
                    level === MaslowLevel.SAFETY ? 'fa-shield-halved' :
                    level === MaslowLevel.LOVE_BELONGING ? 'fa-people-group' :
                    level === MaslowLevel.ESTEEM ? 'fa-medal' :
                    level === MaslowLevel.SELF_ACTUALIZATION ? 'fa-seedling' : 'fa-mountain-sun'
                  } text-xs`}></i>
                </div>
                <span className="text-sm font-bold tracking-tight">{level}</span>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "What do you seek?",
      desc: "Defining intent is the first step of actualization.",
      fields: (
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Life Aspirations</label>
            <textarea 
              className="w-full bg-[#FAF7F2] border border-black/5 p-6 rounded-[2rem] h-40 resize-none focus:ring-0 outline-none font-serif text-lg placeholder:opacity-30 leading-relaxed"
              value={form.aspirations}
              onChange={e => setForm({...form, aspirations: e.target.value})}
              placeholder="What calls to your soul?"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">Ambition</label>
            <select 
              className="w-full bg-[#FAF7F2] border border-black/5 p-5 rounded-[1.5rem] focus:ring-0 outline-none font-serif text-lg appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwbDYgOCA2LThIMHoiIGZpbGw9IiM0NDQiLz48L3N2Zz4=')] bg-[length:12px_8px] bg-no-repeat bg-[right_1.5rem_center]"
              value={form.financialAmbition}
              onChange={e => setForm({...form, financialAmbition: e.target.value})}
            >
              <option value="">Select focus...</option>
              <option value="Stability">Stability</option>
              <option value="Freedom">Freedom</option>
              <option value="Legacy">Legacy</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#FAF7F2] p-6">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-[0_15px_60px_rgba(0,0,0,0.04)] border border-black/5 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-1000">
        <div className="p-10 text-center pb-6">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#E7EEF2] flex items-center justify-center border border-black/5">
              <i className="fa-solid fa-bird text-[#3E3E3E] text-2xl"></i>
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-[#3E3E3E] mb-2">{current.title}</h2>
          <p className="text-slate-400 font-medium">{current.desc}</p>
        </div>
        
        <div className="px-10 pb-10 flex-1 overflow-y-auto max-h-[60vh] scrollbar-hide">
          {current.fields}
        </div>

        <div className="p-10 bg-[#FAF7F2]/50 border-t border-black/5 flex justify-between items-center">
          <button 
            onClick={prevStep}
            disabled={step === 0}
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-all ${step === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Back
          </button>
          
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${step === i ? 'bg-black w-4' : 'bg-black/10'}`}></div>
            ))}
          </div>
          
          {step < steps.length - 1 ? (
            <button 
              onClick={nextStep}
              className="bg-[#3E3E3E] text-white px-10 py-4 rounded-full text-sm font-bold shadow-xl hover:bg-black transition-all active:scale-95"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="bg-[#3E3E3E] text-white px-10 py-4 rounded-full text-sm font-bold shadow-xl hover:bg-black transition-all active:scale-95"
            >
              Begin Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
