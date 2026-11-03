import type { ResidentTaxSchedule } from "./schedule";

/** Rounds to whole cents. */
const cents = (value: number) => Math.round(value * 100) / 100;

/** Tax on taxable income from the marginal brackets alone, before levies and offsets. */
export function bracketTax(taxableIncome: number, schedule: ResidentTaxSchedule): number {
  // The ATO ignores cents in taxable income.
  const income = Math.max(0, Math.floor(taxableIncome));
  const { brackets } = schedule;
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    if (!bracket || income <= bracket.from) break;
    const next = brackets[i + 1];
    const top = next ? Math.min(income, next.from) : income;
    tax += (top - bracket.from) * bracket.rate;
  }
  return cents(tax);
}

/** Medicare levy as a flat rate. Low-income reduction thresholds are added in Phase 1. */
export function medicareLevy(taxableIncome: number, schedule: ResidentTaxSchedule): number {
  return cents(Math.max(0, Math.floor(taxableIncome)) * schedule.medicareLevyRate);
}

export interface IncomeTaxResult {
  taxableIncome: number;
  bracketTax: number;
  medicareLevy: number;
  total: number;
}

export function incomeTax(taxableIncome: number, schedule: ResidentTaxSchedule): IncomeTaxResult {
  const base = bracketTax(taxableIncome, schedule);
  const levy = medicareLevy(taxableIncome, schedule);
  return {
    taxableIncome: Math.max(0, Math.floor(taxableIncome)),
    bracketTax: base,
    medicareLevy: levy,
    total: cents(base + levy),
  };
}
