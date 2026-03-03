import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonSelect, IonSelectOption, IonText, } from "@ionic/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DailySummaryCard } from "@/features/daily-summary/presentation/DailySummaryCard";
import { mealTypeLabels, mealTypeOrder } from "@/features/food-entry/domain/mealTypes";
import { AddFoodToMealPage } from "@/features/food-entry/presentation/AddFoodToMealPage";
import { CUSTOM_SERVING_UNIT, DEFAULT_SERVING_UNIT, normalizeServingUnit, predefinedServingUnits, } from "@/features/food-entry/domain/servingUnits";
import { toDateKey } from "@/shared/utils/date";
import { versionInfo } from "@/shared/versionInfo";
const formatTime = (isoTime) => {
    return new Date(isoTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};
const createEmptyMealSummary = () => ({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    count: 0,
});
const toRoundedMealSummary = (source) => ({
    calories: Math.round(source.calories),
    protein: Math.round(source.protein * 10) / 10,
    carbs: Math.round(source.carbs * 10) / 10,
    fat: Math.round(source.fat * 10) / 10,
    count: source.count,
});
const summarizeMeals = (entries) => {
    const mealTotals = {
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
export const FoodEntryPage = ({ container }) => {
    const today = useMemo(() => toDateKey(new Date()), []);
    const [entries, setEntries] = useState([]);
    const [summary, setSummary] = useState(null);
    const [message, setMessage] = useState("");
    const [liveUpdateState, setLiveUpdateState] = useState(null);
    const [mealInAddMode, setMealInAddMode] = useState(null);
    const [editingEntryId, setEditingEntryId] = useState(null);
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
        const initialize = async () => {
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
                }
                catch {
                    await container.liveUpdateProvider.rollback("Update application failed.");
                    const rollbackState = await container.liveUpdateProvider.getState();
                    setLiveUpdateState(rollbackState);
                    setMessage("Update failed and was rolled back to bundled baseline.");
                }
            }
        };
        void initialize();
    }, [container, refreshDashboard]);
    const handleMealDataChanged = async (nextMessage) => {
        await refreshDashboard();
        if (nextMessage) {
            setMessage(nextMessage);
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
        const normalizedUnit = editServingUnit === CUSTOM_SERVING_UNIT
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
    const handleDeleteEntry = async (entry) => {
        await container.deleteFoodEntryUseCase.execute(container.userId, entry.id);
        await refreshDashboard();
        if (editingEntryId === entry.id) {
            cancelEditing();
        }
        setMessage(`Removed ${entry.foodName}.`);
    };
    const entriesByMeal = useMemo(() => {
        const grouped = {
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
        return (_jsx(AddFoodToMealPage, { container: container, dateKey: today, mealType: mealInAddMode, onBack: () => {
                void refreshDashboard();
                setMealInAddMode(null);
            }, onChanged: async (nextMessage) => {
                await handleMealDataChanged(nextMessage);
            } }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(DailySummaryCard, { summary: summary }), _jsxs(IonCard, { className: "meal-breakdown-card", children: [_jsx(IonCardHeader, { children: _jsx(IonCardTitle, { children: "Meals" }) }), _jsx(IonCardContent, { children: mealTypeOrder.map((mealType) => {
                            const mealSummary = mealSummaries[mealType];
                            const mealEntries = entriesByMeal[mealType];
                            return (_jsxs("div", { className: "meal-breakdown-row", children: [_jsxs("div", { className: "meal-breakdown-values", children: [_jsx("h3", { children: mealTypeLabels[mealType] }), _jsxs("p", { children: ["Calories ", mealSummary.calories, " \u2022 Protein ", mealSummary.protein, "g \u2022 Carbs ", mealSummary.carbs, "g \u2022 Fat ", mealSummary.fat, "g"] }), _jsx(IonText, { color: "medium", children: _jsxs("small", { children: [mealSummary.count, " foods logged"] }) })] }), _jsx("div", { className: "meal-breakdown-actions", children: _jsx(IonButton, { size: "small", onClick: () => {
                                                setMealInAddMode(mealType);
                                            }, children: "Add Food" }) }), _jsx("div", { className: "meal-entry-list", children: mealEntries.length === 0 ? (_jsx(IonText, { color: "medium", children: _jsxs("small", { children: ["No items in ", mealTypeLabels[mealType], " yet."] }) })) : (mealEntries.map((entry) => {
                                            const isEditing = editingEntryId === entry.id;
                                            return (_jsxs("div", { className: "meal-entry-row", children: [_jsxs("div", { children: [_jsx("strong", { children: entry.foodName }), _jsxs("p", { children: [entry.nutritionSnapshot.calories, " kcal \u2022 ", entry.quantity, " ", entry.servingUnit, " \u2022 ", formatTime(entry.consumedAt)] })] }), isEditing ? (_jsxs("div", { className: "meal-entry-edit-grid", children: [_jsx(IonInput, { type: "number", value: editQuantity, placeholder: "Qty", onIonInput: (event) => {
                                                                    setEditQuantity(event.detail.value ?? "");
                                                                } }), _jsxs(IonSelect, { value: editServingUnit, onIonChange: (event) => {
                                                                    setEditServingUnit(event.detail.value ?? DEFAULT_SERVING_UNIT);
                                                                }, children: [predefinedServingUnits.map((unit) => (_jsx(IonSelectOption, { value: unit.value, children: unit.label }, unit.value))), _jsx(IonSelectOption, { value: CUSTOM_SERVING_UNIT, children: "Custom" })] }), editServingUnit === CUSTOM_SERVING_UNIT ? (_jsx(IonInput, { value: editCustomServingUnit, placeholder: "Custom unit", onIonInput: (event) => {
                                                                    setEditCustomServingUnit(event.detail.value ?? "");
                                                                } })) : null, _jsxs("div", { className: "meal-entry-actions", children: [_jsx(IonButton, { size: "small", onClick: () => void handleSaveEntry(entry), children: "Save" }), _jsx(IonButton, { size: "small", fill: "clear", onClick: cancelEditing, children: "Cancel" })] })] })) : (_jsxs("div", { className: "meal-entry-actions", children: [_jsx(IonButton, { size: "small", fill: "outline", onClick: () => startEditingEntry(entry), children: "Edit" }), _jsx(IonButton, { size: "small", color: "danger", fill: "clear", onClick: () => void handleDeleteEntry(entry), children: "Remove" })] }))] }, entry.id));
                                        })) })] }, mealType));
                        }) })] }), _jsxs(IonCard, { children: [_jsx(IonCardHeader, { children: _jsx(IonCardTitle, { children: "Live Update State" }) }), _jsx(IonCardContent, { children: liveUpdateState ? (_jsxs("p", { children: ["Bundle ", _jsx("strong", { children: liveUpdateState.currentBundleVersion }), " \u2022 applied ", new Date(liveUpdateState.appliedAt).toLocaleString(), liveUpdateState.rollbackReason ? ` • rollback: ${liveUpdateState.rollbackReason}` : "", _jsx("br", {}), "App ", versionInfo.appVersion, " \u2022 Build ", versionInfo.bundleVersion] })) : (_jsx("p", { children: "Checking update state\u2026" })) })] }), message ? (_jsx(IonText, { color: "success", children: _jsx("p", { children: message }) })) : null] }));
};
