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
import type { MealType } from "@/shared/types/core";

interface AddFoodToMealPageProps {
  container: AppContainer;
  mealType: MealType;
  onBack: () => void;
  onAdded: (message: string) => Promise<void>;
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
  mealType,
  onBack,
  onAdded,
}: AddFoodToMealPageProps): JSX.Element => {
  const [query, setQuery] = useState("");
  const [availableFoods, setAvailableFoods] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("1");
  const [servingUnit, setServingUnit] = useState(DEFAULT_SERVING_UNIT);
  const [customServingUnit, setCustomServingUnit] = useState("");
  const [message, setMessage] = useState("");
  const [isSavingFood, setIsSavingFood] = useState(false);
  const [savingFoodName, setSavingFoodName] = useState<string | null>(null);

  const mealLabel = useMemo(() => mealTypeLabels[mealType], [mealType]);

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
      });

      await onAdded(`Added ${foodName} to ${mealLabel}.`);
    } catch {
      setMessage(`Unable to add ${foodName}. Please try again.`);
    } finally {
      setIsSavingFood(false);
      setSavingFoodName(null);
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
          <IonCardTitle>Add Food to {mealLabel}</IonCardTitle>
        </div>
      </IonCardHeader>

      <IonCardContent>
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
