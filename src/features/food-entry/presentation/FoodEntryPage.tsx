import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
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
import {
  CUSTOM_SERVING_UNIT,
  DEFAULT_SERVING_UNIT,
  isPredefinedServingUnit,
  normalizeServingUnit,
  predefinedServingUnits,
} from "@/features/food-entry/domain/servingUnits";
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
  const [servingUnit, setServingUnit] = useState(DEFAULT_SERVING_UNIT);
  const [customServingUnit, setCustomServingUnit] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItemView[]>([]);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [summary, setSummary] = useState<DailyConsumptionSummary | null>(null);
  const [message, setMessage] = useState("");
  const [liveUpdateState, setLiveUpdateState] = useState<LiveUpdateState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      const normalized = normalizeServingUnit(suggestion.unit);
      if (isPredefinedServingUnit(normalized)) {
        setServingUnit(normalized);
        setCustomServingUnit("");
      } else {
        setServingUnit(CUSTOM_SERVING_UNIT);
        setCustomServingUnit(normalized);
      }
    }
    setSuggestions([]);
  };

  const handleLogFood = async (): Promise<void> => {
    if (isSaving) {
      return;
    }

    const resolvedServingUnit = servingUnit === CUSTOM_SERVING_UNIT ? normalizeServingUnit(customServingUnit) : servingUnit;
    const parsedQuantity = parsePositiveNumber(quantity);
    if (!foodName.trim() || !parsedQuantity || !resolvedServingUnit) {
      setMessage("Please provide food name, quantity, and serving unit.");
      return;
    }

    setIsSaving(true);
    try {
      const entry = await container.logFoodEntryUseCase.execute({
        userId: container.userId,
        foodName,
        quantity: parsedQuantity,
        servingUnit: resolvedServingUnit,
      });

      setFoodName("");
      setQuantity("1");
      setServingUnit(DEFAULT_SERVING_UNIT);
      setCustomServingUnit("");
      setSuggestions([]);
      await refreshDashboard();
      setMessage(`Logged ${entry.foodName} (${entry.nutritionSnapshot.calories} kcal).`);
    } catch {
      setMessage("Failed to log food entry. Please try again.");
    } finally {
      setIsSaving(false);
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
    <>
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
            <IonLabel position="stacked">Serving Type</IonLabel>
            <IonSelect
              value={servingUnit}
              onIonChange={(event) => {
                setServingUnit(event.detail.value ?? DEFAULT_SERVING_UNIT);
              }}
            >
              {predefinedServingUnits.map((unit) => (
                <IonSelectOption key={unit.value} value={unit.value}>
                  {unit.label}
                </IonSelectOption>
              ))}
              <IonSelectOption value={CUSTOM_SERVING_UNIT}>Custom</IonSelectOption>
            </IonSelect>
          </IonItem>
          {servingUnit === CUSTOM_SERVING_UNIT ? (
            <IonItem>
              <IonLabel position="stacked">Custom Serving Unit</IonLabel>
              <IonInput
                value={customServingUnit}
                placeholder="e.g. scoop"
                onIonInput={(event) => {
                  setCustomServingUnit(event.detail.value ?? "");
                }}
              />
            </IonItem>
          ) : null}

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
    </>
  );
};
