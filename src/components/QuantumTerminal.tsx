'use client';
import { useState, useRef, useEffect } from 'react';
import { TerminalSquare, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export default function QuantumTerminal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: 'boot-1', type: 'system', text: 'LOMAX NEO QUANTUM KERNEL v9.0.1 INITIALIZED' },
    { id: 'boot-2', type: 'system', text: 'Type /help for a list of available commands.' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { netWorth } = useAppStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const pushLine = (type: TerminalLine['type'], text: string) => {
    setHistory(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), type, text }]);
  };

  const parseCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case '/help':
        pushLine('output', 'AVAILABLE COMMANDS:');
        pushLine('output', '  /networth            - Display current active net worth');
        pushLine('output', '  /transfer [amt]      - Simulate a quick transfer');
        pushLine('output', '  /lock-card [id]      - Immediately freeze a card');
        pushLine('output', '  /clear               - Clear terminal history');
        pushLine('output', '  /exit                - Close the terminal');
        break;
      case '/networth':
        pushLine('output', `CURRENT NET WORTH: ₹${(netWorth / 100000).toFixed(2)}L`);
        break;
      case '/transfer':
        if (args[1]) {
          pushLine('system', `EXECUTING TRANSFER OF ₹${args[1]}...`);
          setTimeout(() => pushLine('output', 'TRANSFER COMPLETE. HASH: 0x9f8a...2b1c'), 800);
        } else {
          pushLine('error', 'ERR: Missing amount parameter. Usage: /transfer [amt]');
        }
        break;
      case '/lock-card':
        if (args[1]) {
          pushLine('system', `BROADCASTING NIGHT-LOCK PROTOCOL TO CARD ${args[1]}...`);
          setTimeout(() => pushLine('output', `CARD ${args[1]} HAS BEEN SECURED.`), 600);
        } else {
          pushLine('error', 'ERR: Missing card id. Usage: /lock-card [id]');
        }
        break;
      case '/clear':
        setHistory([]);
        break;
      case '/exit':
        onClose();
        break;
      default:
        pushLine('error', `ERR: Command not recognized: ${command}`);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!input.trim()) return;
      pushLine('input', input);
      parseCommand(input);
      setInput('');
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="absolute inset-x-8 bottom-8 h-80 glass-panel border border-[#00f0ff]/30 shadow-[0_0_50px_rgba(0,240,255,0.1)] flex flex-col overflow-hidden animate-slide-in-up z-50">
      {/* Terminal Header */}
      <div className="bg-black/40 px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <TerminalSquare className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest font-mono">QUANTUM TERMINAL // SECURE LINK</span>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
        {history.map((line) => (
          <div key={line.id} className="flex items-start gap-3">
            {line.type === 'input' && <span className="text-[#00f0ff] shrink-0">lomax@sys:~$</span>}
            {line.type === 'output' && <span className="text-[#a1a1aa] shrink-0">{'>'}</span>}
            {line.type === 'error' && <span className="text-[#ff3366] shrink-0">[ERR]</span>}
            {line.type === 'system' && <span className="text-[#c900ff] shrink-0">[SYS]</span>}
            <span className={`
              ${line.type === 'input' ? 'text-white' : ''}
              ${line.type === 'output' ? 'text-[#a1a1aa]' : ''}
              ${line.type === 'error' ? 'text-[#ff3366]' : ''}
              ${line.type === 'system' ? 'text-[#c900ff]' : ''}
            `}>
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="p-4 border-t border-white/10 bg-black/20 flex items-center gap-3">
        <span className="text-[#00f0ff] font-mono text-sm">lomax@sys:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm caret-[#00f0ff]"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
