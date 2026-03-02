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

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Today&apos;s Summary</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>
          <strong>{summary.totalCalories}</strong> kcal consumed
        </p>
        <p>
          Protein {summary.macroTotals.protein}g • Carbs {summary.macroTotals.carbs}g • Fat {summary.macroTotals.fat}g
        </p>
        <p>
          Goal delta: <strong>{summary.goalDelta}</strong> kcal
        </p>
        <p>{summary.insights}</p>
      </IonCardContent>
    </IonCard>
  );
};
