import { SessionTelemetry, SessionScores, SessionMode, ExplainabilityWeight } from '../types';

export class SessionEngine {
  /**
   * Evaluates real-time session telemetry to produce explainable session intelligence scores.
   * Runs in sub-millisecond client or edge runtime.
   */
  public static evaluateSession(
    telemetry: SessionTelemetry,
    experienceLevel: 'Novice' | 'Intermediate' | 'Expert' | 'At-Risk'
  ): SessionScores & { detectedMode: SessionMode } {
    let friction = 0;
    let confidence = 50;
    let quality = 60;
    let risk = 0;
    const explainability: ExplainabilityWeight[] = [];

    // 1. Evaluate Risk / Harmful-Play Signals (Safety Guardrail First)
    if (telemetry.lossChasingSignal) {
      risk += 65;
      explainability.push({
        factor: 'Rapid Stake Escalation / Loss Pattern',
        weight: 65,
        direction: 'negative',
        explanation: 'Rapid doubling of stakes or repeated immediate retries after negative outcomes.',
      });
    }

    if (telemetry.stakeChanges >= 5 && telemetry.currentStake > 50) {
      risk += 25;
      explainability.push({
        factor: 'Erratic High-Value Stake Fluctuations',
        weight: 25,
        direction: 'negative',
        explanation: 'User adjusted high stake 5+ times in quick succession.',
      });
    }

    if (telemetry.dwellTimeSeconds > 300 && telemetry.categorySwitches >= 6) {
      risk += 15;
      friction += 30;
      explainability.push({
        factor: 'Disoriented Prolonged Session',
        weight: 20,
        direction: 'negative',
        explanation: 'Dwell time exceeded 5 minutes with rapid category switching.',
      });
    }

    // 2. Evaluate Final-Step Hesitation (Final-step drop-off problem)
    if (telemetry.slipOpened) {
      if (telemetry.finalStepHesitationSeconds >= 12) {
        friction += Math.min(45, telemetry.finalStepHesitationSeconds * 1.5);
        confidence -= 20;
        explainability.push({
          factor: 'Final-Step Confirmation Hesitation',
          weight: Math.round(telemetry.finalStepHesitationSeconds * 1.2),
          direction: 'negative',
          explanation: `User spent ${telemetry.finalStepHesitationSeconds}s on final confirmation without acting, indicating hesitation over terms or payout clarity.`,
        });
      } else if (telemetry.finalStepHesitationSeconds > 0 && telemetry.finalStepHesitationSeconds < 8) {
        confidence += 25;
        quality += 15;
        explainability.push({
          factor: 'Decisive Final-Step Flow',
          weight: 25,
          direction: 'positive',
          explanation: 'User moved smoothly from event selection to confirmation within healthy bounds.',
        });
      }
    }

    // 3. Evaluate Discovery & Navigation Friction
    if (telemetry.categorySwitches > 4 && telemetry.eventsViewed < 2) {
      friction += 25;
      quality -= 15;
      explainability.push({
        factor: 'Category Bouncing without Selection',
        weight: 25,
        direction: 'negative',
        explanation: 'Rapid jumping across sports tabs without expanding any market indicates discovery clutter.',
      });
    }

    if (telemetry.backtracks >= 2) {
      friction += 15;
      explainability.push({
        factor: 'Repeated Navigation Backtracking',
        weight: 15,
        direction: 'negative',
        explanation: 'User clicked back to previous screen multiple times looking for confirmation.',
      });
    }

    // 4. Evaluate Persona Sophistication & Intent Clarity
    if (experienceLevel === 'Expert') {
      confidence += 20;
      if (telemetry.dwellTimeSeconds < 90) {
        quality += 20;
        explainability.push({
          factor: 'Expert Fast-Path Navigating',
          weight: 20,
          direction: 'positive',
          explanation: 'Known specialist seeking direct market depth with high operational certainty.',
        });
      }
    } else if (experienceLevel === 'Novice') {
      if (telemetry.dwellTimeSeconds > 90 && !telemetry.slipOpened) {
        friction += 20;
        explainability.push({
          factor: 'Novice Terminology / Odds Overhead',
          weight: 20,
          direction: 'negative',
          explanation: 'First-time user lingering on complex odds table without guidance.',
        });
      }
    }

    // Clamp values 0 to 100
    risk = Math.min(100, Math.max(0, risk));
    friction = Math.min(100, Math.max(0, Math.round(friction)));
    confidence = Math.min(100, Math.max(10, Math.round(confidence - (friction * 0.3))));
    quality = Math.min(100, Math.max(15, Math.round(quality + (confidence * 0.4) - (friction * 0.4) - (risk * 0.3))));

    // Determine Mode & Next Best Action
    let detectedMode: SessionMode = 'EXPLORER';
    let nextBestAction = 'Highlight Beginner-Friendly Curated Markets';
    let nextBestActionRationale = 'New session with low market certainty. Presenting simplified outcomes and clear terminology.';

    if (risk >= 50 || experienceLevel === 'At-Risk') {
      detectedMode = 'SAFE_MODE';
      nextBestAction = 'Enforce Cooling-Off Reality Check & Suppress Promos';
      nextBestActionRationale = 'Harmful play or rapid stake escalation detected. Dark patterns suppressed, stakes capped, calm pause offered.';
    } else if (telemetry.slipOpened && (telemetry.finalStepHesitationSeconds >= 10 || telemetry.stakeChanges >= 3)) {
      detectedMode = 'UNSURE_FRICTION';
      nextBestAction = 'Provide Plain-English Rule Clarity & Cashout Guarantee';
      nextBestActionRationale = 'High intent detected at final step, but user hesitates over rules or payout structure. Reduce cognitive burden calmly.';
    } else if (experienceLevel === 'Expert' || (confidence > 70 && friction < 25)) {
      detectedMode = 'CONFIDENT_ACTOR';
      nextBestAction = 'Collapse Explanatory Clutter & Activate 1-Click Slip';
      nextBestActionRationale = 'High user competence and clear intent. Streamline screen density for maximum operational efficiency.';
    } else {
      detectedMode = 'EXPLORER';
      nextBestAction = 'Surface Curated Matches & Plain-English Odds Explanations';
      nextBestActionRationale = 'User is exploring categories. Reduce discovery paralysis by highlighting major matches with translated terms.';
    }

    return {
      sessionQualityScore: quality,
      intentConfidence: confidence,
      frictionIndex: friction,
      riskHarmIndex: risk,
      detectedMode,
      nextBestAction,
      nextBestActionRationale,
      explainability,
    };
  }
}
