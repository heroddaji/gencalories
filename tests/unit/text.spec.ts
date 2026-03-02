import { describe, expect, it } from "vitest";
import { normalizeFoodName, stringSimilarity } from "@/shared/utils/text";

describe("normalizeFoodName", () => {
  it("normalizes casing, punctuation and whitespace", () => {
    expect(normalizeFoodName("  Chicken, Breast!!  ")).toBe("chicken breast");
  });
});

describe("stringSimilarity", () => {
  it("returns 1 for exact matches", () => {
    expect(stringSimilarity("banana", "banana")).toBe(1);
  });

  it("returns 0 for empty values", () => {
    expect(stringSimilarity("", "banana")).toBe(0);
    expect(stringSimilarity("apple", "")).toBe(0);
  });

  it("returns higher score for closer terms", () => {
    const close = stringSimilarity("banana", "bananas");
    const far = stringSimilarity("banana", "salmon");
    expect(close).toBeGreaterThan(far);
  });
});
