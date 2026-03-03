import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useMemo, useState } from "react";
import type { AppContainer } from "@/app/di/container";
import { mealTypeLabels } from "@/features/food-entry/domain/mealTypes";
import {
  CUSTOM_SERVING_UNIT,
  DEFAULT_SERVING_UNIT,
  normalizeServingUnit,
  predefinedServingUnits,
} from "@/features/food-entry/domain/servingUnits";
import type { FoodEntry, MealType } from "@/shared/types/core";
import { formatDateLabel } from "@/shared/utils/date";

interface AddFoodToMealPageProps {
  container: AppContainer;
  dateKey: string;
  mealType: MealType;
  onBack: () => void;
  onChanged: (message?: string) => Promise<void>;
}

const parsePositiveNumber = (value: string): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

export const AddFoodToMealPage = ({
  container,
  dateKey,
  mealType,
  onBack,
  onChanged,
}: AddFoodToMealPageProps): JSX.Element => {
  const [query, setQuery] = useState("");
  const [availableFoods, setAvailableFoods] = useState<string[]>([]);
  const [mealEntries, setMealEntries] = useState<FoodEntry[]>([]);
  const [quantity, setQuantity] = useState("1");
  const [servingUnit, setServingUnit] = useState(DEFAULT_SERVING_UNIT);
  const [customServingUnit, setCustomServingUnit] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editServingUnit, setEditServingUnit] = useState(DEFAULT_SERVING_UNIT);
  const [editCustomServingUnit, setEditCustomServingUnit] = useState("");
  const [message, setMessage] = useState("");
  const [isSavingFood, setIsSavingFood] = useState(false);
  const [savingFoodName, setSavingFoodName] = useState<string | null>(null);

  const mealLabel = useMemo(() => mealTypeLabels[mealType], [mealType]);
  const dateLabel = useMemo(() => formatDateLabel(dateKey), [dateKey]);

  const loadMealEntries = useMemo(
    () => async (): Promise<void> => {
      const entries = await container.listDailyEntriesUseCase.execute(container.userId, dateKey);
      setMealEntries(entries.filter((entry) => entry.mealType === mealType));
    },
    [container, dateKey, mealType],
  );

  useEffect(() => {
    void loadMealEntries();
  }, [loadMealEntries]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loadFoods = async (): Promise<void> => {
        const foods = await container.foodSearchProvider.searchFoods(query, 30);
        setAvailableFoods(foods);
      };

      void loadFoods();
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [container, query]);

  const resolveConsumedAt = (): string => {
    const date = new Date(`${dateKey}T12:00:00`);
    return date.toISOString();
  };

  const handleAddFood = async (foodName: string): Promise<void> => {
    if (isSavingFood) {
      return;
    }

    const parsedQuantity = parsePositiveNumber(quantity);
    const resolvedServingUnit =
      servingUnit === CUSTOM_SERVING_UNIT
        ? normalizeServingUnit(customServingUnit)
        : servingUnit;

    if (!parsedQuantity || !resolvedServingUnit) {
      setMessage("Please provide a valid quantity and serving unit.");
      return;
    }

    setIsSavingFood(true);
    setSavingFoodName(foodName);
    try {
      await container.logFoodEntryUseCase.execute({
        userId: container.userId,
        foodName,
        mealType,
        quantity: parsedQuantity,
        servingUnit: resolvedServingUnit,
        consumedAt: resolveConsumedAt(),
      });

      await loadMealEntries();
      await onChanged(`Added ${foodName} to ${mealLabel}.`);
    } catch {
      setMessage(`Unable to add ${foodName}. Please try again.`);
    } finally {
      setIsSavingFood(false);
      setSavingFoodName(null);
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
    const resolvedServingUnit =
      editServingUnit === CUSTOM_SERVING_UNIT
        ? normalizeServingUnit(editCustomServingUnit)
        : editServingUnit;

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0 || !resolvedServingUnit) {
      setMessage("Please provide valid quantity and serving unit.");
      return;
    }

    await container.updateFoodEntryUseCase.execute({
      entry,
      quantity: parsedQuantity,
      servingUnit: resolvedServingUnit,
    });
    await loadMealEntries();
    await onChanged(`Updated ${entry.foodName}.`);
    cancelEditing();
  };

  const handleDeleteEntry = async (entry: FoodEntry): Promise<void> => {
    await container.deleteFoodEntryUseCase.execute(container.userId, entry.id);
    await loadMealEntries();
    await onChanged(`Removed ${entry.foodName}.`);
    if (editingEntryId === entry.id) {
      cancelEditing();
    }
  };

  return (
    <IonCard className="add-food-card">
      <IonCardHeader>
        <div className="add-food-header-row">
          <IonButton fill="clear" onClick={onBack}>
            <IonIcon icon={arrowBackOutline} slot="start" />
            Back
          </IonButton>
          <IonCardTitle>
            {mealLabel} • {dateLabel}
          </IonCardTitle>
        </div>
      </IonCardHeader>

      <IonCardContent>
        <IonText color="medium">
          <p>Manage foods in {mealLabel}: add new, edit quantity/unit, or remove items.</p>
        </IonText>

        <div className="meal-entry-list">
          {mealEntries.length === 0 ? (
            <IonText color="medium">
              <small>No items in this meal yet.</small>
            </IonText>
          ) : (
            mealEntries.map((entry) => {
              const isEditing = editingEntryId === entry.id;
              return (
                <div key={entry.id} className="meal-entry-row">
                  <div>
                    <strong>{entry.foodName}</strong>
                    <p>
                      {entry.nutritionSnapshot.calories} kcal • {entry.quantity} {entry.servingUnit}
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

        <IonItem>
          <IonLabel position="stacked">Search available foods</IonLabel>
          <IonInput
            value={query}
            placeholder="Search food catalog"
            onIonInput={(event) => {
              setQuery(event.detail.value ?? "");
            }}
          />
        </IonItem>

        <div className="add-food-controls">
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
        </div>

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

        {availableFoods.length === 0 ? (
          <IonText color="medium">
            <p>No foods found.</p>
          </IonText>
        ) : (
          <IonList inset>
            {availableFoods.map((food) => (
              <IonItem key={food}>
                <IonLabel>{food}</IonLabel>
                <IonButton
                  slot="end"
                  onClick={() => {
                    void handleAddFood(food);
                  }}
                  disabled={isSavingFood}
                >
                  {isSavingFood && savingFoodName === food ? "Adding..." : "Add"}
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonNote color="medium">
          Nutrition is resolved from local catalog using selected quantity and serving unit.
        </IonNote>

        {message ? (
          <IonText color="danger">
            <p>{message}</p>
          </IonText>
        ) : null}
      </IonCardContent>
    </IonCard>
  );
};
