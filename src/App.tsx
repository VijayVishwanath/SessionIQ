import React, { useState, useEffect, useMemo } from 'react';
import { UserPersona, GameEvent, GameMarket, BetslipItem, SessionTelemetry, SessionMode } from './types';
import { MOCK_PERSONAS, MOCK_EVENTS } from './data/mockData';
import { SessionEngine } from './services/sessionEngine';
import { Header } from './components/Header';
import { GamingLobby } from './components/GamingLobby';
import { BetslipConfirmation } from './components/BetslipConfirmation';
import { SessionIQHUD } from './components/SessionIQHUD';
import { BusinessImpactView } from './components/BusinessImpactView';
import { ComplianceView } from './components/ComplianceView';
import { TechArchitectureView } from './components/TechArchitectureView';
import { 
  Sparkles, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  Clock,
  Layers,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'roi' | 'compliance' | 'architecture'>('sandbox');
  const [activePersona, setActivePersona] = useState<UserPersona>(MOCK_PERSONAS[0]);
  const [isSlipOpen, setIsSlipOpen] = useState<boolean>(false);
  const [isHudOpen, setIsHudOpen] = useState<boolean>(false);
  const [selectedMarkets, setSelectedMarkets] = useState<BetslipItem[]>([]);

  // Real-time telemetry state
  const [telemetry, setTelemetry] = useState<SessionTelemetry>({
    dwellTimeSeconds: MOCK_PERSONAS[0].simulatedEvents.dwellTime,
    categorySwitches: MOCK_PERSONAS[0].simulatedEvents.categorySwitches,
    eventsViewed: 1,
    backtracks: MOCK_PERSONAS[0].simulatedEvents.backtracks,
    slipOpened: false,
    finalStepHesitationSeconds: MOCK_PERSONAS[0].simulatedEvents.finalStepHesitation,
    stakeChanges: MOCK_PERSONAS[0].simulatedEvents.stakeChanges,
    currentStake: 10,
    lossChasingSignal: MOCK_PERSONAS[0].simulatedEvents.lossChasingSignal,
    rapidClicks: 0,
    lastActionTimestamp: Date.now(),
  });

  // Calculate live session intelligence scores
  const evaluation = useMemo(() => {
    return SessionEngine.evaluateSession(telemetry, activePersona.experienceLevel);
  }, [telemetry, activePersona]);

  const activeMode: SessionMode = evaluation.detectedMode;

  // Gentle live clock ticker on sandbox tab
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const newDwell = prev.dwellTimeSeconds + 1;
        const newHesitation = prev.slipOpened ? prev.finalStepHesitationSeconds + 1 : prev.finalStepHesitationSeconds;
        return {
          ...prev,
          dwellTimeSeconds: newDwell,
          finalStepHesitationSeconds: newHesitation,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Switch persona handler
  const handleSelectPersona = (persona: UserPersona) => {
    setActivePersona(persona);
    setTelemetry({
      dwellTimeSeconds: persona.simulatedEvents.dwellTime,
      categorySwitches: persona.simulatedEvents.categorySwitches,
      eventsViewed: 2,
      backtracks: persona.simulatedEvents.backtracks,
      slipOpened: persona.initialMode === 'UNSURE_FRICTION',
      finalStepHesitationSeconds: persona.simulatedEvents.finalStepHesitation,
      stakeChanges: persona.simulatedEvents.stakeChanges,
      currentStake: persona.id === 'elena-risk' ? 80 : 10,
      lossChasingSignal: persona.simulatedEvents.lossChasingSignal,
      rapidClicks: 0,
      lastActionTimestamp: Date.now(),
    });

    // Populate realistic default selections for Sarah or Marcus to make the demo immediate
    if (persona.id === 'sarah-hesitant') {
      setSelectedMarkets([
        {
          eventId: 'ev-1',
          eventTitle: 'Arsenal FC vs Bayern Munich',
          marketId: 'm-1-4',
          marketName: 'Over 2.5 Total Goals',
          odds: 1.70,
          plainEnglishExplanation: '3 or more combined goals scored by both teams.',
        },
        {
          eventId: 'ev-2',
          eventTitle: 'Real Madrid vs FC Barcelona (El Clásico)',
          marketId: 'm-2-1',
          marketName: 'Real Madrid to Win (Live)',
          odds: 2.10,
          plainEnglishExplanation: 'Real Madrid scores the next winner before the 90th minute.',
        }
      ]);
      setIsSlipOpen(true);
    } else if (persona.id === 'marcus-pro') {
      setSelectedMarkets([
        {
          eventId: 'ev-3',
          eventTitle: 'Denver Nuggets vs Minnesota Timberwolves',
          marketId: 'm-3-1',
          marketName: 'Denver -4.5 Point Spread',
          odds: 1.91,
          plainEnglishExplanation: 'Denver must win by 5 points or more for this bet to win.',
        }
      ]);
      setIsSlipOpen(false);
    } else if (persona.id === 'elena-risk') {
      setSelectedMarkets([
        {
          eventId: 'ev-2',
          eventTitle: 'Real Madrid vs FC Barcelona (El Clásico)',
          marketId: 'm-2-2',
          marketName: 'Next Goal: Any Team',
          odds: 1.45,
          plainEnglishExplanation: 'At least one more goal will be scored in remaining 26 minutes.',
        }
      ]);
      setIsSlipOpen(false);
    } else {
      setSelectedMarkets([]);
      setIsSlipOpen(false);
    }
  };

  // Toggle selection
  const handleToggleMarket = (event: GameEvent, market: GameMarket) => {
    setSelectedMarkets((prev) => {
      const exists = prev.some((item) => item.marketId === market.id);
      if (exists) {
        return prev.filter((item) => item.marketId !== market.id);
      } else {
        const newItem: BetslipItem = {
          eventId: event.id,
          eventTitle: event.title,
          marketId: market.id,
          marketName: market.name,
          odds: market.odds,
          plainEnglishExplanation: market.plainEnglishExplanation,
        };
        return [...prev, newItem];
      }
    });

    setTelemetry((prev) => ({
      ...prev,
      eventsViewed: prev.eventsViewed + 1,
      lastActionTimestamp: Date.now(),
    }));
  };

  const handleRemoveMarket = (marketId: string) => {
    setSelectedMarkets((prev) => prev.filter((item) => item.marketId !== marketId));
  };

  const handleClearAll = () => {
    setSelectedMarkets([]);
  };

  const handleOpenSlip = () => {
    setIsSlipOpen(true);
    setTelemetry((prev) => ({
      ...prev,
      slipOpened: true,
      lastActionTimestamp: Date.now(),
    }));
  };

  const handleUpdateStake = (val: number) => {
    setTelemetry((prev) => ({
      ...prev,
      currentStake: val,
      stakeChanges: prev.stakeChanges + 1,
    }));
  };

  const handleConfirmSuccess = () => {
    setTelemetry((prev) => ({
      ...prev,
      finalStepHesitationSeconds: 0,
      stakeChanges: 0,
      lastActionTimestamp: Date.now(),
    }));
  };

  // Event Simulator controls
  const handleSimulateEvent = (eventType: 'dwell' | 'category' | 'backtrack' | 'hesitate' | 'risk_toggle' | 'reset') => {
    setTelemetry((prev) => {
      switch (eventType) {
        case 'dwell':
          return { ...prev, dwellTimeSeconds: prev.dwellTimeSeconds + 60 };
        case 'category':
          return { ...prev, categorySwitches: prev.categorySwitches + 1 };
        case 'backtrack':
          return { ...prev, backtracks: prev.backtracks + 1 };
        case 'hesitate':
          return { ...prev, slipOpened: true, finalStepHesitationSeconds: prev.finalStepHesitationSeconds + 15 };
        case 'risk_toggle':
          return { ...prev, lossChasingSignal: !prev.lossChasingSignal, currentStake: prev.lossChasingSignal ? 10 : 85 };
        case 'reset':
          return {
            dwellTimeSeconds: activePersona.simulatedEvents.dwellTime,
            categorySwitches: activePersona.simulatedEvents.categorySwitches,
            eventsViewed: 1,
            backtracks: activePersona.simulatedEvents.backtracks,
            slipOpened: false,
            finalStepHesitationSeconds: activePersona.simulatedEvents.finalStepHesitation,
            stakeChanges: activePersona.simulatedEvents.stakeChanges,
            currentStake: 10,
            lossChasingSignal: activePersona.simulatedEvents.lossChasingSignal,
            rapidClicks: 0,
            lastActionTimestamp: Date.now(),
          };
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" id="session-iq-root">
      
      {/* 1. Header with Persona Selector & SQS indicator */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePersona={activePersona}
        onSelectPersona={handleSelectPersona}
        scores={evaluation}
        activeMode={activeMode}
        hudOpen={isHudOpen}
        setHudOpen={setIsHudOpen}
      />

      {/* 2. Main Content Area based on Active Tab */}
      <main className="flex-1 pb-16">
        
        {/* TAB 1: Live Prototype Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
            
            {/* Persona Scenario Info Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <img 
                  src={activePersona.avatar} 
                  alt={activePersona.name} 
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200" 
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">{activePersona.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {activePersona.role}
                    </span>
                    <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                      • {activePersona.tenure}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    <strong>Current Intent:</strong> {activePersona.intentDescription}
                  </p>
                </div>
              </div>

              {/* Hackathon Problem Linkage Pill */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs shrink-0 max-w-xs">
                <span className="font-bold text-slate-800 text-[11px] block">Addressed Problem:</span>
                <span className="text-slate-600 text-[11px] leading-snug">{activePersona.frictionPoint}</span>
              </div>
            </div>

            {/* Interactive Gaming Lobby */}
            <GamingLobby
              mode={activeMode}
              activePersona={activePersona}
              selectedMarkets={selectedMarkets}
              onToggleMarket={handleToggleMarket}
              onOpenSlip={handleOpenSlip}
              onSimulateFriction={() => handleSimulateEvent('hesitate')}
              onSimulateSafeMode={() => handleSimulateEvent('risk_toggle')}
            />
          </div>
        )}

        {/* TAB 2: Business Impact & ROI (30% Weight) */}
        {activeTab === 'roi' && <BusinessImpactView />}

        {/* TAB 3: EU Compliance & Responsible Gambling Note (10% Weight) */}
        {activeTab === 'compliance' && <ComplianceView />}

        {/* TAB 4: FEG Technical Feasibility & Blueprint (15% Feasibility + 10% Product) */}
        {activeTab === 'architecture' && <TechArchitectureView />}

      </main>

      {/* 3. Real-time Final-Step Betslip Confirmation Drawer */}
      <BetslipConfirmation
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        items={selectedMarkets}
        onRemoveItem={handleRemoveMarket}
        onClearAll={handleClearAll}
        mode={activeMode}
        telemetry={telemetry}
        onUpdateStake={handleUpdateStake}
        onConfirmSuccess={handleConfirmSuccess}
        onTriggerHesitationSim={() => handleSimulateEvent('hesitate')}
      />

      {/* 4. Real-time SessionIQ HUD & SHAP Inspector Drawer */}
      <SessionIQHUD
        isOpen={isHudOpen}
        onClose={() => setIsHudOpen(false)}
        scores={evaluation}
        telemetry={telemetry}
        mode={activeMode}
        activePersona={activePersona}
        onSimulateEvent={handleSimulateEvent}
      />

      {/* Persistent Floating Telemetry Quick-Bar (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-30 flex items-center space-x-2">
        <button
          onClick={() => setIsHudOpen(true)}
          className="bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-2 rounded-2xl shadow-lg border border-slate-800 text-xs font-semibold flex items-center space-x-2 backdrop-blur-md transition-all cursor-pointer group"
          id="hud-quick-launcher"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>SQS: <strong>{evaluation.sessionQualityScore}/100</strong></span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-indigo-300 font-mono text-[11px]">{activeMode}</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
}
