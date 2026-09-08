export type SessionMode = 'EXPLORER' | 'CONFIDENT_ACTOR' | 'UNSURE_FRICTION' | 'SAFE_MODE';

export interface UserPersona {
  id: string;
  name: string;
  avatar: string;
  role: string;
  tenure: string;
  experienceLevel: 'Novice' | 'Intermediate' | 'Expert' | 'At-Risk';
  initialMode: SessionMode;
  intentDescription: string;
  frictionPoint: string;
  simulatedEvents: {
    dwellTime: number; // seconds
    categorySwitches: number;
    backtracks: number;
    finalStepHesitation: number; // seconds spent hovering on confirm
    stakeChanges: number;
    lossChasingSignal: boolean;
  };
}

export interface GameMarket {
  id: string;
  name: string;
  odds: number;
  probabilityPct: number;
  plainEnglishExplanation: string;
  riskRating: 'Low' | 'Medium' | 'High';
}

export interface GameEvent {
  id: string;
  category: 'Football' | 'Basketball' | 'Tennis' | 'Esports' | 'Casino Live';
  tournament: string;
  title: string;
  time: string;
  isLive: boolean;
  score?: string;
  matchInsight?: string;
  beginnerTip?: string;
  expertStats?: {
    formLast5: string;
    headToHead: string;
    expectedGoals?: number;
    sharpMoneyPct?: number;
  };
  markets: GameMarket[];
}

export interface BetslipItem {
  eventId: string;
  eventTitle: string;
  marketId: string;
  marketName: string;
  odds: number;
  plainEnglishExplanation: string;
}

export interface SessionTelemetry {
  dwellTimeSeconds: number;
  categorySwitches: number;
  eventsViewed: number;
  backtracks: number;
  slipOpened: boolean;
  finalStepHesitationSeconds: number;
  stakeChanges: number;
  currentStake: number;
  lossChasingSignal: boolean;
  rapidClicks: number;
  lastActionTimestamp: number;
}

export interface ExplainabilityWeight {
  factor: string;
  weight: number; // e.g. +35, -20
  direction: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

export interface SessionScores {
  sessionQualityScore: number; // 0 - 100
  intentConfidence: number; // 0 - 100
  frictionIndex: number; // 0 - 100
  riskHarmIndex: number; // 0 - 100 (high is risky)
  nextBestAction: string;
  nextBestActionRationale: string;
  explainability: ExplainabilityWeight[];
}

export interface MetricUplift {
  metric: string;
  baseline: string;
  withSessionIQ: string;
  upliftPct: string;
  description: string;
}
