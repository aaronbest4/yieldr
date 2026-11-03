/**
 * Australian financial years run 1 July to 30 June. A financial year is identified by the
 * calendar year it ends in: FY2027 is 1 July 2026 to 30 June 2027, written "2026–27".
 */
export type FinancialYear = number;

/** The financial year that contains the given date. */
export function financialYearOf(date: Date): FinancialYear {
  const month = date.getUTCMonth(); // 0 = January, 6 = July
  const year = date.getUTCFullYear();
  return month >= 6 ? year + 1 : year;
}

/** Display label, e.g. 2027 -> "2026–27". */
export function financialYearLabel(fy: FinancialYear): string {
  return `${fy - 1}–${String(fy).slice(-2)}`;
}
