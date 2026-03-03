import { describe, expect, it } from "vitest";
import { addDaysToDateKey, formatDateLabel, isSameDateKey, toDateKey, } from "@/shared/utils/date";
describe("date utils", () => {
    it("creates local date keys and checks same-day values", () => {
        expect(toDateKey(new Date(2026, 2, 3, 10, 30))).toBe("2026-03-03");
        expect(isSameDateKey("2026-03-03T08:00:00.000+11:00", "2026-03-03")).toBe(true);
    });
    it("can move forward/backward by date key", () => {
        expect(addDaysToDateKey("2026-03-03", 1)).toBe("2026-03-04");
        expect(addDaysToDateKey("2026-03-03", -2)).toBe("2026-03-01");
    });
    it("formats a human readable date label", () => {
        expect(formatDateLabel("2026-03-03")).toMatch(/2026/);
    });
});
