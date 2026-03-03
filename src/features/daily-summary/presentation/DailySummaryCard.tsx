import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import type { DailyConsumptionSummary } from "@/shared/types/core";

interface DailySummaryCardProps {
  summary: DailyConsumptionSummary | null;
}

export const DailySummaryCard = ({ summary }: DailySummaryCardProps): JSX.Element => {
  if (!summary) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Today&apos;s Summary</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>Loading summary…</IonCardContent>
      </IonCard>
    );
  }

  const targetCalories = summary.goalCalories;
  const ratio = targetCalories && targetCalories > 0 ? summary.totalCalories / targetCalories : 0;
  const progress = Math.max(0, Math.min(100, ratio * 100));
  const pieStyle = {
    background: targetCalories
      ? `conic-gradient(var(--ion-color-primary) ${progress}%, var(--ion-color-light-shade) ${progress}% 100%)`
      : "conic-gradient(var(--ion-color-medium) 100%, var(--ion-color-light-shade) 0)",
  };

  return (
    <IonCard className="daily-summary-card">
      <IonCardHeader>
        <IonCardTitle>Today&apos;s Summary</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="daily-summary-progress">
          <div className="daily-summary-pie" style={pieStyle}>
            <div className="daily-summary-pie-center">
              <strong>{summary.totalCalories}</strong>
              <span>kcal</span>
            </div>
          </div>
          <div>
            <p>
              Target: <strong>{targetCalories ?? "Not set"}</strong>
            </p>
            <p>
              Goal delta: <strong>{summary.goalDelta ?? "--"}</strong>
              {summary.goalDelta === null ? "" : " kcal"}
            </p>
          </div>
        </div>
        <p>
          Protein {summary.macroTotals.protein}g • Carbs {summary.macroTotals.carbs}g • Fat {summary.macroTotals.fat}g
        </p>
        <p>{summary.insights}</p>
      </IonCardContent>
    </IonCard>
  );
};
