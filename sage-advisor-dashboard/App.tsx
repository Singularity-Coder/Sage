
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, DashboardCard, TaskStatus, SageNotification } from './types';
import { INITIAL_PROFILE } from './constants';
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
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
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
    const newCards = await getSageRecommendations(profile);
    
    // Merge new cards into existing, defaulting status to 'todo'
    setCards(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const freshCards = newCards.filter(c => !existingIds.has(c.id)).map(c => ({
        ...c,
        status: 'todo' as TaskStatus
      }));
      const updated = [...prev, ...freshCards];
      localStorage.setItem('sage_cards', JSON.stringify(updated));
      return updated;
    });

    // Create a new notification about new recommendations
    if (newCards.length > 0) {
      const newNotif: SageNotification = {
        id: Date.now().toString(),
        title: 'New Path Revealed',
        message: `Sage has computed ${newCards.length} new insights for your journey.`,
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

  // Periodic check for pending tasks to nudge the user
  useEffect(() => {
    if (!profile.onboarded) return;

    const interval = setInterval(() => {
      const pendingTasks = cards.filter(c => c.status === 'todo');
      if (pendingTasks.length > 0) {
        // Only nudge if we haven't nudged recently (last 30 mins)
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
    }, 1000 * 60 * 10); // Every 10 minutes

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
            onUpdateCardStatus={handleUpdateCardStatus}
            onTaskClick={(task) => setSelectedTask(task)}
          />
        );
      case 'workflows':
        return <Workflows />;
      case 'calendar':
        return <Calendar />;
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
                    localStorage.removeItem('sage_cards');
                    localStorage.removeItem('sage_notifications');
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
