export const mealTypeOrder = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
];
export const mealTypeLabels = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snacks",
};
export const isMealType = (value) => {
    return mealTypeOrder.includes(value);
};
