import type { NutritionSnapshot } from "@/shared/types/core";
import type { PredefinedServingUnit } from "@/shared/utils/serving";

export interface CatalogFood {
  aliases: string[];
  per100g: NutritionSnapshot;
  gramsPerUnit?: Partial<Record<PredefinedServingUnit, number>>;
}

export const defaultNutritionCatalog: CatalogFood[] = [
  // Fruits (FDC per 100g)
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
    aliases: ["orange"],
    per100g: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 },
    gramsPerUnit: { serving: 131, piece: 131 },
  },
  {
    aliases: ["grapes", "red grapes", "green grapes"],
    per100g: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2 },
    gramsPerUnit: { serving: 92, cup: 92 },
  },
  {
    aliases: ["pineapple"],
    per100g: { calories: 50, protein: 0.5, carbs: 13, fat: 0.1 },
    gramsPerUnit: { serving: 165, cup: 165 },
  },
  {
    aliases: ["mango"],
    per100g: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
    gramsPerUnit: { serving: 165, piece: 207 },
  },
  {
    aliases: ["watermelon"],
    per100g: { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2 },
    gramsPerUnit: { serving: 154, cup: 154 },
  },
  {
    aliases: ["peach"],
    per100g: { calories: 39, protein: 0.9, carbs: 9.5, fat: 0.3 },
    gramsPerUnit: { serving: 150, piece: 150 },
  },
  {
    aliases: ["pear"],
    per100g: { calories: 57, protein: 0.4, carbs: 15, fat: 0.1 },
    gramsPerUnit: { serving: 178, piece: 178 },
  },
  {
    aliases: ["kiwi"],
    per100g: { calories: 61, protein: 1.1, carbs: 15, fat: 0.5 },
    gramsPerUnit: { serving: 76, piece: 76 },
  },
  {
    aliases: ["cherries", "cherry"],
    per100g: { calories: 63, protein: 1.1, carbs: 16, fat: 0.2 },
    gramsPerUnit: { serving: 154, cup: 154 },
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
  {
    aliases: ["raspberries", "raspberry"],
    per100g: { calories: 52, protein: 1.2, carbs: 11.9, fat: 0.7 },
    gramsPerUnit: { serving: 123, cup: 123 },
  },
  {
    aliases: ["blackberries", "blackberry"],
    per100g: { calories: 43, protein: 1.4, carbs: 10.2, fat: 0.5 },
    gramsPerUnit: { serving: 144, cup: 144 },
  },
  {
    aliases: ["pineapple juice", "canned pineapple juice"],
    per100g: { calories: 53, protein: 0.4, carbs: 12.9, fat: 0.1 },
    gramsPerUnit: { serving: 248, cup: 248, ml: 1 },
  },
  {
    aliases: ["lemon"],
    per100g: { calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3 },
    gramsPerUnit: { serving: 58, piece: 58 },
  },

  // Vegetables
  {
    aliases: ["broccoli"],
    per100g: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },
    gramsPerUnit: { serving: 91, cup: 91, bowl: 180 },
  },
  {
    aliases: ["carrot", "raw carrot"],
    per100g: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
    gramsPerUnit: { serving: 61, piece: 61 },
  },
  {
    aliases: ["spinach", "raw spinach"],
    per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    gramsPerUnit: { serving: 30, cup: 30 },
  },
  {
    aliases: ["kale"],
    per100g: { calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9 },
    gramsPerUnit: { serving: 67, cup: 67 },
  },
  {
    aliases: ["lettuce", "iceberg lettuce"],
    per100g: { calories: 14, protein: 0.9, carbs: 3, fat: 0.1 },
    gramsPerUnit: { serving: 72, cup: 72 },
  },
  {
    aliases: ["cabbage", "green cabbage"],
    per100g: { calories: 25, protein: 1.3, carbs: 6, fat: 0.1 },
    gramsPerUnit: { serving: 89, cup: 89 },
  },
  {
    aliases: ["tomato"],
    per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    gramsPerUnit: { serving: 123, piece: 123 },
  },
  {
    aliases: ["cucumber"],
    per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
    gramsPerUnit: { serving: 104, piece: 104 },
  },
  {
    aliases: ["bell pepper", "red bell pepper"],
    per100g: { calories: 31, protein: 1, carbs: 6, fat: 0.3 },
    gramsPerUnit: { serving: 119, piece: 119 },
  },
  {
    aliases: ["onion"],
    per100g: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1 },
    gramsPerUnit: { serving: 110, piece: 110 },
  },
  {
    aliases: ["garlic"],
    per100g: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5 },
    gramsPerUnit: { serving: 3, clove: 3, tsp: 2.8 },
  },
  {
    aliases: ["mushroom", "white mushroom"],
    per100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 },
    gramsPerUnit: { serving: 96, cup: 96 },
  },
  {
    aliases: ["corn", "sweet corn"],
    per100g: { calories: 96, protein: 3.4, carbs: 21, fat: 1.5 },
    gramsPerUnit: { serving: 82, cup: 82 },
  },
  {
    aliases: ["green peas", "peas"],
    per100g: { calories: 84, protein: 5, carbs: 15, fat: 0.4 },
    gramsPerUnit: { serving: 145, cup: 145 },
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
    aliases: ["kale chips", "baked kale"],
    per100g: { calories: 71, protein: 4.3, carbs: 11.1, fat: 1.6 },
    gramsPerUnit: { serving: 28, cup: 20 },
  },

  // Grains / starches
  {
    aliases: ["rice", "white rice", "brown rice"],
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
    gramsPerUnit: { serving: 158, cup: 158, bowl: 220, plate: 260 },
  },
  {
    aliases: ["oatmeal", "oats"],
    per100g: { calories: 68, protein: 2.4, carbs: 12, fat: 1.4 },
    gramsPerUnit: { serving: 234, cup: 234, bowl: 280 },
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
    aliases: ["bread", "whole wheat bread"],
    per100g: { calories: 247, protein: 13, carbs: 41, fat: 4.2 },
    gramsPerUnit: { serving: 32, slice: 32 },
  },
  {
    aliases: ["bagel", "plain bagel"],
    per100g: { calories: 250, protein: 9, carbs: 53, fat: 1.2 },
    gramsPerUnit: { serving: 105, piece: 105 },
  },
  {
    aliases: ["tortilla", "flour tortilla"],
    per100g: { calories: 310, protein: 8.1, carbs: 51, fat: 7.6 },
    gramsPerUnit: { serving: 50, piece: 50 },
  },
  {
    aliases: ["corn tortilla"],
    per100g: { calories: 218, protein: 5.7, carbs: 45.1, fat: 2.9 },
    gramsPerUnit: { serving: 45, piece: 45 },
  },
  {
    aliases: ["granola"],
    per100g: { calories: 471, protein: 10, carbs: 64, fat: 20 },
    gramsPerUnit: { serving: 55, cup: 85 },
  },
  {
    aliases: ["cornflakes", "corn flakes"],
    per100g: { calories: 357, protein: 8, carbs: 84, fat: 0.4 },
    gramsPerUnit: { serving: 30, cup: 30 },
  },

  // Proteins & meats
  {
    aliases: ["chicken breast", "grilled chicken"],
    per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    gramsPerUnit: { serving: 100, piece: 100, plate: 180 },
  },
  {
    aliases: ["chicken thigh"],
    per100g: { calories: 209, protein: 26, carbs: 0, fat: 11 },
    gramsPerUnit: { serving: 80, piece: 80 },
  },
  {
    aliases: ["turkey breast", "roasted turkey"],
    per100g: { calories: 135, protein: 30, carbs: 0, fat: 1 },
    gramsPerUnit: { serving: 85, slice: 85 },
  },
  {
    aliases: ["pork loin"],
    per100g: { calories: 242, protein: 27, carbs: 0, fat: 14 },
    gramsPerUnit: { serving: 85, piece: 85 },
  },
  {
    aliases: ["ground beef", "85% lean beef"],
    per100g: { calories: 250, protein: 26, carbs: 0, fat: 17 },
    gramsPerUnit: { serving: 113, patty: 113 },
  },
  {
    aliases: ["bacon"],
    per100g: { calories: 541, protein: 37, carbs: 1.4, fat: 42 },
    gramsPerUnit: { serving: 8, slice: 8 },
  },
  {
    aliases: ["salmon"],
    per100g: { calories: 208, protein: 22, carbs: 0, fat: 13 },
    gramsPerUnit: { serving: 100, piece: 100, plate: 170 },
  },
  {
    aliases: ["tuna", "canned tuna"],
    per100g: { calories: 116, protein: 26, carbs: 0, fat: 0.8 },
    gramsPerUnit: { serving: 85, can: 165 },
  },
  {
    aliases: ["shrimp", "cooked shrimp"],
    per100g: { calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
    gramsPerUnit: { serving: 85, piece: 15 },
  },
  {
    aliases: ["cod", "baked cod"],
    per100g: { calories: 105, protein: 23, carbs: 0, fat: 0.9 },
    gramsPerUnit: { serving: 100, piece: 100 },
  },
  {
    aliases: ["beef sirloin", "lean beef"],
    per100g: { calories: 217, protein: 26.1, carbs: 0, fat: 11.8 },
    gramsPerUnit: { serving: 100, piece: 100, plate: 180 },
  },
  {
    aliases: ["tofu", "firm tofu"],
    per100g: { calories: 144, protein: 17.3, carbs: 3.4, fat: 8.7 },
    gramsPerUnit: { serving: 126, piece: 126 },
  },
  {
    aliases: ["edamame", "soybeans"],
    per100g: { calories: 122, protein: 11, carbs: 9.9, fat: 5.2 },
    gramsPerUnit: { serving: 75, cup: 155 },
  },
  {
    aliases: ["egg", "boiled egg"],
    per100g: { calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6 },
    gramsPerUnit: { serving: 50, piece: 50 },
  },
  {
    aliases: ["egg white"],
    per100g: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
    gramsPerUnit: { serving: 33, piece: 33 },
  },

  // Legumes
  {
    aliases: ["black beans", "black beans cooked"],
    per100g: { calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5 },
    gramsPerUnit: { serving: 172, cup: 172, bowl: 240 },
  },
  {
    aliases: ["kidney beans", "red beans"],
    per100g: { calories: 127, protein: 8.7, carbs: 22.8, fat: 0.5 },
    gramsPerUnit: { serving: 177, cup: 177 },
  },
  {
    aliases: ["chickpeas", "garbanzo beans"],
    per100g: { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6 },
    gramsPerUnit: { serving: 164, cup: 164 },
  },
  {
    aliases: ["lentils", "cooked lentils"],
    per100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4 },
    gramsPerUnit: { serving: 198, cup: 198 },
  },

  // Dairy & alternatives
  {
    aliases: ["milk", "2% milk"],
    per100g: { calories: 50, protein: 3.4, carbs: 4.8, fat: 2 },
    gramsPerUnit: { serving: 244, cup: 244, ml: 1, l: 1000 },
  },
  {
    aliases: ["whole milk"],
    per100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
    gramsPerUnit: { serving: 244, cup: 244, ml: 1 },
  },
  {
    aliases: ["skim milk"],
    per100g: { calories: 34, protein: 3.4, carbs: 5, fat: 0.1 },
    gramsPerUnit: { serving: 244, cup: 244, ml: 1 },
  },
  {
    aliases: ["yogurt", "greek yogurt"],
    per100g: { calories: 71, protein: 9, carbs: 3.6, fat: 2 },
    gramsPerUnit: { serving: 170, cup: 245, bowl: 245 },
  },
  {
    aliases: ["nonfat greek yogurt", "fat free greek yogurt"],
    per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
    gramsPerUnit: { serving: 170, cup: 245 },
  },
  {
    aliases: ["cottage cheese", "lowfat cottage cheese"],
    per100g: { calories: 72, protein: 12.4, carbs: 2.7, fat: 1 },
    gramsPerUnit: { serving: 113, cup: 210 },
  },
  {
    aliases: ["cheddar cheese", "cheese"],
    per100g: { calories: 403, protein: 24.9, carbs: 1.3, fat: 33.1 },
    gramsPerUnit: { serving: 28, slice: 28 },
  },
  {
    aliases: ["mozzarella", "part skim mozzarella"],
    per100g: { calories: 280, protein: 28, carbs: 3, fat: 17 },
    gramsPerUnit: { serving: 28, slice: 28 },
  },
  {
    aliases: ["butter"],
    per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
    gramsPerUnit: { serving: 14, tbsp: 14, tsp: 4.7 },
  },
  {
    aliases: ["ice cream", "vanilla ice cream"],
    per100g: { calories: 207, protein: 3.5, carbs: 23.6, fat: 11 },
    gramsPerUnit: { serving: 66, cup: 132 },
  },
  {
    aliases: ["soy milk", "unsweetened soy milk"],
    per100g: { calories: 33, protein: 3.3, carbs: 2.1, fat: 1.6 },
    gramsPerUnit: { serving: 240, cup: 240 },
  },
  {
    aliases: ["almond milk", "unsweetened almond milk"],
    per100g: { calories: 15, protein: 0.6, carbs: 0.3, fat: 1.2 },
    gramsPerUnit: { serving: 240, cup: 240 },
  },

  // Fats, oils, condiments
  {
    aliases: ["olive oil"],
    per100g: { calories: 884, protein: 0, carbs: 0, fat: 100 },
    gramsPerUnit: { serving: 13.5, tbsp: 13.5, tsp: 4.5, ml: 0.91 },
  },
  {
    aliases: ["coconut oil"],
    per100g: { calories: 862, protein: 0, carbs: 0, fat: 100 },
    gramsPerUnit: { serving: 13.6, tbsp: 13.6, tsp: 4.5 },
  },
  {
    aliases: ["mayonnaise"],
    per100g: { calories: 680, protein: 0.9, carbs: 0.6, fat: 75 },
    gramsPerUnit: { serving: 13.8, tbsp: 13.8, tsp: 4.6 },
  },
  {
    aliases: ["peanut butter"],
    per100g: { calories: 588, protein: 25.1, carbs: 20, fat: 50.4 },
    gramsPerUnit: { serving: 16, tbsp: 16, tsp: 5 },
  },
  {
    aliases: ["hummus"],
    per100g: { calories: 166, protein: 7.9, carbs: 14.3, fat: 7.9 },
    gramsPerUnit: { serving: 28, tbsp: 15 },
  },

  // Nuts & seeds
  {
    aliases: ["almonds"],
    per100g: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9 },
    gramsPerUnit: { serving: 28, tbsp: 9, cup: 143 },
  },
  {
    aliases: ["walnuts"],
    per100g: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65 },
    gramsPerUnit: { serving: 28, cup: 117 },
  },
  {
    aliases: ["cashews"],
    per100g: { calories: 553, protein: 18.2, carbs: 30.2, fat: 43.9 },
    gramsPerUnit: { serving: 28, cup: 137 },
  },
  {
    aliases: ["sunflower seeds"],
    per100g: { calories: 584, protein: 20.8, carbs: 20, fat: 51.5 },
    gramsPerUnit: { serving: 28, tbsp: 8 },
  },
  {
    aliases: ["pumpkin seeds"],
    per100g: { calories: 559, protein: 30, carbs: 10.7, fat: 49 },
    gramsPerUnit: { serving: 28, cup: 129 },
  },
  {
    aliases: ["chia seeds"],
    per100g: { calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7 },
    gramsPerUnit: { serving: 12, tbsp: 12 },
  },
  {
    aliases: ["flaxseed"],
    per100g: { calories: 534, protein: 18.3, carbs: 28.9, fat: 42.2 },
    gramsPerUnit: { serving: 10, tbsp: 7 },
  },

  // Sweets & snacks
  {
    aliases: ["dark chocolate", "70% dark chocolate"],
    per100g: { calories: 598, protein: 7.8, carbs: 45.9, fat: 42.6 },
    gramsPerUnit: { serving: 40, piece: 10 },
  },
  {
    aliases: ["sugar", "granulated sugar"],
    per100g: { calories: 387, protein: 0, carbs: 100, fat: 0 },
    gramsPerUnit: { serving: 4, tsp: 4, tbsp: 12.5 },
  },
  {
    aliases: ["honey"],
    per100g: { calories: 304, protein: 0.3, carbs: 82.4, fat: 0 },
    gramsPerUnit: { serving: 21, tbsp: 21, tsp: 7 },
  },

  // Beverages
  {
    aliases: ["coffee", "black coffee"],
    per100g: { calories: 1, protein: 0.1, carbs: 0, fat: 0 },
    gramsPerUnit: { serving: 240, cup: 240 },
  },
  {
    aliases: ["tea", "black tea"],
    per100g: { calories: 1, protein: 0, carbs: 0.3, fat: 0 },
    gramsPerUnit: { serving: 240, cup: 240 },
  },
  {
    aliases: ["orange juice"],
    per100g: { calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2 },
    gramsPerUnit: { serving: 248, cup: 248 },
  },
  {
    aliases: ["cola", "soda"],
    per100g: { calories: 41, protein: 0, carbs: 10.6, fat: 0 },
    gramsPerUnit: { serving: 355, can: 355 },
  },
  {
    aliases: ["beer", "light beer"],
    per100g: { calories: 29, protein: 0.2, carbs: 1.9, fat: 0 },
    gramsPerUnit: { serving: 355, can: 355 },
  },
  {
    aliases: ["red wine", "wine"],
    per100g: { calories: 85, protein: 0.1, carbs: 2.6, fat: 0 },
    gramsPerUnit: { serving: 147, glass: 147 },
  },
];
