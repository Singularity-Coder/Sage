
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
      if (card) setSelectedTask(card);
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
            onTaskClick={(task) => setSelectedTask(task)}
          />
        );
      case 'workflows':
        return <Workflows />;
      case 'calendar':
        return <Calendar isDummy={profile.isDummyMode} />;
      case 'notes':
        return <Notes isDummy={profile.isDummyMode} />;
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
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-3xl font-serif font-bold mb-8 text-slate-800">Essence Configuration</h2>
            
            <div className="space-y-8">
              {/* Dummy Mode Switch */}
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-indigo-100/50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${profile.isDummyMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                    <i className={`fa-solid ${profile.isDummyMode ? 'fa-vial-circle-check' : 'fa-brain-circuit'}`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Simulated Presence (Dummy Data)</h3>
                    <p className="text-xs text-slate-500 font-medium">When active, Sage uses pre-defined static data instead of the Gemini API.</p>
                  </div>
                </div>
                <button 
                  onClick={toggleDummyMode}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${profile.isDummyMode ? 'bg-amber-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${profile.isDummyMode ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Core Intelligence Provider</label>
                <div className="flex gap-4">
                  <button 
                    disabled={profile.isDummyMode}
                    className={`flex-1 p-5 rounded-[2rem] border-2 transition-all flex flex-col gap-2 ${!profile.isDummyMode ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-100 text-slate-300 cursor-not-allowed'}`}
                  >
                    <i className="fa-solid fa-sparkles text-xl"></i>
                    <span className="font-bold text-sm">Gemini Flash</span>
                    <span className="text-[10px] opacity-70">Real-time awareness</span>
                  </button>
                  <button 
                    disabled={!profile.isDummyMode}
                    className={`flex-1 p-5 rounded-[2rem] border-2 transition-all flex flex-col gap-2 ${profile.isDummyMode ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-300 cursor-not-allowed'}`}
                  >
                    <i className="fa-solid fa-microchip text-xl"></i>
                    <span className="font-bold text-sm">Static Vault</span>
                    <span className="text-[10px] opacity-70">Mock data stream</span>
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Profile Synthesis</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-[1.5rem]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Profession</span>
                    <span className="font-bold text-slate-800">{profile.profession}</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-[1.5rem]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ambition</span>
                    <span className="font-bold text-slate-800">{profile.financialAmbition}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-center">
                 <button 
                  onClick={() => {
                    localStorage.removeItem('sage_profile');
                    localStorage.removeItem('sage_cards');
                    localStorage.removeItem('sage_notifications');
                    localStorage.removeItem('sage_memories');
                    window.location.reload();
                  }}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                >
                  Reset Soul Data
                </button>
                <button className="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-slate-200">
                  Save Changes
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
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userName={profile.name}
      unreadCount={unreadCount}
      onOpenNotifications={() => setIsNotifPanelOpen(true)}
    >
      {renderContent()}
      <NotificationPanel 
        isOpen={isNotifPanelOpen}
        onClose={() => setIsNotifPanelOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifRead}
        onAction={handleNotifAction}
      />
      <TaskChat 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </Layout>
  );
};

export default App;
