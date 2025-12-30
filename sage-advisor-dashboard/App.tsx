
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, DashboardCard, TaskStatus, SageNotification, SageNote } from './types';
import { INITIAL_PROFILE, DUMMY_CARDS, DUMMY_NOTES } from './constants';
import { getSageRecommendations } from './services/geminiService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import Workflows from './components/Workflows';
import Notes from './components/Notes';
import Calendar from './components/Calendar';
import NotificationPanel from './components/NotificationPanel';
import TaskChat from './components/TaskChat';
import GrowthConnectors from './components/GrowthConnectors';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sage_profile');
    if (saved) return JSON.parse(saved);
    // Explicitly ensure default is Dummy mode for new users
    return { ...INITIAL_PROFILE, isDummyMode: true };
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [cards, setCards] = useState<DashboardCard[]>(() => {
    const saved = localStorage.getItem('sage_cards');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Notification States
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState<SageNotification[]>(() => {
    const saved = localStorage.getItem('sage_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Task Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DashboardCard | null>(null);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const refreshRecommendations = useCallback(async () => {
    if (!profile.onboarded) return;
    setIsLoading(true);

    let newCards: DashboardCard[] = [];
    if (profile.isDummyMode) {
      await new Promise(r => setTimeout(r, 800));
      newCards = DUMMY_CARDS;
    } else {
      newCards = await getSageRecommendations(profile);
    }
    
    setCards(prev => {
      // If we switched to dummy mode, we replace everything with dummy cards
      if (profile.isDummyMode) {
        localStorage.setItem('sage_cards', JSON.stringify(newCards));
        return newCards.map(c => ({ ...c, status: c.status || 'todo' }));
      }
      
      const existingIds = new Set(prev.map(c => c.id));
      const freshCards = newCards.filter(c => !existingIds.has(c.id)).map(c => ({
        ...c,
        status: 'todo' as TaskStatus
      }));
      const updated = [...prev, ...freshCards];
      localStorage.setItem('sage_cards', JSON.stringify(updated));
      return updated;
    });

    if (newCards.length > 0) {
      const newNotif: SageNotification = {
        id: Date.now().toString(),
        title: profile.isDummyMode ? 'Simulated Insights' : 'New Path Revealed',
        message: profile.isDummyMode 
          ? 'Sage has loaded the default developmental path for your profile.'
          : `Sage has computed ${newCards.length} new insights for your journey.`,
        timestamp: Date.now(),
        type: 'insight',
        read: false,
        actionLabel: 'View Sanctum'
      };
      setNotifications(prev => {
        const updated = [newNotif, ...prev].slice(0, 20);
        localStorage.setItem('sage_notifications', JSON.stringify(updated));
        return updated;
      });
    }

    setIsLoading(false);
  }, [profile]);

  useEffect(() => {
    if (!profile.onboarded) return;

    const interval = setInterval(() => {
      const pendingTasks = cards.filter(c => c.status === 'todo');
      if (pendingTasks.length > 0) {
        const lastNotif = notifications[0];
        const isRecent = lastNotif && (Date.now() - lastNotif.timestamp < 1000 * 60 * 30);
        
        if (!isRecent) {
          const task = pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
          const nudge: SageNotification = {
            id: `nudge-${Date.now()}`,
            title: 'Presence Check',
            message: `Seeker, your focus remains on "${task.title}". Shall we advance this task to communion?`,
            timestamp: Date.now(),
            type: 'nudge',
            read: false,
            actionLabel: 'Start Task',
            cardId: task.id
          };
          setNotifications(prev => {
            const updated = [nudge, ...prev].slice(0, 20);
            localStorage.setItem('sage_notifications', JSON.stringify(updated));
            return updated;
          });
        }
      }
    }, 1000 * 60 * 10);

    return () => clearInterval(interval);
  }, [cards, profile.onboarded, notifications]);

  useEffect(() => {
    if (profile.onboarded) {
      if (cards.length === 0) {
        refreshRecommendations();
      }
      localStorage.setItem('sage_profile', JSON.stringify(profile));
    }
  }, [profile, cards.length, refreshRecommendations]);

  const handleUpdateCardStatus = (cardId: string, newStatus: TaskStatus) => {
    setCards(prev => {
      const updated = prev.map(card => 
        card.id === cardId ? { ...card, status: newStatus } : card
      );
      localStorage.setItem('sage_cards', JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkNotifRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('sage_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNotifAction = (cardId?: string) => {
    if (cardId) {
      handleUpdateCardStatus(cardId, 'doing');
      setActiveTab('dashboard');
      const card = cards.find(c => c.id === cardId);
      if (card) {
        setSelectedTask(card);
        setIsChatOpen(true);
      }
    } else {
      setActiveTab('dashboard');
    }
    setIsNotifPanelOpen(false);
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile({ ...newProfile, isDummyMode: true });
    localStorage.setItem('sage_profile', JSON.stringify({ ...newProfile, isDummyMode: true }));
  };

  const toggleDummyMode = () => {
    const newMode = !profile.isDummyMode;
    const updated = { ...profile, isDummyMode: newMode };
    setProfile(updated);
    localStorage.setItem('sage_profile', JSON.stringify(updated));
    // Clear cards to force refresh based on mode
    setCards([]);
    localStorage.removeItem('sage_cards');
  };

  const handleOpenChatWithTask = (task: DashboardCard) => {
    setSelectedTask(task);
    setIsChatOpen(true);
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
            onUpdateCardStatus={handleUpdateCardStatus}
            onTaskClick={() => setActiveTab('workflows')}
            onAskSage={handleOpenChatWithTask}
          />
        );
      case 'workflows':
        return <Workflows />;
      case 'calendar':
        return <Calendar isDummy={profile.isDummyMode} />;
      case 'notes':
        return <Notes isDummy={profile.isDummyMode} />;
      case 'mcp':
        return <GrowthConnectors />;
      case 'settings':
        return (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            <header className="flex flex-col items-start text-left w-full space-y-1">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3E3E] tracking-tight">
                Essence Configuration
              </h2>
              <div className="flex items-center justify-between w-full">
                <p className="text-slate-400 text-sm md:text-base font-medium tracking-tight">
                  Tune the parameters of your personal advisor.
                </p>
                <button 
                  onClick={() => {
                    localStorage.removeItem('sage_profile');
                    localStorage.removeItem('sage_cards');
                    localStorage.removeItem('sage_notifications');
                    localStorage.removeItem('sage_memories');
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400 hover:text-rose-600 transition-all active:scale-95 border border-rose-100 px-4 py-2 rounded-full bg-rose-50/30 hover:bg-rose-50 shadow-sm"
                >
                  <i className="fa-solid fa-ghost text-[10px]"></i>
                  Reset Soul
                </button>
              </div>
            </header>

            <div className="max-w-3xl mx-auto space-y-8">
              {/* Dummy Mode Switch */}
              <div className="flex items-center justify-between p-8 bg-[#FAF7F2]/50 rounded-[2.5rem] border border-black/[0.03]">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all ${profile.isDummyMode ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-white text-slate-400 border border-black/5'}`}>
                    <i className={`fa-solid ${profile.isDummyMode ? 'fa-vial' : 'fa-brain'}`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3E3E3E] text-lg">Simulated Presence</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">Mock Data Environment</p>
                  </div>
                </div>
                <button 
                  onClick={toggleDummyMode}
                  className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors focus:outline-none ${profile.isDummyMode ? 'bg-amber-500' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform shadow-sm ${profile.isDummyMode ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-10">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-6">Intelligence Matrix</label>
                  <div className="flex gap-6">
                    <button 
                      disabled={profile.isDummyMode}
                      className={`flex-1 p-6 rounded-[2rem] border transition-all flex flex-col gap-3 ${!profile.isDummyMode ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm' : 'border-black/5 bg-transparent text-slate-300 opacity-40 cursor-not-allowed'}`}
                    >
                      <i className="fa-solid fa-bolt-lightning text-xl"></i>
                      <div className="text-left">
                        <span className="font-bold text-sm block">Gemini Engine</span>
                        <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">Active Awareness</span>
                      </div>
                    </button>
                    <button 
                      disabled={!profile.isDummyMode}
                      className={`flex-1 p-6 rounded-[2rem] border transition-all flex flex-col gap-3 ${profile.isDummyMode ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' : 'border-black/5 bg-transparent text-slate-300 opacity-40 cursor-not-allowed'}`}
                    >
                      <i className="fa-solid fa-box-archive text-xl"></i>
                      <div className="text-left">
                        <span className="font-bold text-sm block">Static Archive</span>
                        <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">Local Simulation</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-black/[0.03]">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-6">Biological Profile</label>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#FAF7F2]/50 p-6 rounded-[2rem] border border-black/[0.02]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Profession</span>
                      <span className="font-serif italic text-xl text-[#3E3E3E] font-bold">{profile.profession}</span>
                    </div>
                    <div className="bg-[#FAF7F2]/50 p-6 rounded-[2rem] border border-black/[0.02]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Ambition</span>
                      <span className="font-serif italic text-xl text-[#3E3E3E] font-bold">{profile.financialAmbition}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button className="bg-[#3E3E3E] text-white px-12 py-4 rounded-full text-xs font-bold hover:bg-black transition-all shadow-xl active:scale-95">
                    Save Session Parameters
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userName={profile.name}
      unreadCount={unreadCount}
      onOpenNotifications={() => setIsNotifPanelOpen(true)}
    >
      <div className="relative h-full">
        {renderContent()}
        
        {/* Global Sage Chat FAB */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-12 right-12 w-16 h-16 bg-[#3E3E3E] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-black hover:scale-110 transition-all duration-300 z-50 group"
          title="Sage Advisor"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-xl group-hover:animate-pulse"></i>
        </button>
      </div>

      <NotificationPanel 
        isOpen={isNotifPanelOpen}
        onClose={() => setIsNotifPanelOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifRead}
        onAction={handleNotifAction}
      />
      <TaskChat 
        task={selectedTask}
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedTask(null);
        }}
      />
    </Layout>
  );
};

export default App;
