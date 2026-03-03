import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from "@ionic/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DailySummaryCard } from "@/features/daily-summary/presentation/DailySummaryCard";
import { addDaysToDateKey, formatDateLabel, toDateKey } from "@/shared/utils/date";
export const SummaryPage = ({ container }) => {
    const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
    const [summary, setSummary] = useState(null);
    const touchStartXRef = useRef(null);
    const dateLabel = useMemo(() => formatDateLabel(selectedDate), [selectedDate]);
    const refreshSummary = useCallback(async () => {
        const nextSummary = await container.dailySummaryService.forDate(container.userId, selectedDate);
        setSummary(nextSummary);
    }, [container, selectedDate]);
    useEffect(() => {
        void refreshSummary();
    }, [refreshSummary]);
    const handleShiftDate = (delta) => {
        setSelectedDate((current) => addDaysToDateKey(current, delta));
    };
    return (_jsxs("div", { onTouchStart: (event) => {
            touchStartXRef.current = event.touches[0]?.clientX ?? null;
        }, onTouchEnd: (event) => {
            const start = touchStartXRef.current;
            const end = event.changedTouches[0]?.clientX;
            if (start === null || typeof end !== "number") {
                return;
            }
            const deltaX = end - start;
            if (Math.abs(deltaX) < 40) {
                return;
            }
            handleShiftDate(deltaX < 0 ? 1 : -1);
        }, children: [_jsxs(IonCard, { children: [_jsx(IonCardHeader, { children: _jsx(IonCardTitle, { children: "Daily Summary Browser" }) }), _jsxs(IonCardContent, { children: [_jsxs("div", { className: "date-nav-row", children: [_jsx(IonButton, { size: "small", fill: "outline", onClick: () => handleShiftDate(-1), children: "Prev Day" }), _jsx(IonText, { color: "medium", children: _jsx("strong", { children: dateLabel }) }), _jsx(IonButton, { size: "small", fill: "outline", onClick: () => handleShiftDate(1), children: "Next Day" })] }), _jsx(IonText, { color: "medium", children: _jsx("small", { children: "Tip: Swipe left/right anywhere on this tab to change day." }) })] })] }), _jsx(DailySummaryCard, { summary: summary, title: `Summary • ${dateLabel}` })] }));
};
