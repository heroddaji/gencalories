import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from "@ionic/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AppContainer } from "@/app/di/container";
import { DailySummaryCard } from "@/features/daily-summary/presentation/DailySummaryCard";
import type { DailyConsumptionSummary } from "@/shared/types/core";
import { addDaysToDateKey, formatDateLabel, toDateKey } from "@/shared/utils/date";

interface SummaryPageProps {
  container: AppContainer;
}

export const SummaryPage = ({ container }: SummaryPageProps): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [summary, setSummary] = useState<DailyConsumptionSummary | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const dateLabel = useMemo(() => formatDateLabel(selectedDate), [selectedDate]);

  const refreshSummary = useCallback(async (): Promise<void> => {
    const nextSummary = await container.dailySummaryService.forDate(container.userId, selectedDate);
    setSummary(nextSummary);
  }, [container, selectedDate]);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary]);

  const handleShiftDate = (delta: number): void => {
    setSelectedDate((current) => addDaysToDateKey(current, delta));
  };

  return (
    <div
      onTouchStart={(event) => {
        touchStartXRef.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartXRef.current;
        const end = event.changedTouches[0]?.clientX;
        if (start === null || typeof end !== "number") {
          return;
        }

        const deltaX = end - start;
        if (Math.abs(deltaX) < 40) {
          return;
        }

        handleShiftDate(deltaX < 0 ? 1 : -1);
      }}
    >
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Daily Summary Browser</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="date-nav-row">
            <IonButton size="small" fill="outline" onClick={() => handleShiftDate(-1)}>
              Prev Day
            </IonButton>
            <IonText color="medium">
              <strong>{dateLabel}</strong>
            </IonText>
            <IonButton size="small" fill="outline" onClick={() => handleShiftDate(1)}>
              Next Day
            </IonButton>
          </div>
          <IonText color="medium">
            <small>Tip: Swipe left/right anywhere on this tab to change day.</small>
          </IonText>
        </IonCardContent>
      </IonCard>

      <DailySummaryCard summary={summary} title={`Summary • ${dateLabel}`} />
    </div>
  );
};
