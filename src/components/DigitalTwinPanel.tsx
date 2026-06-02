'use client';
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Activity, Play, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import MagicButton from './MagicButton';

export default function DigitalTwinPanel() {
  const { simulationScenarios, activeSimulation, runSimulation } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const active = activeSimulation;
  const results = active?.results;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(185,0,255,0.2), rgba(255,0,127,0.2))' }}>
          <Activity className="w-5 h-5 text-[#b900ff]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Digital Twin — Mirror Universe</h3>
          <p className="text-[10px] text-[#9ca3af]">Monte Carlo • 10,000 simulations per scenario</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Scenario Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Scenarios</h4>
          {simulationScenarios.map(s => (
            <div key={s.id} onClick={() => setSelectedId(s.id)}
              className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${selectedId === s.id ? 'border-[#b900ff]/40 shadow-[0_0_12px_rgba(185,0,255,0.3)]' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-white">{s.name}</h5>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  s.status === 'completed' ? 'bg-[#10b981]/20 text-[#10b981]' :
                  s.status === 'running' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                  'bg-white/5 text-[#9ca3af]'
                }`}>
                  {s.status === 'running' && <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />}
                  {s.status}
                </span>
              </div>
              <p className="text-[11px] text-[#9ca3af] mb-3">{s.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(s.parameters).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="text-[10px]">
                    <span className="text-[#6b7280]">{k.replace(/([A-Z])/g, ' $1').trim()}: </span>
                    <span className="text-white font-mono">{typeof v === 'number' && v > 1000 ? `₹${(v/100000).toFixed(1)}L` : v}</span>
                  </div>
                ))}
              </div>
              {selectedId === s.id && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <MagicButton onClick={() => runSimulation(s.id)} variant="secondary" size="sm" icon={<Play className="w-3.5 h-3.5" />}
                    loading={s.status === 'running'} disabled={s.status === 'running'}>
                    {s.status === 'running' ? 'Simulating...' : 'Run Simulation'}
                  </MagicButton>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Results Panel */}
        {results && (
          <div className="space-y-4 animate-fade-in-up">
            <h4 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Simulation Results
            </h4>

            {/* Success Probability */}
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#9ca3af]">Success Probability</span>
                <span className="text-2xl font-bold text-gradient-magic">{(results.successProbability * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{
                  width: `${results.successProbability * 100}%`,
                  background: results.successProbability > 0.7 ? 'linear-gradient(90deg, #10b981, #00e5ff)' : 'linear-gradient(90deg, #f59e0b, #ef4444)'
                }} />
              </div>
            </div>

            {/* Percentile Distribution */}
            <div className="glass-card p-4 rounded-xl">
              <h5 className="text-xs font-medium text-white mb-3">Outcome Distribution</h5>
              <div className="space-y-2">
                {[
                  { label: 'Best Case (P90)', value: results.percentiles.p90, color: '#10b981' },
                  { label: 'Optimistic (P75)', value: results.percentiles.p75, color: '#00e5ff' },
                  { label: 'Expected (P50)', value: results.percentiles.p50, color: '#b900ff' },
                  { label: 'Conservative (P25)', value: results.percentiles.p25, color: '#f59e0b' },
                  { label: 'Worst Case (P10)', value: results.percentiles.p10, color: '#ef4444' },
                ].map(p => (
                  <div key={p.label} className="flex items-center gap-3">
                    <span className="text-[10px] text-[#9ca3af] w-28">{p.label}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{
                        width: `${Math.min(100, (p.value / results.percentiles.p90) * 100)}%`,
                        background: p.color,
                      }} />
                    </div>
                    <span className="text-[11px] font-mono text-white w-16 text-right">₹{(p.value / 100000).toFixed(1)}L</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Chart (simplified bar representation) */}
            <div className="glass-card p-4 rounded-xl">
              <h5 className="text-xs font-medium text-white mb-3">36-Month Projection</h5>
              <div className="flex items-end gap-[2px] h-32">
                {results.timeline.map((t, i) => {
                  const maxBal = Math.max(...results.timeline.map(x => x.balance));
                  const h = (t.balance / maxBal) * 100;
                  return (
                    <div key={i} className="flex-1 group relative cursor-pointer" style={{ height: '100%' }}>
                      <div className="absolute bottom-0 w-full rounded-t-sm transition-all duration-300 group-hover:opacity-100 opacity-80"
                        style={{
                          height: `${h}%`,
                          background: `linear-gradient(180deg, rgba(0,229,255,${0.3 + t.confidence * 0.5}), rgba(185,0,255,${0.2 + t.confidence * 0.3}))`,
                        }}
                      />
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#1a1a24] border border-[#00e5ff]/20 rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <p className="text-[9px] text-white">Month {t.month}</p>
                        <p className="text-[9px] text-[#00e5ff] font-mono">₹{(t.balance / 1000).toFixed(0)}K</p>
                        <p className="text-[8px] text-[#9ca3af]">Confidence: {(t.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-[#6b7280]">
                <span>Month 1</span><span>Month 12</span><span>Month 24</span><span>Month 36</span>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="glass-card p-4 rounded-xl">
              <h5 className="text-xs font-medium text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" /> Risk Factors
              </h5>
              {results.riskFactors.map((r, i) => (
                <p key={i} className="text-[11px] text-[#9ca3af] py-1 border-b border-white/5 last:border-0">• {r}</p>
              ))}
            </div>

            {/* Recommendation */}
            <div className="glass-card p-4 rounded-xl border-[#10b981]/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white leading-relaxed">{results.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
