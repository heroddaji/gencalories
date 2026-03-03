import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppContainer } from "@/app/di/container";
import { DailySummaryCard } from "@/features/daily-summary/presentation/DailySummaryCard";
import { mealTypeLabels, mealTypeOrder } from "@/features/food-entry/domain/mealTypes";
import { AddFoodToMealPage } from "@/features/food-entry/presentation/AddFoodToMealPage";
import {
  CUSTOM_SERVING_UNIT,
  DEFAULT_SERVING_UNIT,
  normalizeServingUnit,
  predefinedServingUnits,
} from "@/features/food-entry/domain/servingUnits";
import type { LiveUpdateState } from "@/app/di/contracts";
import type {
  DailyConsumptionSummary,
  FoodEntry,
  MealType,
  NutritionSnapshot,
} from "@/shared/types/core";
import { toDateKey } from "@/shared/utils/date";
import { versionInfo } from "@/shared/versionInfo";

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
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editServingUnit, setEditServingUnit] = useState(DEFAULT_SERVING_UNIT);
  const [editCustomServingUnit, setEditCustomServingUnit] = useState("");

  const mealSummaries = useMemo(() => summarizeMeals(entries), [entries]);

  const refreshDashboard = useCallback(async () => {
    const [nextEntries, nextSummary] = await Promise.all([
      container.listDailyEntriesUseCase.execute(container.userId, today),
      container.dailySummaryService.forDate(container.userId, today),
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

  const handleMealDataChanged = async (nextMessage?: string): Promise<void> => {
    await refreshDashboard();
    if (nextMessage) {
      setMessage(nextMessage);
    }
  };

  const startEditingEntry = (entry: FoodEntry): void => {
    setEditingEntryId(entry.id);
    setEditQuantity(String(entry.quantity));
    setEditServingUnit(
      predefinedServingUnits.some((unit) => unit.value === entry.servingUnit)
        ? entry.servingUnit
        : CUSTOM_SERVING_UNIT,
    );
    setEditCustomServingUnit(
      predefinedServingUnits.some((unit) => unit.value === entry.servingUnit)
        ? ""
        : entry.servingUnit,
    );
  };

  const cancelEditing = (): void => {
    setEditingEntryId(null);
    setEditQuantity("");
    setEditServingUnit(DEFAULT_SERVING_UNIT);
    setEditCustomServingUnit("");
  };

  const handleSaveEntry = async (entry: FoodEntry): Promise<void> => {
    const parsedQuantity = Number(editQuantity);
    const normalizedUnit =
      editServingUnit === CUSTOM_SERVING_UNIT
        ? normalizeServingUnit(editCustomServingUnit)
        : editServingUnit;

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0 || !normalizedUnit) {
      setMessage("Please provide valid quantity and serving unit before saving.");
      return;
    }

    await container.updateFoodEntryUseCase.execute({
      entry,
      quantity: parsedQuantity,
      servingUnit: normalizedUnit,
    });
    await refreshDashboard();
    cancelEditing();
    setMessage(`Updated ${entry.foodName}.`);
  };

  const handleDeleteEntry = async (entry: FoodEntry): Promise<void> => {
    await container.deleteFoodEntryUseCase.execute(container.userId, entry.id);
    await refreshDashboard();
    if (editingEntryId === entry.id) {
      cancelEditing();
    }
    setMessage(`Removed ${entry.foodName}.`);
  };

  const entriesByMeal = useMemo(() => {
    const grouped: Record<MealType, FoodEntry[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    for (const entry of entries) {
      grouped[entry.mealType].push(entry);
    }

    return grouped;
  }, [entries]);

  if (mealInAddMode) {
    return (
      <AddFoodToMealPage
        container={container}
        dateKey={today}
        mealType={mealInAddMode}
        onBack={() => {
          void refreshDashboard();
          setMealInAddMode(null);
        }}
        onChanged={async (nextMessage?: string) => {
          await handleMealDataChanged(nextMessage);
        }}
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
            const mealEntries = entriesByMeal[mealType];
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

                <div className="meal-entry-list">
                  {mealEntries.length === 0 ? (
                    <IonText color="medium">
                      <small>No items in {mealTypeLabels[mealType]} yet.</small>
                    </IonText>
                  ) : (
                    mealEntries.map((entry) => {
                      const isEditing = editingEntryId === entry.id;
                      return (
                        <div key={entry.id} className="meal-entry-row">
                          <div>
                            <strong>{entry.foodName}</strong>
                            <p>
                              {entry.nutritionSnapshot.calories} kcal • {entry.quantity} {entry.servingUnit} • {formatTime(entry.consumedAt)}
                            </p>
                          </div>

                          {isEditing ? (
                            <div className="meal-entry-edit-grid">
                              <IonInput
                                type="number"
                                value={editQuantity}
                                placeholder="Qty"
                                onIonInput={(event) => {
                                  setEditQuantity(event.detail.value ?? "");
                                }}
                              />
                              <IonSelect
                                value={editServingUnit}
                                onIonChange={(event) => {
                                  setEditServingUnit(event.detail.value ?? DEFAULT_SERVING_UNIT);
                                }}
                              >
                                {predefinedServingUnits.map((unit) => (
                                  <IonSelectOption key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </IonSelectOption>
                                ))}
                                <IonSelectOption value={CUSTOM_SERVING_UNIT}>Custom</IonSelectOption>
                              </IonSelect>
                              {editServingUnit === CUSTOM_SERVING_UNIT ? (
                                <IonInput
                                  value={editCustomServingUnit}
                                  placeholder="Custom unit"
                                  onIonInput={(event) => {
                                    setEditCustomServingUnit(event.detail.value ?? "");
                                  }}
                                />
                              ) : null}
                              <div className="meal-entry-actions">
                                <IonButton size="small" onClick={() => void handleSaveEntry(entry)}>
                                  Save
                                </IonButton>
                                <IonButton size="small" fill="clear" onClick={cancelEditing}>
                                  Cancel
                                </IonButton>
                              </div>
                            </div>
                          ) : (
                            <div className="meal-entry-actions">
                              <IonButton size="small" fill="outline" onClick={() => startEditingEntry(entry)}>
                                Edit
                              </IonButton>
                              <IonButton
                                size="small"
                                color="danger"
                                fill="clear"
                                onClick={() => void handleDeleteEntry(entry)}
                              >
                                Remove
                              </IonButton>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
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
              <br />
              App {versionInfo.appVersion} • Build {versionInfo.bundleVersion}
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
