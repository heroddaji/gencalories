import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from "@ionic/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppContainer } from "@/app/di/container";
import { DailySummaryCard } from "@/features/daily-summary/presentation/DailySummaryCard";
import { mealTypeLabels, mealTypeOrder } from "@/features/food-entry/domain/mealTypes";
import { AddFoodToMealPage } from "@/features/food-entry/presentation/AddFoodToMealPage";
import type { LiveUpdateState } from "@/app/di/contracts";
import type {
  DailyConsumptionSummary,
  FoodEntry,
  MealType,
  NutritionSnapshot,
} from "@/shared/types/core";
import { toDateKey } from "@/shared/utils/date";

interface FoodEntryPageProps {
  container: AppContainer;
}

const formatTime = (isoTime: string): string => {
  return new Date(isoTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

type MealSummary = NutritionSnapshot & { count: number };

const createEmptyMealSummary = (): MealSummary => ({
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  count: 0,
});

const toRoundedMealSummary = (source: MealSummary): MealSummary => ({
  calories: Math.round(source.calories),
  protein: Math.round(source.protein * 10) / 10,
  carbs: Math.round(source.carbs * 10) / 10,
  fat: Math.round(source.fat * 10) / 10,
  count: source.count,
});

const summarizeMeals = (entries: FoodEntry[]): Record<MealType, MealSummary> => {
  const mealTotals: Record<MealType, MealSummary> = {
    breakfast: createEmptyMealSummary(),
    lunch: createEmptyMealSummary(),
    dinner: createEmptyMealSummary(),
    snack: createEmptyMealSummary(),
  };

  for (const entry of entries) {
    const current = mealTotals[entry.mealType];
    current.calories += entry.nutritionSnapshot.calories;
    current.protein += entry.nutritionSnapshot.protein;
    current.carbs += entry.nutritionSnapshot.carbs;
    current.fat += entry.nutritionSnapshot.fat;
    current.count += 1;
  }

  return {
    breakfast: toRoundedMealSummary(mealTotals.breakfast),
    lunch: toRoundedMealSummary(mealTotals.lunch),
    dinner: toRoundedMealSummary(mealTotals.dinner),
    snack: toRoundedMealSummary(mealTotals.snack),
  };
};

export const FoodEntryPage = ({ container }: FoodEntryPageProps): JSX.Element => {
  const today = useMemo(() => toDateKey(new Date()), []);

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [summary, setSummary] = useState<DailyConsumptionSummary | null>(null);
  const [message, setMessage] = useState("");
  const [liveUpdateState, setLiveUpdateState] = useState<LiveUpdateState | null>(null);
  const [mealInAddMode, setMealInAddMode] = useState<MealType | null>(null);

  const mealSummaries = useMemo(() => summarizeMeals(entries), [entries]);

  const refreshDashboard = useCallback(async () => {
    const [nextEntries, nextSummary] = await Promise.all([
      container.listDailyEntriesUseCase.execute(today),
      container.dailySummaryService.forDate(today),
    ]);

    setEntries(nextEntries);
    setSummary(nextSummary);
  }, [container, today]);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      await refreshDashboard();
      await container.syncProvider.syncNow();

      const currentState = await container.liveUpdateProvider.getState();
      setLiveUpdateState(currentState);

      const check = await container.liveUpdateProvider.checkForUpdate();
      if (check.hasUpdate && check.nextBundleVersion) {
        try {
          await container.liveUpdateProvider.applyUpdate(check.nextBundleVersion);
          const updatedState = await container.liveUpdateProvider.getState();
          setLiveUpdateState(updatedState);
          setMessage(`Applied live update ${check.nextBundleVersion}.`);
        } catch {
          await container.liveUpdateProvider.rollback("Update application failed.");
          const rollbackState = await container.liveUpdateProvider.getState();
          setLiveUpdateState(rollbackState);
          setMessage("Update failed and was rolled back to bundled baseline.");
        }
      }
    };

    void initialize();
  }, [container, refreshDashboard]);

  const handleAddedToMeal = async (nextMessage: string): Promise<void> => {
    await refreshDashboard();
    setMealInAddMode(null);
    setMessage(nextMessage);
  };

  if (mealInAddMode) {
    return (
      <AddFoodToMealPage
        container={container}
        mealType={mealInAddMode}
        onBack={() => {
          setMealInAddMode(null);
        }}
        onAdded={handleAddedToMeal}
      />
    );
  }

  return (
    <>
      <DailySummaryCard summary={summary} />

      <IonCard className="meal-breakdown-card">
        <IonCardHeader>
          <IonCardTitle>Meals</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {mealTypeOrder.map((mealType) => {
            const mealSummary = mealSummaries[mealType];
            return (
              <div key={mealType} className="meal-breakdown-row">
                <div className="meal-breakdown-values">
                  <h3>{mealTypeLabels[mealType]}</h3>
                  <p>
                    Calories {mealSummary.calories} • Protein {mealSummary.protein}g • Carbs {mealSummary.carbs}g • Fat {mealSummary.fat}g
                  </p>
                  <IonText color="medium">
                    <small>{mealSummary.count} foods logged</small>
                  </IonText>
                </div>
                <div className="meal-breakdown-actions">
                  <IonButton
                    size="small"
                    onClick={() => {
                      setMealInAddMode(mealType);
                    }}
                  >
                    Add Food
                  </IonButton>
                </div>
              </div>
            );
          })}
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Logged Foods ({today})</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {entries.length === 0 ? (
            <p>No entries yet for today.</p>
          ) : (
            <IonList>
              {entries.map((entry) => (
                <IonItem key={entry.id}>
                  <IonLabel>
                    <h3>{entry.foodName}</h3>
                    <p>
                      {mealTypeLabels[entry.mealType]} • {entry.quantity} {entry.servingUnit} • {entry.nutritionSnapshot.calories} kcal • {formatTime(entry.consumedAt)}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Live Update State</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {liveUpdateState ? (
            <p>
              Bundle <strong>{liveUpdateState.currentBundleVersion}</strong> • applied {new Date(liveUpdateState.appliedAt).toLocaleString()}
              {liveUpdateState.rollbackReason ? ` • rollback: ${liveUpdateState.rollbackReason}` : ""}
            </p>
          ) : (
            <p>Checking update state…</p>
          )}
        </IonCardContent>
      </IonCard>

      {message ? (
        <IonText color="success">
          <p>{message}</p>
        </IonText>
      ) : null}
    </>
  );
};
