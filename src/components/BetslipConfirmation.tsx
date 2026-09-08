import React, { useState, useEffect } from 'react';
import { BetslipItem, SessionMode, SessionTelemetry } from '../types';
import { 
  X, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Info, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BetslipConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  items: BetslipItem[];
  onRemoveItem: (marketId: string) => void;
  onClearAll: () => void;
  mode: SessionMode;
  telemetry: SessionTelemetry;
  onUpdateStake: (stake: number) => void;
  onConfirmSuccess: () => void;
  onTriggerHesitationSim: () => void;
}

export const BetslipConfirmation: React.FC<BetslipConfirmationProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  mode,
  telemetry,
  onUpdateStake,
  onConfirmSuccess,
  onTriggerHesitationSim,
}) => {
  const [stake, setStake] = useState<number>(telemetry.currentStake || 10);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync stake changes
  const handleStakeChange = (val: number) => {
    // If safe mode is active, enforce €15 max ceiling
    if (mode === 'SAFE_MODE' && val > 15) {
      setStake(15);
      onUpdateStake(15);
      return;
    }
    setStake(val);
    onUpdateStake(val);
  };

  // Calculate composite multiplier
  const totalOdds = items.reduce((acc, item) => acc * item.odds, 1);
  const potentialReturn = (stake * totalOdds).toFixed(2);
  const netProfit = (stake * totalOdds - stake).toFixed(2);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setConfirmed(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      onConfirmSuccess();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200"
        id="betslip-drawer"
      >
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {items.length}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Action & Confirmation Slip</h2>
              <p className="text-[11px] text-slate-500">
                {mode === 'SAFE_MODE' ? 'Regulated Stake Safe Mode Active' : 'Calm & Transparent Decision Review'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {items.length > 0 && !confirmed && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-500 hover:text-slate-800 hover:underline px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {confirmed ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Action Confirmed with Confidence</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Your entry has been validated with transparent terms. A receipt has been logged to your activity ledger.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between text-slate-600">
                  <span>Stake Amount:</span>
                  <span className="font-semibold text-slate-900">€{stake.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Odds:</span>
                  <span className="font-semibold text-slate-900">{totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Potential Return:</span>
                  <span className="font-bold text-emerald-600">€{potentialReturn}</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
                  <span>Cash-Out Status:</span>
                  <span className="text-emerald-700 font-medium">Available Post-Kickoff</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setConfirmed(false);
                    onClearAll();
                    onClose();
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs"
                >
                  Done & Return to Lobby
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm font-medium">No actions selected yet.</p>
              <p className="text-xs text-slate-400 mt-1">Select an outcome in the lobby to review it here.</p>
            </div>
          ) : (
            <>
              {/* Selected Outcomes List */}
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div 
                    key={item.marketId}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl relative hover:border-slate-300 transition-all"
                  >
                    <button
                      onClick={() => onRemoveItem(item.marketId)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                      title="Remove selection"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="pr-6">
                      <div className="text-xs font-bold text-slate-900">{item.eventTitle}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {item.marketName}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          @{item.odds.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                        {item.plainEnglishExplanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. THE INNOVATION: Real-time Final-Step Hesitation Interceptor */}
              {(mode === 'UNSURE_FRICTION' || telemetry.finalStepHesitationSeconds >= 8) && (
                <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-amber-800 font-semibold">
                    <Sliders className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Decision Confidence Assistance (Zero Pressure)</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    We noticed you are taking time to review this final step. Here are three transparent facts to give you total peace of mind:
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside">
                    <li><strong>No hidden lock-ins:</strong> Early Cash-Out is supported if match conditions swing in your favor.</li>
                    <li><strong>Clear 90-minute standard:</strong> Extra time or shootouts do not invalidate standard full-time markets.</li>
                    <li><strong>Safe pacing:</strong> Your odds are guaranteed not to shift abruptly while this slip is active.</li>
                  </ul>
                </div>
              )}

              {/* Safe Mode Guardrail Banner */}
              {mode === 'SAFE_MODE' && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start space-x-2">
                  <ShieldCheck className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Guardrail Limit Active:</span>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Maximum stake is strictly capped at €15.00 to protect session sustainability. Multi-bet compounding is limited.
                    </p>
                  </div>
                </div>
              )}

              {/* Demo Helper: Trigger Hesitation simulation */}
              <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Hesitation Timer: <strong>{telemetry.finalStepHesitationSeconds}s</strong></span>
                </div>
                <button
                  onClick={onTriggerHesitationSim}
                  className="text-[11px] font-semibold text-indigo-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors shadow-2xs"
                  title="Simulate 15 seconds of hesitation on the confirm button to show how SessionIQ reacts without pressure"
                >
                  Simulate Hesitation (+15s)
                </button>
              </div>

              {/* Stake Configurator */}
              <div className="pt-2 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Your Chosen Stake</label>
                  <span className="text-xs text-slate-500 font-mono">
                    Max: {mode === 'SAFE_MODE' ? '€15 (RG Cap)' : '€250'}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">€</span>
                  <input
                    type="number"
                    min="1"
                    max={mode === 'SAFE_MODE' ? 15 : 500}
                    value={stake}
                    onChange={(e) => handleStakeChange(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>

                {/* Quick Stake Buttons */}
                <div className="flex space-x-2">
                  {[2, 5, 10, 15, 25].map((val) => {
                    const disabled = mode === 'SAFE_MODE' && val > 15;
                    return (
                      <button
                        key={val}
                        disabled={disabled}
                        onClick={() => handleStakeChange(val)}
                        className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          stake === val
                            ? 'bg-slate-900 text-white border-slate-900'
                            : disabled
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        €{val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payout & Returns Card */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Combined Odds:</span>
                  <span className="font-mono font-bold text-slate-900">{totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Net Potential Profit:</span>
                  <span className="font-mono font-bold text-slate-900">€{netProfit}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-1.5 border-t border-slate-200">
                  <span>Total Potential Return:</span>
                  <span className="font-mono text-emerald-600">€{potentialReturn}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Confirm Action Button */}
        {!confirmed && items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white space-y-2">
            <button
              onClick={handleConfirm}
              disabled={isProcessing || stake <= 0}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-indigo-400 text-white cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
              }`}
            >
              {isProcessing ? (
                <span>Validating Transparent Rules...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Confirm Informed Action (€{stake.toFixed(2)})</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <span>EU Consumer Directive Protected • 18+ Responsible Play</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
