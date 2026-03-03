export const calculateBmi = (
  weightKg: number | null,
  heightCm: number | null,
): number | null => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const isHealthyBmi = (bmi: number | null): boolean | null => {
  if (bmi === null) {
    return null;
  }

  return bmi >= 18.5 && bmi <= 24.9;
};

export const bmiStatusLabel = (bmi: number | null): string => {
  if (bmi === null) {
    return "Unknown";
  }

  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi <= 24.9) {
    return "Healthy";
  }

  if (bmi <= 29.9) {
    return "Overweight";
  }

  return "Obese";
};

export const bmiScalePosition = (bmi: number | null): number | null => {
  if (bmi === null) {
    return null;
  }

  const normalized = (bmi / 40) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized * 10) / 10));
};
