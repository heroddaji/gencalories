import type { NutritionSnapshot } from "@/shared/types/core";
import type { PredefinedServingUnit } from "@/shared/utils/serving";

export interface CatalogFood {
  aliases: string[];
  per100g: NutritionSnapshot;
  gramsPerUnit?: Partial<Record<PredefinedServingUnit, number>>;
}

export const defaultNutritionCatalog: CatalogFood[] = [
  {
    aliases: ["apple", "red apple", "green apple"],
    per100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
    gramsPerUnit: { serving: 182, piece: 182 },
  },
  {
    aliases: ["banana"],
    per100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
    gramsPerUnit: { serving: 118, piece: 118 },
  },
  {
    aliases: ["chicken breast", "grilled chicken"],
    per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    gramsPerUnit: { serving: 100, piece: 100, plate: 180 },
  },
  {
    aliases: ["rice", "white rice", "brown rice"],
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
    gramsPerUnit: { serving: 158, cup: 158, bowl: 220, plate: 260 },
  },
  {
    aliases: ["egg", "boiled egg"],
    per100g: { calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6 },
    gramsPerUnit: { serving: 50, piece: 50 },
  },
  {
    aliases: ["oatmeal", "oats"],
    per100g: { calories: 68, protein: 2.4, carbs: 12, fat: 1.4 },
    gramsPerUnit: { serving: 234, cup: 234, bowl: 280 },
  },
  {
    aliases: ["salmon"],
    per100g: { calories: 208, protein: 22, carbs: 0, fat: 13 },
    gramsPerUnit: { serving: 100, piece: 100, plate: 170 },
  },
  {
    aliases: ["yogurt", "greek yogurt"],
    per100g: { calories: 71, protein: 9, carbs: 3.6, fat: 2 },
    gramsPerUnit: { serving: 170, cup: 245, bowl: 245 },
  },
  {
    aliases: ["bread", "whole wheat bread"],
    per100g: { calories: 247, protein: 13, carbs: 41, fat: 4.2 },
    gramsPerUnit: { serving: 32, slice: 32 },
  },
  {
    aliases: ["avocado"],
    per100g: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
    gramsPerUnit: { serving: 150, piece: 150 },
  },
  {
    aliases: ["broccoli"],
    per100g: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },
    gramsPerUnit: { serving: 91, cup: 91, bowl: 180 },
  },
  {
    aliases: ["sweet potato", "baked sweet potato"],
    per100g: { calories: 90, protein: 2, carbs: 20.7, fat: 0.2 },
    gramsPerUnit: { serving: 130, piece: 130 },
  },
  {
    aliases: ["potato", "boiled potato"],
    per100g: { calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1 },
    gramsPerUnit: { serving: 173, piece: 173 },
  },
  {
    aliases: ["pasta", "cooked pasta", "spaghetti"],
    per100g: { calories: 157, protein: 5.8, carbs: 30.9, fat: 0.9 },
    gramsPerUnit: { serving: 140, cup: 140, bowl: 220 },
  },
  {
    aliases: ["quinoa", "cooked quinoa"],
    per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 },
    gramsPerUnit: { serving: 185, cup: 185, bowl: 240 },
  },
  {
    aliases: ["tofu", "firm tofu"],
    per100g: { calories: 144, protein: 17.3, carbs: 3.4, fat: 8.7 },
    gramsPerUnit: { serving: 126, piece: 126 },
  },
  {
    aliases: ["beef sirloin", "lean beef"],
    per100g: { calories: 217, protein: 26.1, carbs: 0, fat: 11.8 },
    gramsPerUnit: { serving: 100, piece: 100, plate: 180 },
  },
  {
    aliases: ["black beans", "black beans cooked"],
    per100g: { calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5 },
    gramsPerUnit: { serving: 172, cup: 172, bowl: 240 },
  },
  {
    aliases: ["almonds"],
    per100g: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9 },
    gramsPerUnit: { serving: 28, tbsp: 9, cup: 143 },
  },
  {
    aliases: ["peanut butter"],
    per100g: { calories: 588, protein: 25.1, carbs: 20, fat: 50.4 },
    gramsPerUnit: { serving: 16, tbsp: 16, tsp: 5 },
  },
  {
    aliases: ["milk", "2% milk"],
    per100g: { calories: 50, protein: 3.4, carbs: 4.8, fat: 2 },
    gramsPerUnit: { serving: 244, cup: 244, ml: 1, l: 1000 },
  },
  {
    aliases: ["olive oil"],
    per100g: { calories: 884, protein: 0, carbs: 0, fat: 100 },
    gramsPerUnit: { serving: 13.5, tbsp: 13.5, tsp: 4.5, ml: 0.91 },
  },
  {
    aliases: ["cheddar cheese", "cheese"],
    per100g: { calories: 403, protein: 24.9, carbs: 1.3, fat: 33.1 },
    gramsPerUnit: { serving: 28, slice: 28 },
  },
  {
    aliases: ["orange"],
    per100g: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 },
    gramsPerUnit: { serving: 131, piece: 131 },
  },
  {
    aliases: ["strawberries", "strawberry"],
    per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
    gramsPerUnit: { serving: 152, cup: 152 },
  },
  {
    aliases: ["blueberries", "blueberry"],
    per100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
    gramsPerUnit: { serving: 148, cup: 148 },
  },
];
