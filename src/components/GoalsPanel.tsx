'use client';
import { useAppStore } from '@/lib/store';
import { Target, CheckCircle, TrendingUp, AlertTriangle, Play } from 'lucide-react';
import MagicButton from './MagicButton';

export default function GoalsPanel() {
  const { goals } = useAppStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00f0ff]/20 to-[#c900ff]/20">
          <Target className="w-5 h-5 text-[#00f0ff]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Financial Goals</h3>
          <p className="text-[10px] text-[#9ca3af]">AI-optimized autonomous targets</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {goals.length === 0 ? (
          <div className="text-center text-[#9ca3af] mt-10">
            No active goals found. Ask Loma to set one up for you!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
              
              return (
                <div key={goal.id} className="glass-card p-4 rounded-xl flex flex-col gap-3 group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{goal.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border border-white/10 ${
                          goal.status === 'active' ? 'text-[#00f0ff] bg-[#00f0ff]/10' :
                          goal.status === 'achieved' ? 'text-[#00ffa3] bg-[#00ffa3]/10' :
                          'text-[#ff3366] bg-[#ff3366]/10'
                        }`}>
                          {goal.status.toUpperCase()}
                        </span>
                        {goal.priority === 1 && <span className="text-[9px] text-[#ff3366]">P1 High</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-mono font-bold text-white">₹{(goal.currentAmount / 1000).toFixed(0)}K</p>
                      <p className="text-[10px] text-[#9ca3af]">of ₹{(goal.targetAmount / 100000).toFixed(1)}L</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${progress}%`,
                        background: goal.color || '#00f0ff',
                        boxShadow: `0 0 10px ${goal.color || '#00f0ff'}`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#9ca3af]">
                    <span>{progress.toFixed(1)}%</span>
                    <span>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No Deadline'}</span>
                  </div>

                  {/* AI Strategy section */}
                  {goal.aiStrategy && (
                    <div className="mt-2 p-2 rounded-lg bg-black/20 border border-white/5 relative overflow-hidden group-hover:border-[#00f0ff]/20 transition-colors">
                      <div className="flex items-center gap-1.5 mb-1">
                        <TrendingUp className="w-3 h-3 text-[#c900ff]" />
                        <span className="text-[10px] font-bold text-[#c900ff]">AI Strategy</span>
                      </div>
                      <p className="text-[10px] text-[#a1a1aa] leading-relaxed line-clamp-2">
                        {goal.aiStrategy}
                      </p>
                      {goal.predictedCompletionDate && (
                         <div className="mt-2 flex items-center justify-between">
                           <span className="text-[9px] text-[#9ca3af] flex items-center gap-1">
                             <CheckCircle className="w-3 h-3 text-[#00ffa3]" />
                             Est: {new Date(goal.predictedCompletionDate).toLocaleDateString()}
                           </span>
                         </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-3 flex items-center gap-2">
                     <MagicButton variant="primary" size="sm" className="flex-1">
                       Add Funds
                     </MagicButton>
                     <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                       <Play className="w-3.5 h-3.5 text-white" />
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
