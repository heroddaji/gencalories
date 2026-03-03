import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
const macroBarPalette = {
    protein: "#22c55e",
    carbs: "#f59e0b",
    fat: "#ef4444",
};
export const DailySummaryCard = ({ summary, title = "Today's Summary", }) => {
    if (!summary) {
        return (_jsxs(IonCard, { children: [_jsx(IonCardHeader, { children: _jsx(IonCardTitle, { children: title }) }), _jsx(IonCardContent, { children: "Loading summary\u2026" })] }));
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
    ];
    const macroTotal = macroBreakdown.reduce((total, macro) => total + macro.value, 0);
    return (_jsxs(IonCard, { className: "daily-summary-card", children: [_jsx(IonCardHeader, { children: _jsx(IonCardTitle, { children: title }) }), _jsxs(IonCardContent, { children: [_jsxs("div", { className: "daily-summary-progress", children: [_jsx("div", { className: "daily-summary-pie", style: pieStyle, children: _jsxs("div", { className: "daily-summary-pie-center", children: [_jsx("strong", { children: summary.totalCalories }), _jsx("span", { children: "kcal" })] }) }), _jsxs("div", { children: [_jsxs("p", { children: ["Target: ", _jsx("strong", { children: targetCalories ?? "Not set" })] }), _jsxs("p", { children: ["Goal delta: ", _jsx("strong", { children: summary.goalDelta ?? "--" }), summary.goalDelta === null ? "" : " kcal"] })] })] }), _jsx("div", { className: "daily-summary-macro-bars", children: macroBreakdown.map((macro) => {
                            const width = macroTotal > 0 ? (macro.value / macroTotal) * 100 : 0;
                            return (_jsxs("div", { className: "daily-summary-macro-row", children: [_jsxs("div", { className: "daily-summary-macro-labels", children: [_jsx("span", { children: macro.label }), _jsxs("strong", { children: [macro.value, "g"] })] }), _jsx("div", { className: "daily-summary-macro-track", children: _jsx("div", { className: "daily-summary-macro-fill", style: {
                                                width: `${Math.max(4, Math.min(100, width))}%`,
                                                backgroundColor: macroBarPalette[macro.key],
                                            } }) })] }, macro.key));
                        }) }), _jsxs("p", { children: ["Protein ", summary.macroTotals.protein, "g \u2022 Carbs ", summary.macroTotals.carbs, "g \u2022 Fat ", summary.macroTotals.fat, "g"] }), _jsx("p", { children: summary.insights })] })] }));
};
