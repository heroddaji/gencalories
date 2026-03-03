import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import type { ReactElement } from "react";
import type { DailyConsumptionSummary } from "@/shared/types/core";

interface DailySummaryCardProps {
  summary: DailyConsumptionSummary | null;
  title?: string;
}

const macroBarPalette = {
  protein: "#22c55e",
  carbs: "#f59e0b",
  fat: "#ef4444",
} as const;

export const DailySummaryCard = ({
  summary,
  title = "Today's Summary",
}: DailySummaryCardProps): ReactElement => {
  if (!summary) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{title}</IonCardTitle>
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

  const macroBreakdown = [
    { key: "protein", label: "Protein", value: summary.macroTotals.protein },
    { key: "carbs", label: "Carbs", value: summary.macroTotals.carbs },
    { key: "fat", label: "Fat", value: summary.macroTotals.fat },
  ] as const;
  const macroTotal = macroBreakdown.reduce((total, macro) => total + macro.value, 0);

  return (
    <IonCard className="daily-summary-card">
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
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

        <div className="daily-summary-macro-bars">
          {macroBreakdown.map((macro) => {
            const width = macroTotal > 0 ? (macro.value / macroTotal) * 100 : 0;
            return (
              <div key={macro.key} className="daily-summary-macro-row">
                <div className="daily-summary-macro-labels">
                  <span>{macro.label}</span>
                  <strong>{macro.value}g</strong>
                </div>
                <div className="daily-summary-macro-track">
                  <div
                    className="daily-summary-macro-fill"
                    style={{
                      width: `${Math.max(4, Math.min(100, width))}%`,
                      backgroundColor: macroBarPalette[macro.key],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p>
          Protein {summary.macroTotals.protein}g • Carbs {summary.macroTotals.carbs}g • Fat {summary.macroTotals.fat}g
        </p>
        <p>{summary.insights}</p>
      </IonCardContent>
    </IonCard>
  );
};
