import { describe, expect, it } from "vitest";
import { bmiScalePosition, bmiStatusLabel, calculateBmi, isHealthyBmi, } from "@/features/user-profile-goals/domain/bmi";
describe("bmi domain helpers", () => {
    it("calculates BMI from weight and height", () => {
        expect(calculateBmi(70, 170)).toBe(24.2);
    });
    it("returns null when required inputs are missing", () => {
        expect(calculateBmi(null, 170)).toBeNull();
        expect(calculateBmi(70, null)).toBeNull();
    });
    it("classifies healthy range correctly", () => {
        expect(isHealthyBmi(22)).toBe(true);
        expect(isHealthyBmi(29)).toBe(false);
    });
    it("returns readable BMI status labels", () => {
        expect(bmiStatusLabel(17)).toBe("Underweight");
        expect(bmiStatusLabel(22)).toBe("Healthy");
        expect(bmiStatusLabel(27)).toBe("Overweight");
        expect(bmiStatusLabel(32)).toBe("Obese");
    });
    it("maps BMI values into visualization scale bounds", () => {
        expect(bmiScalePosition(20)).toBe(50);
        expect(bmiScalePosition(100)).toBe(100);
        expect(bmiScalePosition(-5)).toBe(0);
        expect(bmiScalePosition(null)).toBeNull();
    });
});
