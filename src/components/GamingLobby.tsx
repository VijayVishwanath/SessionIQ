import React, { useState } from 'react';
import { GameEvent, GameMarket, SessionMode, BetslipItem, UserPersona } from '../types';
import { MOCK_EVENTS } from '../data/mockData';
import { 
  Trophy, 
  Flame, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Shield, 
  Clock, 
  Layers, 
  Search,
  Filter,
  ArrowRight,
  AlertCircle,
  Eye,
  Sliders
} from 'lucide-react';

interface GamingLobbyProps {
  mode: SessionMode;
  activePersona: UserPersona;
  selectedMarkets: BetslipItem[];
  onToggleMarket: (event: GameEvent, market: GameMarket) => void;
  onOpenSlip: () => void;
  onSimulateFriction: () => void;
  onSimulateSafeMode: () => void;
}

export const GamingLobby: React.FC<GamingLobbyProps> = ({
  mode,
  activePersona,
  selectedMarkets,
  onToggleMarket,
  onOpenSlip,
  onSimulateFriction,
  onSimulateSafeMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOddsExplainer, setShowOddsExplainer] = useState<boolean>(mode === 'EXPLORER');

  const categories = ['All', 'Football', 'Basketball', 'Tennis', 'Esports'];

  const filteredEvents = MOCK_EVENTS.filter((ev) => {
    const matchesCategory = activeCategory === 'All' || ev.category === activeCategory;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.tournament.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isSelected = (marketId: string) => {
    return selectedMarkets.some((m) => m.marketId === marketId);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Dynamic Mode Hero Notice (Visual proof that UI morphs intelligently) */}
      {mode === 'EXPLORER' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-5 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs mt-0.5">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-slate-900 text-base">Curated Discovery Mode Active</h2>
                  <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                    Low Friction
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  We noticed you’re exploring tonight’s marquee matches. We’ve collapsed 140+ niche handicap lines and highlighted only clear, plain-English outcomes so you can browse at your own pace.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button 
                onClick={() => setShowOddsExplainer(!showOddsExplainer)}
                className="text-xs font-semibold text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors shadow-2xs"
              >
                {showOddsExplainer ? 'Hide Odds Explainer' : 'How Odds Work'}
              </button>
            </div>
          </div>

          {showOddsExplainer && (
            <div className="mt-4 pt-4 border-t border-blue-200/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="font-semibold text-slate-900">Decimal Odds (e.g. 1.85)</span>
                <p className="text-slate-600 mt-0.5">Your return = Stake × Odds. A €10 action at 1.85 returns €18.50 total (€8.50 profit).</p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="font-semibold text-slate-900">Full Time Result (1X2)</span>
                <p className="text-slate-600 mt-0.5">Valid for regular 90 mins + injury time. Extra time and penalties are separate unless specified.</p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="font-semibold text-slate-900">No Pressure Guarantee</span>
                <p className="text-slate-600 mt-0.5">Take all the time you need. No countdown timers or artificial scarcity.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'CONFIDENT_ACTOR' && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white text-sm">Specialist High-Density Mode</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md font-mono">
                  EXPRESS_UX
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explanatory banners collapsed. Live sharp money flow, xG models, and fast-keys enabled.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
            <span className="bg-slate-800 px-2.5 py-1 rounded-md">P99 Order Latency: 14ms</span>
          </div>
        </div>
      )}

      {mode === 'UNSURE_FRICTION' && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs mt-0.5">
              <Sliders className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-sm">Transparent Decision Assistance</h2>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-md">
                  Hesitation Intercepted
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                We detected hesitation around potential outcomes or payout rules. Here are the exact certified calculations, cash-out rules, and head-to-head records so you have 100% confidence before confirming.
              </p>
            </div>
          </div>
        </div>
      )}

      {mode === 'SAFE_MODE' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs mt-0.5">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-slate-900 text-base">Responsible Play Protection Active</h2>
                  <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                    EU Baseline Guardrail
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Our system detected signs of escalating stakes or extended continuous playtime. In accordance with EU Responsible Gambling standards, all promotional offers are muted, stakes are capped at €15, and cooling intervals are available.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => alert('Reality Check: You have been active for 45 minutes. A 15-minute cooling pause has been initiated.')}
                className="text-xs font-semibold text-rose-700 bg-white border border-rose-200 px-3.5 py-2 rounded-xl hover:bg-rose-50 transition-colors shadow-2xs whitespace-nowrap"
              >
                Take a 15-Min Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams, cups, leagues..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* 3. Event Cards Grid */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          return (
            <div
              key={event.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                event.isLive 
                  ? 'border-emerald-200/80 ring-1 ring-emerald-500/10' 
                  : 'border-slate-200/80 hover:border-slate-300'
              } shadow-2xs`}
            >
              {/* Event Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/40">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {event.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {event.tournament}
                  </span>
                  {event.isLive ? (
                    <span className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{event.time}</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{event.time}</span>
                    </span>
                  )}
                </div>

                {event.score && (
                  <div className="text-sm font-mono font-bold text-slate-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/80 self-start sm:self-auto">
                    Live Score: {event.score}
                  </div>
                )}
              </div>

              {/* Event Content & Match Title */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {event.title}
                    </h3>
                    
                    {/* Mode Adaptive Contextual Notes */}
                    {mode === 'EXPLORER' && event.beginnerTip && (
                      <div className="mt-2 flex items-start space-x-2 text-xs text-slate-600 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                        <HelpCircle className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span><strong className="text-blue-900">What this means:</strong> {event.beginnerTip}</span>
                      </div>
                    )}

                    {mode === 'CONFIDENT_ACTOR' && event.expertStats && (
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span>Form: <strong>{event.expertStats.formLast5}</strong></span>
                        <span>•</span>
                        <span>xG: <strong>{event.expertStats.expectedGoals}</strong></span>
                        <span>•</span>
                        <span>Sharp Flow: <strong>{event.expertStats.sharpMoneyPct}%</strong></span>
                      </div>
                    )}

                    {mode === 'UNSURE_FRICTION' && event.matchInsight && (
                      <div className="mt-2 text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 flex items-center space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span><strong>Objective Match Fact:</strong> {event.matchInsight}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Markets Selection Matrix */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 mb-2.5 uppercase tracking-wider flex items-center justify-between">
                    <span>Available Outcomes ({event.markets.length})</span>
                    {mode === 'EXPLORER' && (
                      <span className="text-blue-600 font-normal lowercase tracking-normal">
                        tap any box to add to your action slip
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {event.markets.map((market) => {
                      const active = isSelected(market.id);
                      return (
                        <button
                          key={market.id}
                          onClick={() => onToggleMarket(event, market)}
                          className={`p-3 rounded-xl border text-left transition-all relative group ${
                            active
                              ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium line-clamp-1 ${active ? 'text-indigo-100' : 'text-slate-600'}`}>
                              {market.name}
                            </span>
                            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-md ${
                              active 
                                ? 'bg-indigo-500 text-white' 
                                : 'bg-slate-100 text-slate-900 group-hover:bg-slate-200'
                            }`}>
                              {market.odds.toFixed(2)}
                            </span>
                          </div>

                          {/* Plain English Translation for Novices or Hesitants */}
                          {(mode === 'EXPLORER' || mode === 'UNSURE_FRICTION') && (
                            <p className={`text-[11px] mt-1.5 leading-snug ${active ? 'text-indigo-100' : 'text-slate-500'}`}>
                              {market.plainEnglishExplanation}
                            </p>
                          )}

                          {/* Implied Probability badge */}
                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className={active ? 'text-indigo-200' : 'text-slate-400'}>
                              Implied Chance: ~{market.probabilityPct}%
                            </span>
                            {active && (
                              <span className="flex items-center space-x-1 text-white font-semibold">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Selected</span>
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Quick Action Drawer Trigger if Markets Selected */}
      {selectedMarkets.length > 0 && (
        <div className="sticky bottom-6 z-30 max-w-2xl mx-auto">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xs">
                {selectedMarkets.length}
              </div>
              <div>
                <div className="font-semibold text-sm">Action Slip Ready</div>
                <div className="text-xs text-slate-400">
                  {selectedMarkets.length} choice{selectedMarkets.length > 1 ? 's' : ''} selected • Zero pressure
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSlip}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <span>Review Action Slip</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
