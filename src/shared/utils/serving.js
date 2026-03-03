export const DEFAULT_SERVING_UNIT = "serving";
export const CUSTOM_SERVING_UNIT = "custom";
export const predefinedServingUnits = [
    { value: "serving", label: "Serving" },
    { value: "g", label: "Gram (g)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "ml", label: "Milliliter (ml)" },
    { value: "l", label: "Liter (l)" },
    { value: "cup", label: "Cup" },
    { value: "tbsp", label: "Tablespoon (tbsp)" },
    { value: "tsp", label: "Teaspoon (tsp)" },
    { value: "oz", label: "Ounce (oz)" },
    { value: "piece", label: "Piece" },
    { value: "slice", label: "Slice" },
    { value: "bowl", label: "Bowl" },
    { value: "plate", label: "Plate" },
];
const servingUnitSynonyms = {
    servings: "serving",
    gram: "g",
    grams: "g",
    kilogram: "kg",
    kilograms: "kg",
    milliliter: "ml",
    milliliters: "ml",
    liter: "l",
    liters: "l",
    cups: "cup",
    tablespoon: "tbsp",
    tablespoons: "tbsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
    ounce: "oz",
    ounces: "oz",
    pieces: "piece",
    slices: "slice",
    bowls: "bowl",
    plates: "plate",
};
const predefinedSet = new Set(predefinedServingUnits.map((unit) => unit.value));
export const isPredefinedServingUnit = (unit) => {
    return predefinedSet.has(unit);
};
export const normalizeServingUnit = (input) => {
    const raw = input.trim().toLowerCase();
    if (!raw) {
        return "";
    }
    if (predefinedSet.has(raw)) {
        return raw;
    }
    return servingUnitSynonyms[raw] ?? raw;
};
