
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, DashboardCard, MaslowLevel } from './types';
import { INITIAL_PROFILE } from './constants';
import { getSageRecommendations } from './services/geminiService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import Workflows from './components/Workflows';
import Notes from './components/Notes';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sage_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshRecommendations = useCallback(async () => {
    if (!profile.onboarded) return;
    setIsLoading(true);
    const newCards = await getSageRecommendations(profile);
    setCards(newCards);
    setIsLoading(false);
  }, [profile]);

  useEffect(() => {
    if (profile.onboarded) {
      refreshRecommendations();
      localStorage.setItem('sage_profile', JSON.stringify(profile));
    }
  }, [profile, refreshRecommendations]);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('sage_profile', JSON.stringify(newProfile));
  };

  if (!profile.onboarded) {
    return <ProfileSetup onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            profile={profile} 
            cards={cards} 
            isLoading={isLoading} 
            onRefresh={refreshRecommendations} 
          />
        );
      case 'workflows':
        return <Workflows />;
      case 'notes':
        return <Notes />;
      case 'mcp':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-white rounded-[3rem] border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-6">
              <i className="fa-solid fa-server"></i>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-800">MCP Integrations</h2>
            <p className="text-slate-500 max-w-sm mt-4">
              Connect to your local Model Context Protocol servers to provide Sage with private context from your local files, databases, and apps.
            </p>
            <button className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors">
              Add Local Server
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-serif font-bold mb-8">Essence Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Intelligence</label>
                <div className="flex gap-4">
                  <button className="flex-1 p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-bold flex items-center gap-3">
                    <i className="fa-solid fa-sparkles"></i>
                    Gemini API
                  </button>
                  <button className="flex-1 p-4 rounded-2xl border-2 border-slate-200 text-slate-400 font-bold flex items-center gap-3 hover:border-slate-300">
                    <i className="fa-solid fa-microchip"></i>
                    Custom Model (Local)
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Profile Data</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Profession</span>
                    <span className="font-medium text-slate-800">{profile.profession}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ambition</span>
                    <span className="font-medium text-slate-800">{profile.financialAmbition}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                 <button 
                  onClick={() => {
                    localStorage.removeItem('sage_profile');
                    window.location.reload();
                  }}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  Reset Soul Data
                </button>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userName={profile.name}>
      {renderContent()}
    </Layout>
  );
};

export default App;
