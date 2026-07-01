import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Globe, 
  Plus, 
  MessageSquare, 
  Settings, 
  LogOut, 
  User,
  ChevronRight,
  Sparkles,
  Image as ImageIcon,
  Code,
  Lightbulb,
  FileText,
  X,
  Menu,
  MoreHorizontal
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_CHAT_HISTORY = [
  { id: 1, title: 'AI Room Planner Idea', timestamp: '2 hours ago', preview: 'I want to design a minimalist living room...' },
  { id: 2, title: 'FastAPI Setup Guide', timestamp: 'Yesterday', preview: 'How do I set up a FastAPI project with...' },
  { id: 3, title: 'React Component Patterns', timestamp: '2 days ago', preview: 'What are the best patterns for building...' },
  { id: 4, title: 'Docker Compose Tutorial', timestamp: '3 days ago', preview: 'Can you help me create a docker-compose...' },
  { id: 5, title: 'Python Data Structures', timestamp: '1 week ago', preview: 'Explain the differences between lists and...' },
  { id: 6, title: 'Tailwind CSS Tips', timestamp: '1 week ago', preview: 'How can I create custom animations with...' },
  { id: 7, title: 'PostgreSQL Optimization', timestamp: '2 weeks ago', preview: 'What indexes should I add for better...' },
];

const SUGGESTION_CARDS = [
  { icon: Sparkles, title: 'Creative Writing', desc: 'Help me write a short story about space exploration', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { icon: Code, title: 'Code Review', desc: 'Review my React component for best practices', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { icon: Lightbulb, title: 'Brainstorm Ideas', desc: 'Generate startup ideas for sustainable fashion', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { icon: FileText, title: 'Summarize Text', desc: 'Summarize the key points of quantum computing', color: 'bg-violet-50 text-violet-600 border-violet-200' },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'user',
    content: 'Can you help me design a modern dashboard for a SaaS product?',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    role: 'ai',
    content: `I'd be happy to help you design a modern SaaS dashboard! Here are some key principles to consider:

**1. Clean Layout & White Space**
- Use a grid-based layout with ample padding
- Prioritize information hierarchy with clear visual weight
- Consider a sidebar navigation for easy access

**2. Color Palette**
- Stick to 2-3 primary colors maximum
- Use neutral grays for backgrounds and borders
- Reserve accent colors for CTAs and important metrics

**3. Typography**
- Use a modern sans-serif font (Inter, Geist, or similar)
- Maintain clear heading hierarchy (H1: 24px, H2: 20px, H3: 16px)
- Ensure sufficient line height (1.5x) for readability

**4. Component Consistency**
- Standardize buttons, cards, and input fields
- Use consistent border radius (8-12px works well)
- Maintain uniform shadow depths for elevation

Would you like me to elaborate on any of these points or help you with specific components?`,
    timestamp: '10:31 AM',
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

const Sidebar = ({ isOpen, onClose, onNewChat, activeChatId, onSelectChat }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-100
          flex flex-col
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-50">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2.5 
                       bg-gray-900 hover:bg-gray-800 text-white 
                       py-3 px-4 rounded-xl font-medium text-sm
                       transition-all duration-200 
                       hover:shadow-lg hover:shadow-gray-900/10
                       active:scale-[0.98]"
          >
            <Plus size={18} strokeWidth={2.5} />
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Recent Conversations
          </div>
          {MOCK_CHAT_HISTORY.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`
                w-full text-left p-3 rounded-xl transition-all duration-200 group
                ${activeChatId === chat.id 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <MessageSquare 
                  size={16} 
                  className={`mt-0.5 flex-shrink-0 ${activeChatId === chat.id ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{chat.preview}</p>
                  <p className="text-[11px] text-gray-300 mt-1">{chat.timestamp}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-semibold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">john@example.com</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
                <Settings size={15} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-3 max-w-[85%] lg:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
          ${isUser 
            ? 'bg-gray-900 text-white' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border border-gray-200'
          }`}
        >
          {isUser ? 'JD' : <Sparkles size={14} />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div 
            className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
              ${isUser 
                ? 'bg-gray-900 text-white rounded-tr-sm' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
              }
            `}
          >
            {message.content.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold mt-3 mb-1 text-sm">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('- ')) {
                return <p key={i} className="ml-4 text-sm opacity-90">{line}</p>;
              }
              if (line.trim() === '') {
                return <div key={i} className="h-2" />;
              }
              return <p key={i} className="text-sm">{line}</p>;
            })}
          </div>
          <span className="text-[11px] text-gray-400 mt-1.5 px-1">{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

const WelcomeScreen = ({ onSuggestionClick }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-in fade-in duration-500">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                        flex items-center justify-center shadow-xl shadow-gray-900/20">
          <Sparkles size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Sanpo AI</h1>
        <p className="text-gray-400 text-sm">Your intelligent companion for everything</p>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTION_CARDS.map((card, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(card.desc)}
            className={`
              group p-4 rounded-2xl border text-left transition-all duration-200
              hover:shadow-md hover:-translate-y-0.5
              ${card.color}
            `}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <card.icon size={18} strokeWidth={2} />
              <span className="font-semibold text-sm">{card.title}</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Hint */}
      <p className="mt-10 text-xs text-gray-300">
        Type a message below or select a suggestion to get started
      </p>
    </div>
  );
};

const InputBar = ({ onSend, webSearchEnabled, onToggleWebSearch }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [input]);

  return (
    <div className="px-4 pb-6 pt-2">
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto relative group"
      >
        <div className={`
          relative flex items-end gap-2 
          bg-white border rounded-2xl px-4 py-3
          shadow-sm hover:shadow-md
          transition-all duration-200
          ${input.trim() ? 'border-gray-300 ring-2 ring-gray-100' : 'border-gray-200'}
        `}>
          {/* Paperclip */}
          <button
            type="button"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all flex-shrink-0"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Sanpo AI..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] text-gray-800 placeholder-gray-400 max-h-[200px] py-1.5"
            style={{ minHeight: '24px' }}
          />

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
            {/* Web Search Toggle */}
            <button
              type="button"
              onClick={onToggleWebSearch}
              className={`
                p-2 rounded-xl transition-all duration-200 flex items-center gap-1.5
                ${webSearchEnabled 
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }
              `}
              title={webSearchEnabled ? 'Web search enabled' : 'Enable web search'}
            >
              <Globe size={18} className={webSearchEnabled ? 'animate-pulse' : ''} />
              {webSearchEnabled && (
                <span className="text-xs font-medium hidden sm:inline">Search</span>
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className={`
                p-2.5 rounded-xl transition-all duration-200
                ${input.trim() 
                  ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 active:scale-95' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }
              `}
            >
              <Send size={18} className={input.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
            </button>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-[11px] text-gray-300 mt-2">
          Sanpo AI can make mistakes. Consider checking important information.
        </p>
      </form>
    </div>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────

export default function SanpoAI() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    // In a real app, you'd fetch the chat messages here
    setMessages(INITIAL_MESSAGES);
    setSidebarOpen(false);
  };

  const handleSendMessage = (content) => {
    const newUserMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: webSearchEnabled 
          ? `I searched the web for information about "${content}". Here is what I found:

**Key Findings**
- Multiple sources confirm this is an active area of development
- Recent updates from 2024 show significant progress
- Industry experts recommend careful consideration of implementation details

**Recommendations**
- Start with a proof of concept
- Consider scalability from the beginning
- Document your approach for future reference

Would you like me to dive deeper into any specific aspect?`
          : `Thank you for your message about "${content}". I\'d be happy to help you with that!

**Analysis**
- This is an interesting topic with several approaches
- The best solution depends on your specific requirements
- I can provide more detailed guidance based on your constraints

**Next Steps**
- Could you share more context about your use case?
- What are your primary goals and constraints?
- Are there any specific technologies you prefer?

I\'m here to help you work through this!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1200);
  };

  const handleSuggestionClick = (text) => {
    handleSendMessage(text);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Menu size={20} />
            </button>

            {activeChatId ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px] sm:max-w-md">
                  {MOCK_CHAT_HISTORY.find(c => c.id === activeChatId)?.title || 'New Chat'}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-400">New Chat</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {webSearchEnabled && (
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                <Globe size={12} />
                Web Search On
              </span>
            )}
            <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <InputBar 
          onSend={handleSendMessage}
          webSearchEnabled={webSearchEnabled}
          onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
        />
      </main>
    </div>
  );
}
