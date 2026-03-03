import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonSelect, IonSelectOption, IonText, } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useMemo, useState } from "react";
import { mealTypeLabels } from "@/features/food-entry/domain/mealTypes";
import { CUSTOM_SERVING_UNIT, DEFAULT_SERVING_UNIT, normalizeServingUnit, predefinedServingUnits, } from "@/features/food-entry/domain/servingUnits";
import { formatDateLabel } from "@/shared/utils/date";
const parsePositiveNumber = (value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
};
export const AddFoodToMealPage = ({ container, dateKey, mealType, onBack, onChanged, }) => {
    const [query, setQuery] = useState("");
    const [availableFoods, setAvailableFoods] = useState([]);
    const [mealEntries, setMealEntries] = useState([]);
    const [quantity, setQuantity] = useState("1");
    const [servingUnit, setServingUnit] = useState(DEFAULT_SERVING_UNIT);
    const [customServingUnit, setCustomServingUnit] = useState("");
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [editQuantity, setEditQuantity] = useState("");
    const [editServingUnit, setEditServingUnit] = useState(DEFAULT_SERVING_UNIT);
    const [editCustomServingUnit, setEditCustomServingUnit] = useState("");
    const [message, setMessage] = useState("");
    const [isSavingFood, setIsSavingFood] = useState(false);
    const [savingFoodName, setSavingFoodName] = useState(null);
    const mealLabel = useMemo(() => mealTypeLabels[mealType], [mealType]);
    const dateLabel = useMemo(() => formatDateLabel(dateKey), [dateKey]);
    const loadMealEntries = useMemo(() => async () => {
        const entries = await container.listDailyEntriesUseCase.execute(container.userId, dateKey);
        setMealEntries(entries.filter((entry) => entry.mealType === mealType));
    }, [container, dateKey, mealType]);
    useEffect(() => {
        void loadMealEntries();
    }, [loadMealEntries]);
    useEffect(() => {
        const timer = window.setTimeout(() => {
            const loadFoods = async () => {
                const foods = await container.foodSearchProvider.searchFoods(query, 30);
                setAvailableFoods(foods);
            };
            void loadFoods();
        }, 120);
        return () => {
            window.clearTimeout(timer);
        };
    }, [container, query]);
    const resolveConsumedAt = () => {
        const date = new Date(`${dateKey}T12:00:00`);
        return date.toISOString();
    };
    const handleAddFood = async (foodName) => {
        if (isSavingFood) {
            return;
        }
        const parsedQuantity = parsePositiveNumber(quantity);
        const resolvedServingUnit = servingUnit === CUSTOM_SERVING_UNIT
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
        }
        catch {
            setMessage(`Unable to add ${foodName}. Please try again.`);
        }
        finally {
            setIsSavingFood(false);
            setSavingFoodName(null);
        }
    };
    const startEditingEntry = (entry) => {
        setEditingEntryId(entry.id);
        setEditQuantity(String(entry.quantity));
        setEditServingUnit(predefinedServingUnits.some((unit) => unit.value === entry.servingUnit)
            ? entry.servingUnit
            : CUSTOM_SERVING_UNIT);
        setEditCustomServingUnit(predefinedServingUnits.some((unit) => unit.value === entry.servingUnit)
            ? ""
            : entry.servingUnit);
    };
    const cancelEditing = () => {
        setEditingEntryId(null);
        setEditQuantity("");
        setEditServingUnit(DEFAULT_SERVING_UNIT);
        setEditCustomServingUnit("");
    };
    const handleSaveEntry = async (entry) => {
        const parsedQuantity = Number(editQuantity);
        const resolvedServingUnit = editServingUnit === CUSTOM_SERVING_UNIT
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
    const handleDeleteEntry = async (entry) => {
        await container.deleteFoodEntryUseCase.execute(container.userId, entry.id);
        await loadMealEntries();
        await onChanged(`Removed ${entry.foodName}.`);
        if (editingEntryId === entry.id) {
            cancelEditing();
        }
    };
    return (_jsxs(IonCard, { className: "add-food-card", children: [_jsx(IonCardHeader, { children: _jsxs("div", { className: "add-food-header-row", children: [_jsxs(IonButton, { fill: "clear", onClick: onBack, children: [_jsx(IonIcon, { icon: arrowBackOutline, slot: "start" }), "Back"] }), _jsxs(IonCardTitle, { children: [mealLabel, " \u2022 ", dateLabel] })] }) }), _jsxs(IonCardContent, { children: [_jsx(IonText, { color: "medium", children: _jsxs("p", { children: ["Manage foods in ", mealLabel, ": add new, edit quantity/unit, or remove items."] }) }), _jsx("div", { className: "meal-entry-list", children: mealEntries.length === 0 ? (_jsx(IonText, { color: "medium", children: _jsx("small", { children: "No items in this meal yet." }) })) : (mealEntries.map((entry) => {
                            const isEditing = editingEntryId === entry.id;
                            return (_jsxs("div", { className: "meal-entry-row", children: [_jsxs("div", { children: [_jsx("strong", { children: entry.foodName }), _jsxs("p", { children: [entry.nutritionSnapshot.calories, " kcal \u2022 ", entry.quantity, " ", entry.servingUnit] })] }), isEditing ? (_jsxs("div", { className: "meal-entry-edit-grid", children: [_jsx(IonInput, { type: "number", value: editQuantity, placeholder: "Qty", onIonInput: (event) => {
                                                    setEditQuantity(event.detail.value ?? "");
                                                } }), _jsxs(IonSelect, { value: editServingUnit, onIonChange: (event) => {
                                                    setEditServingUnit(event.detail.value ?? DEFAULT_SERVING_UNIT);
                                                }, children: [predefinedServingUnits.map((unit) => (_jsx(IonSelectOption, { value: unit.value, children: unit.label }, unit.value))), _jsx(IonSelectOption, { value: CUSTOM_SERVING_UNIT, children: "Custom" })] }), editServingUnit === CUSTOM_SERVING_UNIT ? (_jsx(IonInput, { value: editCustomServingUnit, placeholder: "Custom unit", onIonInput: (event) => {
                                                    setEditCustomServingUnit(event.detail.value ?? "");
                                                } })) : null, _jsxs("div", { className: "meal-entry-actions", children: [_jsx(IonButton, { size: "small", onClick: () => void handleSaveEntry(entry), children: "Save" }), _jsx(IonButton, { size: "small", fill: "clear", onClick: cancelEditing, children: "Cancel" })] })] })) : (_jsxs("div", { className: "meal-entry-actions", children: [_jsx(IonButton, { size: "small", fill: "outline", onClick: () => startEditingEntry(entry), children: "Edit" }), _jsx(IonButton, { size: "small", color: "danger", fill: "clear", onClick: () => void handleDeleteEntry(entry), children: "Remove" })] }))] }, entry.id));
                        })) }), _jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Search available foods" }), _jsx(IonInput, { value: query, placeholder: "Search food catalog", onIonInput: (event) => {
                                    setQuery(event.detail.value ?? "");
                                } })] }), _jsxs("div", { className: "add-food-controls", children: [_jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Quantity" }), _jsx(IonInput, { type: "number", value: quantity, onIonInput: (event) => {
                                            setQuantity(event.detail.value ?? "");
                                        } })] }), _jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Serving Unit" }), _jsxs(IonSelect, { value: servingUnit, onIonChange: (event) => {
                                            setServingUnit(event.detail.value ?? DEFAULT_SERVING_UNIT);
                                        }, children: [predefinedServingUnits.map((unit) => (_jsx(IonSelectOption, { value: unit.value, children: unit.label }, unit.value))), _jsx(IonSelectOption, { value: CUSTOM_SERVING_UNIT, children: "Custom" })] })] })] }), servingUnit === CUSTOM_SERVING_UNIT ? (_jsxs(IonItem, { children: [_jsx(IonLabel, { position: "stacked", children: "Custom Serving Unit" }), _jsx(IonInput, { value: customServingUnit, placeholder: "e.g. scoop", onIonInput: (event) => {
                                    setCustomServingUnit(event.detail.value ?? "");
                                } })] })) : null, availableFoods.length === 0 ? (_jsx(IonText, { color: "medium", children: _jsx("p", { children: "No foods found." }) })) : (_jsx(IonList, { inset: true, children: availableFoods.map((food) => (_jsxs(IonItem, { children: [_jsx(IonLabel, { children: food }), _jsx(IonButton, { slot: "end", onClick: () => {
                                        void handleAddFood(food);
                                    }, disabled: isSavingFood, children: isSavingFood && savingFoodName === food ? "Adding..." : "Add" })] }, food))) })), _jsx(IonNote, { color: "medium", children: "Nutrition is resolved from local catalog using selected quantity and serving unit." }), message ? (_jsx(IonText, { color: "danger", children: _jsx("p", { children: message }) })) : null] })] }));
};
