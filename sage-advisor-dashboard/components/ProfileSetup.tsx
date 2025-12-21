
import React, { useState } from 'react';
import { UserProfile, MaslowLevel } from '../types';

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
      title: "Who are you?",
      desc: "Every soul has a name and a stage in life.",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g. Siddhartha"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Your Age</label>
            <input 
              type="number" 
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={form.age}
              onChange={e => setForm({...form, age: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Your Craft</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={form.profession}
              onChange={e => setForm({...form, profession: e.target.value})}
              placeholder="e.g. Software Architect"
            />
          </div>
        </div>
      )
    },
    {
      title: "What do you seek?",
      desc: "Desires define the direction of the spirit.",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Deep Aspirations</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl h-32 resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={form.aspirations}
              onChange={e => setForm({...form, aspirations: e.target.value})}
              placeholder="What do you want to achieve in this lifetime?"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Financial Ambition</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={form.financialAmbition}
              onChange={e => setForm({...form, financialAmbition: e.target.value})}
            >
              <option value="">Choose your focus...</option>
              <option value="Stability">Basic Stability</option>
              <option value="Comfort">Comfort & Freedom</option>
              <option value="Legacy">Generational Wealth</option>
              <option value="Philanthropy">Resource for Others</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: "Foundation of Being",
      desc: "We start from the ground up.",
      fields: (
        <div className="space-y-4">
          <p className="text-slate-500 text-sm text-center mb-6 italic">
            "Your journey starts at the first level: Physiological Needs. We will help you secure the basics before moving to higher planes."
          </p>
          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <div>
              <p className="font-bold text-indigo-900">Current Phase: Survival & Sustenance</p>
              <p className="text-xs text-indigo-700">Focus on health, diet, and rest.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = steps[step];

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-700">
        <div className="bg-indigo-600 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <i className="fa-solid fa-feather-pointed text-2xl"></i>
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Step {step + 1} of {steps.length}</span>
          </div>
          <h2 className="text-3xl font-serif font-bold mb-2">{current.title}</h2>
          <p className="text-indigo-100 opacity-80">{current.desc}</p>
        </div>
        
        <div className="p-8 flex-1">
          {current.fields}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between">
          <button 
            onClick={prevStep}
            disabled={step === 0}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${step === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Back
          </button>
          
          {step < steps.length - 1 ? (
            <button 
              onClick={nextStep}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
            >
              Enter the Sanctum
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
