import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonButton, IonItem, IonLabel, IonList, IonNote, IonText, } from "@ionic/react";
export const SuggestionList = ({ suggestions, onSelect, onDelete, }) => {
    if (suggestions.length === 0) {
        return null;
    }
    return (_jsx(IonList, { inset: true, children: suggestions.map((suggestion) => (_jsxs(IonItem, { button: true, onClick: () => {
                onSelect(suggestion);
            }, children: [_jsxs(IonLabel, { children: [_jsx("h3", { children: suggestion.label }), _jsxs("p", { children: [suggestion.source === "history" ? "From your history" : "From local catalog", suggestion.useCount ? ` • used ${suggestion.useCount} times` : ""] })] }), suggestion.source === "history" && suggestion.normalizedName && onDelete ? (_jsx(IonButton, { slot: "end", color: "danger", fill: "clear", onClick: (event) => {
                        event.stopPropagation();
                        onDelete(suggestion.normalizedName);
                    }, children: "delete" })) : null, suggestion.quantity && suggestion.unit ? (_jsxs(IonNote, { slot: "end", color: "medium", children: [suggestion.quantity, " ", suggestion.unit] })) : (_jsx(IonText, { slot: "end", color: "medium", children: "pick" }))] }, suggestion.key))) }));
};
