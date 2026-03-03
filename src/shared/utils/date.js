export const toDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
export const isSameDateKey = (isoDateTime, dateKey) => {
    return toDateKey(new Date(isoDateTime)) === dateKey;
};
export const fromDateKey = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map((value) => Number(value));
    return new Date(year, month - 1, day);
};
export const addDaysToDateKey = (dateKey, delta) => {
    const date = fromDateKey(dateKey);
    date.setDate(date.getDate() + delta);
    return toDateKey(date);
};
export const formatDateLabel = (dateKey) => {
    return fromDateKey(dateKey).toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
export const daysAgo = (fromIso, now = new Date()) => {
    const value = new Date(fromIso).getTime();
    const deltaMs = Math.max(0, now.getTime() - value);
    return deltaMs / (1000 * 60 * 60 * 24);
};
