import type { FinancialYear } from "../financial-year";

/** One marginal bracket: income above `from` (dollars) is taxed at `rate` (0–1) up to the next bracket. */
export interface Bracket {
  from: number;
  rate: number;
}

/**
 * A resident individual income tax schedule in force for a run of financial years.
 * In the app these rows live in the `tax_schedule` table and are edited from the admin area;
 * this in-code copy seeds that table and keeps the engine testable on its own.
 */
export interface ResidentTaxSchedule {
  kind: "income-tax-resident";
  /** First financial year the schedule applies to (inclusive). */
  fromYear: FinancialYear;
  /** Last financial year it applies to (inclusive), or null while it is the latest known. */
  toYear: FinancialYear | null;
  brackets: Bracket[];
  /** Medicare levy as a flat rate of taxable income (low-income thresholds come in Phase 1). */
  medicareLevyRate: number;
  source: string;
}

const STAGE_3_SOURCE =
  "https://www.legislation.gov.au/C2025A00028/asmade/2025-03-27/text/original/word";

export const residentTaxSchedules: ResidentTaxSchedule[] = [
  {
    kind: "income-tax-resident",
    fromYear: 2025,
    toYear: 2026,
    brackets: [
      { from: 0, rate: 0 },
      { from: 18_200, rate: 0.16 },
      { from: 45_000, rate: 0.3 },
      { from: 135_000, rate: 0.37 },
      { from: 190_000, rate: 0.45 },
    ],
    medicareLevyRate: 0.02,
    source: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents",
  },
  {
    kind: "income-tax-resident",
    fromYear: 2027,
    toYear: 2027,
    brackets: [
      { from: 0, rate: 0 },
      { from: 18_200, rate: 0.15 },
      { from: 45_000, rate: 0.3 },
      { from: 135_000, rate: 0.37 },
      { from: 190_000, rate: 0.45 },
    ],
    medicareLevyRate: 0.02,
    source: STAGE_3_SOURCE,
  },
  {
    kind: "income-tax-resident",
    fromYear: 2028,
    toYear: null,
    brackets: [
      { from: 0, rate: 0 },
      { from: 18_200, rate: 0.14 },
      { from: 45_000, rate: 0.3 },
      { from: 135_000, rate: 0.37 },
      { from: 190_000, rate: 0.45 },
    ],
    medicareLevyRate: 0.02,
    source: STAGE_3_SOURCE,
  },
];

/**
 * The schedule in force for a financial year. Years after the last known schedule use the
 * latest one unchanged (no bracket indexation).
 */
export function scheduleFor(
  fy: FinancialYear,
  schedules: readonly ResidentTaxSchedule[] = residentTaxSchedules,
): ResidentTaxSchedule {
  const match = schedules.find((s) => fy >= s.fromYear && (s.toYear === null || fy <= s.toYear));
  if (match) return match;
  const latest = [...schedules].sort((a, b) => b.fromYear - a.fromYear)[0];
  if (!latest || fy < latest.fromYear) {
    throw new RangeError(`No resident tax schedule covers financial year ${fy}`);
  }
  return latest;
}
