import { describe, expect, it } from "vitest";
import { financialYearLabel, financialYearOf } from "../financial-year";
import { bracketTax, incomeTax } from "./income-tax";
import { scheduleFor } from "./schedule";

describe("financial years", () => {
  it("starts a new financial year on 1 July", () => {
    expect(financialYearOf(new Date(Date.UTC(2026, 5, 30)))).toBe(2026);
    expect(financialYearOf(new Date(Date.UTC(2026, 6, 1)))).toBe(2027);
  });

  it("labels years the Australian way", () => {
    expect(financialYearLabel(2027)).toBe("2026–27");
  });
});

describe("resident income tax", () => {
  it("picks the legislated schedule for each year", () => {
    expect(scheduleFor(2026).brackets[1]?.rate).toBe(0.16);
    expect(scheduleFor(2027).brackets[1]?.rate).toBe(0.15);
    expect(scheduleFor(2028).brackets[1]?.rate).toBe(0.14);
    // Years past the last known schedule hold it flat.
    expect(scheduleFor(2040).brackets[1]?.rate).toBe(0.14);
  });

  it("taxes nothing up to the tax-free threshold", () => {
    expect(incomeTax(18_200, scheduleFor(2027)).bracketTax).toBe(0);
  });

  // Benchmark: the PIA report dated 3 Nov 2026 (year 1 = 2026–27).
  it("matches PIA's current tax on $120,000 in 2026–27", () => {
    const result = incomeTax(120_000, scheduleFor(2027));
    expect(result.bracketTax).toBe(26_520);
    expect(result.medicareLevy).toBe(2_400);
    expect(result.total).toBe(28_920);
  });

  it("matches PIA's new tax on $123,377 in 2026–27 to within $1", () => {
    expect(Math.abs(incomeTax(123_377, scheduleFor(2027)).total - 30_000)).toBeLessThanOrEqual(1);
  });

  it("applies the 14% first rate from 2027–28, where PIA keeps 15%", () => {
    // PIA's year 2 shows $30,072 on $123,600 (15% rate). The legislated 2027–28 figure is lower.
    expect(incomeTax(123_600, scheduleFor(2027)).total).toBe(30_072);
    expect(incomeTax(123_600, scheduleFor(2028)).total).toBe(29_804);
  });

  it("ignores cents of taxable income", () => {
    const schedule = scheduleFor(2027);
    expect(bracketTax(50_000.99, schedule)).toBe(bracketTax(50_000, schedule));
  });
});
