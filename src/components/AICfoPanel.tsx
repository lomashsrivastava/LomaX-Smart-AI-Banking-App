'use client';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Brain, Send, Sparkles, TrendingUp, AlertTriangle, Lightbulb, ChevronRight, Check, X } from 'lucide-react';
import MagicButton from './MagicButton';

const AI_RESPONSES: Record<string, string> = {
  'default': "I've analyzed your financial patterns. Your spending is well-controlled this month — 12% below your average. Your Europe Trip goal is on track. Would you like me to run a simulation?",
  'save': "Based on your patterns, here's my plan: Cancel the unused Spotify subscription (₹179/mo), switch to annual Airtel plan (saves ₹200/mo), and move ₹89,500 from current to liquid fund (earns ~₹388/mo). Total savings: ₹767/month. Shall I execute?",
  'invest': "Your risk profile suggests a balanced portfolio: 40% equity index funds, 30% debt funds, 20% gold ETF, 10% international equity. With ₹25,000/month SIP, projected corpus in 10 years: ₹52-68 lakhs (Monte Carlo, 80% confidence).",
  'spend': "This month you've spent ₹42,300. Top categories: Food & Dining ₹12,800 (30%), Shopping ₹9,200 (22%), Transport ₹6,500 (15%). You're ₹7,700 under budget. Your biggest expense was ₹4,500 at Amazon on June 1.",
  'tax': "Estimated tax liability for FY26: ₹1,84,000. I found 3 deductions you're missing: Section 80D health insurance (₹25,000), NPS contribution 80CCD(1B) (₹50,000), and home loan interest 24(b) (₹2,00,000). This could save ₹82,500 in taxes.",
};

function matchResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('save') || lower.includes('saving') || lower.includes('cut')) return AI_RESPONSES['save'];
  if (lower.includes('invest') || lower.includes('portfolio') || lower.includes('sip')) return AI_RESPONSES['invest'];
  if (lower.includes('spend') || lower.includes('expense') || lower.includes('where')) return AI_RESPONSES['spend'];
  if (lower.includes('tax') || lower.includes('deduction')) return AI_RESPONSES['tax'];
  return AI_RESPONSES['default'];
}

export default function AICfoPanel() {
  const { aiMessages, sendAiMessage, aiSuggestions } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsTyping(false); // reset typing state when new messages arrive
  }, [aiMessages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const content = input;
    setInput('');
    setIsTyping(true);
    await sendAiMessage(content);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(185,0,255,0.2))' }}>
            <Brain className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] rounded-full border-2 border-[#1a1a24]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Loma — AI CFO</h3>
          <p className="text-[10px] text-[#9ca3af]">Powered by ensemble ML • Confidence 97%</p>
        </div>
        <Sparkles className="w-4 h-4 text-[#b900ff] ml-auto animate-pulse" />
      </div>

      {/* Suggestions Bar */}
      <div className="flex gap-2 p-3 overflow-x-auto border-b border-white/5" style={{ scrollbarWidth: 'none' }}>
        {aiSuggestions.filter(s => s.status === 'pending').map(s => (
          <div key={s.id} className="flex-shrink-0 glass-card px-3 py-2 rounded-xl cursor-pointer hover:border-[#00e5ff]/30 transition-all group" style={{ minWidth: 200 }}>
            <div className="flex items-center gap-2 mb-1">
              {s.type === 'cancel_subscription' && <X className="w-3 h-3 text-[#ef4444]" />}
              {s.type === 'optimize' && <TrendingUp className="w-3 h-3 text-[#f59e0b]" />}
              {s.type === 'invest' && <Lightbulb className="w-3 h-3 text-[#10b981]" />}
              <span className="text-[11px] font-medium text-white truncate">{s.title}</span>
            </div>
            <p className="text-[10px] text-[#9ca3af] line-clamp-2">{s.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] font-bold text-[#10b981]">Save ₹{s.potentialSavings}/mo</span>
              <ChevronRight className="w-3 h-3 text-[#9ca3af] group-hover:text-[#00e5ff] transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        {aiMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-[#00e5ff]/15 border border-[#00e5ff]/20 text-white'
                : 'glass-card text-white'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              {msg.reasoning && msg.reasoning.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/5">
                  <p className="text-[10px] text-[#9ca3af] mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Reasoning chain:
                  </p>
                  {msg.reasoning.map((r, i) => (
                    <p key={i} className="text-[10px] text-[#9ca3af] pl-3">• {r}</p>
                  ))}
                </div>
              )}
              {msg.confidence && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${msg.confidence * 100}%`, background: 'linear-gradient(90deg, #00e5ff, #b900ff)' }} />
                  </div>
                  <span className="text-[9px] text-[#9ca3af]">{(msg.confidence * 100).toFixed(0)}%</span>
                </div>
              )}
              <p className="text-[9px] text-[#6b7280] mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[#b900ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[#ff007f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-[#9ca3af]">Loma is thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask Loma anything about your finances..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#6b7280] outline-none"
          />
          <MagicButton onClick={handleSend} size="sm" disabled={!input.trim() || isTyping} icon={<Send className="w-3.5 h-3.5" />}>
            Send
          </MagicButton>
        </div>
        <div className="flex gap-2 mt-2">
          {['How can I save more?', 'Show my spending', 'Tax optimization'].map(q => (
            <button key={q} onClick={() => { setInput(q); }} className="text-[10px] text-[#9ca3af] hover:text-[#00e5ff] px-2 py-1 rounded-lg border border-white/5 hover:border-[#00e5ff]/20 transition-all cursor-pointer">
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
