import React from 'react';
import { SessionScores, SessionTelemetry, SessionMode, UserPersona } from '../types';
import { 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Sparkles, 
  Compass, 
  Zap, 
  Sliders, 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  MousePointer, 
  Layers, 
  RefreshCw,
  X
} from 'lucide-react';

interface SessionIQHUDProps {
  isOpen: boolean;
  onClose: () => void;
  scores: SessionScores;
  telemetry: SessionTelemetry;
  mode: SessionMode;
  activePersona: UserPersona;
  onSimulateEvent: (eventType: 'dwell' | 'category' | 'backtrack' | 'hesitate' | 'risk_toggle' | 'reset') => void;
}

export const SessionIQHUD: React.FC<SessionIQHUDProps> = ({
  isOpen,
  onClose,
  scores,
  telemetry,
  mode,
  activePersona,
  onSimulateEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950 text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col justify-between font-sans">
      
      {/* HUD Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm tracking-tight text-white">SessionIQ Engine HUD</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                P99 8ms
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Real-Time Decision State & Explainability</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main HUD Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Active Persona & State Badge */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Subject Session</span>
            <div className="text-xs font-bold text-white mt-0.5">{activePersona.name} ({activePersona.experienceLevel})</div>
            <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{activePersona.role}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Detected Mode</span>
            <div className="text-xs font-mono font-bold text-indigo-400 mt-0.5">
              {mode}
            </div>
          </div>
        </div>

        {/* Real-time 4-Pillar Score Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          
          {/* 1. Session Quality Score */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Session Quality (SQS)</span>
              <Activity className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-mono text-white">{scores.sessionQualityScore}</span>
              <span className="text-[11px] text-slate-500 font-mono">/100</span>
            </div>
            <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${scores.sessionQualityScore}%` }}
              ></div>
            </div>
          </div>

          {/* 2. Intent Confidence */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Intent Confidence</span>
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-mono text-emerald-400">{scores.intentConfidence}</span>
              <span className="text-[11px] text-slate-500 font-mono">/100</span>
            </div>
            <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${scores.intentConfidence}%` }}
              ></div>
            </div>
          </div>

          {/* 3. Friction Index */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Friction Index</span>
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-bold font-mono text-amber-400">{scores.frictionIndex}</span>
              <span className="text-[11px] text-slate-500 font-mono">/100</span>
            </div>
            <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${scores.frictionIndex}%` }}
              ></div>
            </div>
          </div>

          {/* 4. Harmful-Play Risk Guard */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>RG Harm Index</span>
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className={`text-2xl font-bold font-mono ${scores.riskHarmIndex > 40 ? 'text-rose-400' : 'text-slate-300'}`}>
                {scores.riskHarmIndex}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">/100</span>
            </div>
            <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${scores.riskHarmIndex > 40 ? 'bg-rose-500' : 'bg-slate-600'}`}
                style={{ width: `${scores.riskHarmIndex}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Best Action Card */}
        <div className="bg-indigo-950/40 border border-indigo-800/60 p-3.5 rounded-xl space-y-1.5">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Next Best Action Recommendation</span>
          </div>
          <div className="text-xs font-bold text-white">{scores.nextBestAction}</div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{scores.nextBestActionRationale}</p>
        </div>

        {/* Explainability Matrix (SHAP-Style Feature Attribution) */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
              <span>Model Explainability (Attribution)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">SHAP Weights</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Why this decision? Auditable signal contributions to the active scoring vector:
          </p>

          <div className="space-y-2 pt-1">
            {scores.explainability.length === 0 ? (
              <div className="text-[11px] text-slate-500 italic">Baseline neutral session state.</div>
            ) : (
              scores.explainability.map((f, i) => {
                const isPositive = f.direction === 'positive';
                return (
                  <div key={i} className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-[11px] font-medium">{f.factor}</span>
                      <span className={`font-mono font-bold text-[11px] ${isPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isPositive ? `+${f.weight}%` : `-${f.weight}%`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(100, f.weight)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">{f.explanation}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Telemetry Stream Counters */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-200">Raw Session Telemetry Ingestion</span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Dwell Time</div>
              <div className="font-bold text-slate-200">{telemetry.dwellTimeSeconds}s</div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Category Switched</div>
              <div className="font-bold text-slate-200">{telemetry.categorySwitches}x</div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Final Slip Hesitation</div>
              <div className="font-bold text-slate-200">{telemetry.finalStepHesitationSeconds}s</div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
              <div className="text-[10px] text-slate-400">Stake Changes</div>
              <div className="font-bold text-slate-200">{telemetry.stakeChanges}x</div>
            </div>
          </div>
        </div>

        {/* Interactive Event Simulator for Live Hackathon Demo Walkthrough */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Judge Live Event Injector</span>
            <span className="text-[10px] font-mono text-slate-400">Simulate Events</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onSimulateEvent('hesitate')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 text-left flex items-center justify-between transition-colors"
            >
              <span>+15s Slip Hesitation</span>
              <Clock className="h-3 w-3 text-amber-400" />
            </button>
            <button
              onClick={() => onSimulateEvent('category')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 text-left flex items-center justify-between transition-colors"
            >
              <span>Switch Category (+1)</span>
              <Layers className="h-3 w-3 text-blue-400" />
            </button>
            <button
              onClick={() => onSimulateEvent('dwell')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 text-left flex items-center justify-between transition-colors"
            >
              <span>+60s Aimless Dwell</span>
              <MousePointer className="h-3 w-3 text-purple-400" />
            </button>
            <button
              onClick={() => onSimulateEvent('risk_toggle')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-left flex items-center justify-between transition-colors ${
                telemetry.lossChasingSignal ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <span>{telemetry.lossChasingSignal ? 'Clear Harm Signal' : 'Inject Stake Surge'}</span>
              <ShieldAlert className="h-3 w-3 text-rose-400" />
            </button>
          </div>
          
          <button
            onClick={() => onSimulateEvent('reset')}
            className="w-full py-1.5 bg-slate-800/60 hover:bg-slate-800 text-[11px] text-slate-400 hover:text-white rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Telemetry to Persona Baseline</span>
          </button>
        </div>

      </div>

      {/* HUD Footer */}
      <div className="p-3 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono bg-slate-900/60">
        SessionIQ Edge Scoring Kernel • Latency &lt;15ms • Fully Explainable
      </div>
    </div>
  );
};
