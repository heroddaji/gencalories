import type { NutritionSnapshot } from "@/shared/types/core";

export interface CatalogFood {
  aliases: string[];
  perServing: NutritionSnapshot;
}

export const defaultNutritionCatalog: CatalogFood[] = [
  {
    aliases: ["apple", "red apple", "green apple"],
    perServing: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  },
  {
    aliases: ["banana"],
    perServing: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  },
  {
    aliases: ["chicken breast", "grilled chicken"],
    perServing: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  },
  {
    aliases: ["rice", "white rice", "brown rice"],
    perServing: { calories: 206, protein: 4.2, carbs: 45, fat: 0.4 },
  },
  {
    aliases: ["egg", "boiled egg"],
    perServing: { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  },
  {
    aliases: ["oatmeal", "oats"],
    perServing: { calories: 150, protein: 5, carbs: 27, fat: 3 },
  },
  {
    aliases: ["salmon"],
    perServing: { calories: 208, protein: 20, carbs: 0, fat: 13 },
  },
  {
    aliases: ["yogurt", "greek yogurt"],
    perServing: { calories: 120, protein: 12, carbs: 9, fat: 4 },
  },
  {
    aliases: ["bread", "whole wheat bread"],
    perServing: { calories: 80, protein: 4, carbs: 14, fat: 1 },
  },
  {
    aliases: ["avocado"],
    perServing: { calories: 160, protein: 2, carbs: 9, fat: 15 },
  },
];
