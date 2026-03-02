import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppContainer } from "@/app/di/container";
import { DailySummaryCard } from "@/features/daily-summary/presentation/DailySummaryCard";
import {
  SuggestionList,
  type SuggestionItemView,
} from "@/features/food-history-suggestions/presentation/SuggestionList";
import type { LiveUpdateState } from "@/app/di/contracts";
import type {
  DailyConsumptionSummary,
  FoodEntry,
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

const parsePositiveNumber = (value: string): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export const FoodEntryPage = ({ container }: FoodEntryPageProps): JSX.Element => {
  const today = useMemo(() => toDateKey(new Date()), []);

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [servingUnit, setServingUnit] = useState("serving");
  const [dailyGoal, setDailyGoal] = useState("2000");
  const [suggestions, setSuggestions] = useState<SuggestionItemView[]>([]);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [summary, setSummary] = useState<DailyConsumptionSummary | null>(null);
  const [message, setMessage] = useState("");
  const [liveUpdateState, setLiveUpdateState] = useState<LiveUpdateState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refreshDashboard = useCallback(async () => {
    const [nextEntries, nextSummary, goal] = await Promise.all([
      container.listDailyEntriesUseCase.execute(today),
      container.dailySummaryService.forDate(today),
      container.userGoalRepository.getDailyCalorieGoal(container.userId),
    ]);

    setEntries(nextEntries);
    setSummary(nextSummary);
    setDailyGoal(String(goal));
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loadSuggestions = async (): Promise<void> => {
        if (!foodName.trim()) {
          setSuggestions([]);
          return;
        }

        const next = await container.getFoodSuggestionsUseCase.execute(foodName, 8);
        setSuggestions(next);
      };

      void loadSuggestions();
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [container, foodName]);

  const handleSelectSuggestion = (suggestion: SuggestionItemView): void => {
    setFoodName(suggestion.label);
    if (suggestion.quantity) {
      setQuantity(String(suggestion.quantity));
    }
    if (suggestion.unit) {
      setServingUnit(suggestion.unit);
    }
    setSuggestions([]);
  };

  const handleLogFood = async (): Promise<void> => {
    if (isSaving) {
      return;
    }

    const parsedQuantity = parsePositiveNumber(quantity);
    if (!foodName.trim() || !parsedQuantity || !servingUnit.trim()) {
      setMessage("Please provide food name, quantity, and serving unit.");
      return;
    }

    setIsSaving(true);
    try {
      const entry = await container.logFoodEntryUseCase.execute({
        userId: container.userId,
        foodName,
        quantity: parsedQuantity,
        servingUnit,
      });

      setFoodName("");
      setQuantity("1");
      setSuggestions([]);
      await refreshDashboard();
      setMessage(`Logged ${entry.foodName} (${entry.nutritionSnapshot.calories} kcal).`);
    } catch {
      setMessage("Failed to log food entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetGoal = async (): Promise<void> => {
    const parsedGoal = parsePositiveNumber(dailyGoal);
    if (!parsedGoal) {
      setMessage("Daily goal must be a positive number.");
      return;
    }

    try {
      await container.setDailyGoalUseCase.execute(container.userId, parsedGoal);
      await refreshDashboard();
      setMessage(`Daily goal updated to ${Math.round(parsedGoal)} kcal.`);
    } catch {
      setMessage("Unable to update daily goal.");
    }
  };

  const handleClearHistory = async (): Promise<void> => {
    await container.clearFoodHistoryUseCase.execute();
    setSuggestions([]);
    setMessage("Food history cleared.");
  };

  const handleDeleteHistoryItem = async (normalizedName: string): Promise<void> => {
    await container.deleteFoodHistoryItemUseCase.execute(normalizedName);
    const refreshed = await container.getFoodSuggestionsUseCase.execute(foodName, 8);
    setSuggestions(refreshed);
    setMessage("History item deleted.");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>GenCalories</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Add Food</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Food</IonLabel>
              <IonInput
                value={foodName}
                placeholder="e.g. chicken breast"
                onIonInput={(event) => {
                  setFoodName(event.detail.value ?? "");
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Quantity</IonLabel>
              <IonInput
                type="number"
                value={quantity}
                onIonInput={(event) => {
                  setQuantity(event.detail.value ?? "");
                }}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Serving Unit</IonLabel>
              <IonInput
                value={servingUnit}
                placeholder="serving"
                onIonInput={(event) => {
                  setServingUnit(event.detail.value ?? "");
                }}
              />
            </IonItem>

            <IonButton expand="block" onClick={() => void handleLogFood()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Log Food"}
            </IonButton>

            <IonButton expand="block" fill="clear" color="medium" onClick={() => void handleClearHistory()}>
              Clear All History
            </IonButton>

            <SuggestionList
              suggestions={suggestions}
              onSelect={handleSelectSuggestion}
              onDelete={(normalizedName) => {
                void handleDeleteHistoryItem(normalizedName);
              }}
            />
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Daily Goal</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Calorie Goal</IonLabel>
              <IonInput
                type="number"
                value={dailyGoal}
                onIonInput={(event) => {
                  setDailyGoal(event.detail.value ?? "");
                }}
              />
            </IonItem>
            <IonButton expand="block" onClick={() => void handleSetGoal()}>
              Save Goal
            </IonButton>
          </IonCardContent>
        </IonCard>

        <DailySummaryCard summary={summary} />

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
                        {entry.quantity} {entry.servingUnit} • {entry.nutritionSnapshot.calories} kcal • {formatTime(entry.consumedAt)}
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

        {message ? <p>{message}</p> : null}
      </IonContent>
    </IonPage>
  );
};
