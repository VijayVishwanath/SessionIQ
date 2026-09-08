import React from 'react';
import { UserPersona, SessionScores, SessionMode } from '../types';
import { MOCK_PERSONAS } from '../data/mockData';
import { 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  Code2, 
  Sparkles, 
  ChevronDown, 
  Eye, 
  UserCheck, 
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'sandbox' | 'roi' | 'compliance' | 'architecture';
  setActiveTab: (tab: 'sandbox' | 'roi' | 'compliance' | 'architecture') => void;
  activePersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  scores: SessionScores;
  activeMode: SessionMode;
  hudOpen: boolean;
  setHudOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activePersona,
  onSelectPersona,
  scores,
  activeMode,
  hudOpen,
  setHudOpen,
}) => {
  const getModeBadge = (mode: SessionMode) => {
    switch (mode) {
      case 'EXPLORER':
        return { label: 'Explorer Mode', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'CONFIDENT_ACTOR':
        return { label: 'Confident Actor', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'UNSURE_FRICTION':
        return { label: 'Hesitation Support', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'SAFE_MODE':
        return { label: 'RG Guardrail Active', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
  };

  const badge = getModeBadge(activeMode);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner with Platform Brand & Live Persona Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Pitch Tagline */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">SessionIQ</span>
                <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  FEG Hackathon
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Session-to-Action Decision Intelligence • Zero Dark Patterns
              </p>
            </div>
          </div>

          {/* Persona Switcher & Live Simulation Control */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-slate-600" />
                <span className="hidden md:inline">Test Persona:</span>
              </span>
              <div className="flex space-x-1">
                {MOCK_PERSONAS.map((p) => {
                  const isSelected = p.id === activePersona.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectPersona(p)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                      title={`${p.name} - ${p.role}`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
                      <span className="hidden lg:inline">{p.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-slate-400 hidden xl:inline">({p.experienceLevel})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Real-time Session Quality Score Pill */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-600">Session Quality</div>
                <div className="flex items-center space-x-1 font-mono font-bold text-sm text-slate-900">
                  <span>{scores.sessionQualityScore}</span>
                  <span className="text-xs font-normal text-slate-600">/100</span>
                </div>
              </div>
              <div className="h-7 w-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                <Activity className="h-4 w-4 text-indigo-600" />
              </div>
            </div>

            {/* HUD Toggle */}
            <button
              onClick={() => setHudOpen(!hudOpen)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center space-x-1 border transition-all ${
                hudOpen 
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Real-Time Telemetry & SHAP Inspector"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden md:inline">Telemetry HUD</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-slate-100 py-2">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'sandbox'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Live Prototype Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'roi'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Business Impact & ROI (30%)</span>
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'compliance'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>EU Compliance & RG Note (10%)</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>FEG Tech Feasibility (15%)</span>
            </button>
          </nav>

          {/* Current Dynamic State Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600 hidden sm:inline">Active UX State:</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badge.bg}`}>
              {badge.label}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
