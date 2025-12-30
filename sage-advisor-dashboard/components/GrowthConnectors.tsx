
import React, { useState } from 'react';

type ConnectorTab = 'apps' | 'api' | 'mcp';

interface ConnectorItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color?: string;
  brandIcon?: boolean;
}

const APPS: ConnectorItem[] = [
  { id: 'browser', name: 'My Browser', description: 'Access the web on your own browser', icon: 'fa-chrome', brandIcon: true },
  { id: 'gmail', name: 'Gmail', description: 'Draft replies, search your inbox, and summarize email threads instantly', icon: 'fa-envelope', color: 'text-rose-500' },
  { id: 'gcal', name: 'Google Calendar', description: 'Understand your schedule, manage events, and optimize your time effectively', icon: 'fa-calendar-days', color: 'text-blue-500' },
  { id: 'gdrive', name: 'Google Drive', description: 'Access your files, search instantly, and let Sage help you manage documents intelligently', icon: 'fa-hard-drive', color: 'text-emerald-500' },
  { id: 'outlook-mail', name: 'Outlook Mail', description: 'Write, search, and manage your Outlook emails seamlessly within Sage', icon: 'fa-envelope', color: 'text-blue-600' },
  { id: 'outlook-cal', name: 'Outlook Calendar', description: 'Schedule, view, and manage your Outlook events just with a prompt', icon: 'fa-calendar-check', color: 'text-blue-400' },
  { id: 'github', name: 'GitHub', description: 'Manage repositories, track code changes, and collaborate on team projects', icon: 'fa-github', brandIcon: true },
  { id: 'slack', name: 'Slack', description: 'Stay on top of conversations, track key messages, and let Sage help you follow team activity', icon: 'fa-slack', brandIcon: true },
  { id: 'notion', name: 'Notion', description: 'Search workspace content, update notes, and automate workflows in Notion', icon: 'fa-note-sticky', color: 'text-black' },
  { id: 'zapier', name: 'Zapier', description: 'Connect Sage and automate workflows across thousands of apps', icon: 'fa-bolt', color: 'text-orange-500' },
  { id: 'dify', name: 'Dify', description: 'Connect Dify and orchestrate AI-powered workflows across your favorite tools', icon: 'fa-link', color: 'text-blue-500' },
  { id: 'cloudflare', name: 'Cloudflare', description: 'Manage Cloudflare Workers, build applications, and deploy online resources', icon: 'fa-cloud', color: 'text-orange-400' },
  { id: 'posthog', name: 'PostHog', description: 'Perform product analytics, manage feature flags, and run experiments', icon: 'fa-chart-line', color: 'text-slate-700' },
  { id: 'playwright', name: 'Playwright', description: 'Automate browsers for testing, scraping, and more with Playwright', icon: 'fa-mask', color: 'text-emerald-500' },
  { id: 'jam', name: 'Jam', description: 'Analyze screen recordings, context, and issues automatically', icon: 'fa-bug', color: 'text-rose-400' },
  { id: 'canva', name: 'Canva', description: 'Discover, autofill, and export Canva designs in one place', icon: 'fa-palette', color: 'text-blue-400' },
  { id: 'webflow', name: 'Webflow', description: 'Manage Webflow sites, edit pages, and organize your CMS content with ease', icon: 'fa-window-maximize', color: 'text-blue-600' },
  { id: 'wix', name: 'Wix', description: 'Search website data, access content, and automate workflows within Wix', icon: 'fa-brush', color: 'text-slate-800' },
  { id: 'fireflies', name: 'Fireflies', description: 'Automate meeting transcription and conversation insights', icon: 'fa-file-audio', color: 'text-purple-600' },
  { id: 'tldv', name: 'tl;dv', description: 'Streamline meeting workflows with transcriptions and call highlights', icon: 'fa-clock-rotate-left', color: 'text-slate-500' },
  { id: 'sentry', name: 'Sentry', description: 'Review errors, analyze root causes, and suggest fixes for rapid issue resolution', icon: 'fa-triangle-exclamation', color: 'text-slate-800' },
  { id: 'huggingface', name: 'Hugging Face', description: 'Explore AI models, access datasets, and discover the latest research trends', icon: 'fa-face-smile', color: 'text-amber-400' },
  { id: 'hubspot', name: 'HubSpot', description: 'Search CRM data, track contacts, and analyze sales and marketing insights', icon: 'fa-hubspot', brandIcon: true, color: 'text-orange-500' },
  { id: 'intercom', name: 'Intercom', description: 'Access customer conversations, analyze feedback, and generate actionable insights', icon: 'fa-intercom', brandIcon: true, color: 'text-black' },
  { id: 'stripe', name: 'Stripe', description: 'Streamline business billing, payments, and account management', icon: 'fa-stripe', brandIcon: true, color: 'text-indigo-600' },
  { id: 'paypal', name: 'PayPal for Business', description: 'Manage transactions, invoices, and business operations efficiently', icon: 'fa-paypal', brandIcon: true, color: 'text-blue-800' },
  { id: 'revenuecat', name: 'RevenueCat', description: 'Manage subscription apps, control entitlements, and automate workflows', icon: 'fa-cat', color: 'text-rose-500' },
  { id: 'close', name: 'Close', description: 'Automate your sales leads pipeline with Close CRM', icon: 'fa-crosshairs', color: 'text-blue-500' },
  { id: 'xero', name: 'Xero', description: 'View financial data, generate reports, and gain personalized business insights', icon: 'fa-file-invoice-dollar', color: 'text-blue-400' },
  { id: 'airtable', name: 'Airtable', description: 'Organize structured data, manage records, and collaborate with your team', icon: 'fa-table-list', color: 'text-blue-500' },
  { id: 'asana', name: 'Asana', description: 'Streamline project and task management with Asana', icon: 'fa-asana', brandIcon: true, color: 'text-rose-500' },
  { id: 'monday', name: 'monday.com', description: 'Coordinate tasks, manage boards, and streamline your project workflows', icon: 'fa-calendar-days', color: 'text-amber-500' },
  { id: 'make', name: 'Make', description: 'Turn Make workflows into AI tools for intelligent automation execution', icon: 'fa-gears', color: 'text-purple-600' },
  { id: 'linear', name: 'Linear', description: 'Track issues, manage projects, and organize workflows across your team', icon: 'fa-lines-leaning', color: 'text-indigo-500' },
  { id: 'atlassian', name: 'Atlassian', description: 'Search, create, and manage Jira, Confluence, and Compass', icon: 'fa-atlassian', brandIcon: true, color: 'text-blue-600' },
  { id: 'clickup', name: 'ClickUp', description: 'Automate task management and project workflows with ClickUp', icon: 'fa-angles-up', color: 'text-purple-500' },
  { id: 'supabase', name: 'Supabase', description: 'Manage Supabase projects, query databases, and organize data efficiently', icon: 'fa-bolt', color: 'text-emerald-500' },
  { id: 'vercel', name: 'Vercel', description: 'Manage Vercel projects, deployments, and domains', icon: 'fa-triangle', brandIcon: true, color: 'text-black' },
  { id: 'neon', name: 'Neon', description: 'Use natural language to query and manage Postgres', icon: 'fa-bolt-lightning', color: 'text-emerald-400' },
  { id: 'prisma', name: 'Prisma Postgres', description: 'Connect to Postgres, manage databases, and query data securely and efficiently', icon: 'fa-database', color: 'text-slate-800' },
  { id: 'firecrawl', name: 'Firecrawl', description: 'Unlock powerful web scraping, crawling, and search capabilities', icon: 'fa-fire', color: 'text-orange-600' },
  { id: 'todoist', name: 'Todoist', description: 'Organize your to-dos, streamline projects, and boost productivity', icon: 'fa-list-check', color: 'text-rose-600' },
  { id: 'zoominfo', name: 'ZoomInfo', description: 'Access comprehensive B2B contact and company intelligence data', icon: 'fa-address-card', color: 'text-red-500' },
  { id: 'metabase', name: 'Metabase', description: 'Access Metabase data analytics with caching and response optimization', icon: 'fa-chart-pie', color: 'text-blue-400' },
  { id: 'explorium', name: 'Explorium', description: 'Access comprehensive business and contact data for AI-powered insights', icon: 'fa-binoculars', color: 'text-indigo-500' },
  { id: 'serena', name: 'Serena', description: 'Unlock efficient code management with Serena\'s semantic and editing tools', icon: 'fa-code', color: 'text-slate-500' },
  { id: 'wrike', name: 'Wrike', description: 'Manage projects, organize tasks, and collaborate seamlessly in Wrike', icon: 'fa-check-double', color: 'text-emerald-600' },
  { id: 'heygen', name: 'HeyGen', description: 'Create lifelike AI avatars, generate voices, and produce realistic videos', icon: 'fa-video', color: 'text-blue-500' },
  { id: 'invideo', name: 'Invideo', description: 'Transform ideas into professional videos and create engaging visual stories', icon: 'fa-clapperboard', color: 'text-indigo-400' },
  { id: 'hume', name: 'Hume', description: 'Create expressive text-to-speech audio with Hume AI', icon: 'fa-waveform', color: 'text-purple-500' },
  { id: 'line', name: 'LINE', description: 'Connect to LINE Official Accounts for automated messaging', icon: 'fa-line', brandIcon: true, color: 'text-emerald-500' },
  { id: 'jotform', name: 'Jotform', description: 'Create, manage, and collect data through powerful online forms', icon: 'fa-wpforms', color: 'text-orange-600' },
  { id: 'pophive', name: 'PopHIVE', description: 'Access public health data from PopHIVE dashboards', icon: 'fa-hive', color: 'text-slate-500' },
  { id: 'minimax', name: 'MiniMax', description: 'Generate speech, music, images, and videos with MiniMax', icon: 'fa-wave-square', color: 'text-rose-500' },
];

const APIS: ConnectorItem[] = [
  { id: 'openai', name: 'OpenAI', description: 'Leverage GPT model series for intelligent text generation and processing', icon: 'fa-robot', color: 'text-emerald-600' },
  { id: 'anthropic', name: 'Anthropic', description: 'Access reliable AI assistant services with safe and intelligent conversations', icon: 'fa-a', color: 'text-amber-700' },
  { id: 'gemini', name: 'Google Gemini', description: 'Process multimodal content including text, images, and code seamlessly', icon: 'fa-google', brandIcon: true, color: 'text-blue-500' },
  { id: 'perplexity', name: 'Perplexity', description: 'Search real-time information and get accurate answers with reliable citations', icon: 'fa-magnifying-glass', color: 'text-emerald-500' },
  { id: 'cohere', name: 'Cohere', description: 'Build enterprise AI applications and optimize text processing workflows', icon: 'fa-network-wired', color: 'text-emerald-400' },
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'Generate realistic voices, clone speech, and create custom audio content', icon: 'fa-volume-high', color: 'text-slate-800' },
  { id: 'grok', name: 'Grok', description: 'Access real-time information and engage in intelligent conversations', icon: 'fa-x-twitter', brandIcon: true, color: 'text-black' },
  { id: 'openrouter', name: 'OpenRouter', description: 'Unified interface for accessing various AI models through a single API', icon: 'fa-route', color: 'text-indigo-500' },
  { id: 'ahrefs', name: 'Ahrefs', description: 'Integrate SEO and marketing data for enhanced digital growth strategy', icon: 'fa-arrow-up-right-dots', color: 'text-blue-500' },
  { id: 'supabase-api', name: 'Supabase API', description: 'Manage Postgres databases with authentication, file storage, and more', icon: 'fa-bolt', color: 'text-emerald-500' },
  { id: 'polygon', name: 'Polygon.io', description: 'Access real-time and historical market data for stocks, forex, crypto, and options', icon: 'fa-gem', color: 'text-blue-500' },
  { id: 'mailchimp', name: 'Mailchimp Marketing', description: 'Manage audiences, send campaigns, and track email marketing performance', icon: 'fa-envelope-open-text', color: 'text-yellow-400' },
  { id: 'apollo', name: 'Apollo', description: 'Automate B2B sales prospecting, lead generation, and deal execution', icon: 'fa-rocket', color: 'text-yellow-500' },
  { id: 'jsonbin', name: 'JSONBin.io', description: 'Store and manage JSON data with fast API access for development projects', icon: 'fa-code', color: 'text-blue-600' },
  { id: 'typeform', name: 'Typeform', description: 'Create forms, collect responses, and manage webhooks', icon: 'fa-square-check', color: 'text-slate-700' },
  { id: 'heygen-api', name: 'HeyGen API', description: 'Generate AI-powered videos with realistic avatars with HeyGen API', icon: 'fa-video', color: 'text-blue-600' },
  { id: 'similarweb', name: 'Similarweb', description: 'Analyze website traffic and gain competitive market intelligence insights', icon: 'fa-magnifying-glass-chart', color: 'text-slate-800' },
  { id: 'dropbox', name: 'Dropbox', description: 'Manage files, folders, and sharing in Dropbox', icon: 'fa-dropbox', brandIcon: true, color: 'text-blue-600' },
  { id: 'flux', name: 'Flux', description: 'Create stunning AI-generated images with diverse artistic styles and concepts', icon: 'fa-palette', color: 'text-slate-700' },
  { id: 'kling', name: 'Kling', description: 'Generate high-quality AI video content and bring creative visual concepts to life', icon: 'fa-film', color: 'text-black' },
  { id: 'tripo', name: 'Tripo AI', description: 'Transform text or images into detailed 3D models quickly and efficiently', icon: 'fa-cubes', color: 'text-yellow-600' },
  { id: 'n8n', name: 'n8n', description: 'Create automated workflows and seamlessly connect different applications', icon: 'fa-diagram-project', color: 'text-rose-500' },
  { id: 'stripe-api', name: 'Stripe API', description: 'Programmatically manage transactions, and automate billing for your business', icon: 'fa-stripe', brandIcon: true, color: 'text-indigo-600' },
  { id: 'cloudflare-api', name: 'Cloudflare API', description: 'Automate and manage your web infrastructure with the Cloudflare API', icon: 'fa-cloud', color: 'text-orange-400' },
];

const GrowthConnectors: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConnectorTab>('apps');
  const [searchQuery, setSearchQuery] = useState('');
  const [mcpDropdownOpen, setMcpDropdownOpen] = useState(false);

  const filteredItems = (activeTab === 'apps' ? APPS : APIS).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <header className="flex flex-col items-start text-left w-full space-y-1">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3E3E] tracking-tight">
          Sense Extensions
        </h2>
        <div className="flex items-center justify-between w-full">
          <p className="text-slate-400 text-sm md:text-base font-medium tracking-tight">
            Local and cloud Model Context Protocol connectivity.
          </p>
        </div>
      </header>

      <div className="bg-[#FAF7F2]/40 rounded-[2.5rem] border border-black/[0.03] p-6 space-y-6">
        {/* Top Banner */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-black/5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-[1.5rem] bg-[#FAF7F2] flex items-center justify-center text-2xl border border-black/5">
              <i className="fa-brands fa-chrome text-slate-700"></i>
            </div>
            <div>
              <h3 className="font-bold text-[#3E3E3E]">My Browser</h3>
              <p className="text-xs text-slate-400 mt-0.5">Let Sage access your personalized context and perform tasks directly in your browser.</p>
            </div>
          </div>
          <button className="bg-[#3E3E3E] text-white px-8 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all active:scale-95 shadow-sm">
            Connect
          </button>
        </div>

        {/* Navigation & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-black/[0.03] pb-2">
          <div className="flex gap-2">
            {(['apps', 'api', 'mcp'] as ConnectorTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-[#3E3E3E]' : 'text-slate-300 hover:text-slate-500'
                }`}
              >
                {tab === 'mcp' ? 'Custom MCP' : tab === 'api' ? 'Custom API' : 'Apps'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3E3E3E] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 border border-black/5 rounded-full pl-10 pr-4 py-2 text-xs focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'mcp' ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 text-2xl border border-black/5 mb-6">
                <i className="fa-solid fa-plug"></i>
              </div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-10">No custom MCP added yet.</p>
              
              <div className="relative">
                <button 
                  onClick={() => setMcpDropdownOpen(!mcpDropdownOpen)}
                  className="bg-white border border-black/5 px-8 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 text-[#3E3E3E] hover:border-black/20 transition-all shadow-sm active:scale-95"
                >
                  <i className="fa-solid fa-plus"></i>
                  Add custom MCP
                  <i className={`fa-solid fa-chevron-down text-[8px] transition-transform ${mcpDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {mcpDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/5 rounded-2xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <button className="w-full text-left px-5 py-4 text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 border-b border-black/5">
                      <i className="fa-solid fa-file-code opacity-50"></i>
                      Import by JSON
                    </button>
                    <button className="w-full text-left px-5 py-4 text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                      <i className="fa-solid fa-sliders opacity-50"></i>
                      Direct configuration
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'api' && (
                <div className="bg-indigo-50/50 p-6 rounded-[1.5rem] border border-indigo-100 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-indigo-200 shadow-sm text-indigo-400">
                    <i className="fa-solid fa-key text-[10px]"></i>
                  </div>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-relaxed">
                    Connect Sage programmatically to any third-party service using your own API keys.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === 'api' && (
                  <div className="bg-white/40 p-6 rounded-[1.5rem] border border-dashed border-black/10 flex items-center gap-4 cursor-pointer hover:bg-white/60 transition-all group h-full">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-300 group-hover:text-[#3E3E3E] transition-all border border-black/5 shadow-sm shrink-0">
                      <i className="fa-solid fa-plus text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-400 group-hover:text-[#3E3E3E] transition-colors uppercase tracking-widest">Add custom API</h4>
                    </div>
                  </div>
                )}
                {filteredItems.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-[1.5rem] border border-black/5 hover:border-black/10 hover:shadow-[0_8px_20px_rgba(0,0,0,0.02)] transition-all flex gap-4 items-start group cursor-pointer relative overflow-hidden h-full">
                    <div className={`w-12 h-12 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-xl shrink-0 border border-black/5 transition-transform group-hover:scale-105 ${item.color || 'text-slate-600'}`}>
                      <i className={`${item.brandIcon ? 'fa-brands' : 'fa-solid'} ${item.icon}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#3E3E3E] text-sm mb-1">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-10">
                <p className="text-xs font-medium text-slate-400">
                  Can't find what you're looking for? <button className="text-[#3E3E3E] font-bold hover:underline">Let us know!</button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrowthConnectors;
