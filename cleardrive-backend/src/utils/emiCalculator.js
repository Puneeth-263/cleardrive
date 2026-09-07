/**
 * Standard reducing-balance EMI formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where P = principal, r = monthly interest rate, n = tenure in months.
 */
function calculateEMI({ principal, annualInterestRate, tenureMonths }) {
  if (principal <= 0 || tenureMonths <= 0) {
    throw new Error('principal and tenureMonths must be positive');
  }
  const r = annualInterestRate / 12 / 100;
  const n = tenureMonths;

  if (r === 0) {
    const emi = principal / n;
    return { emi: Math.round(emi), totalPayment: Math.round(emi * n), totalInterest: 0 };
  }

  const factor = Math.pow(1 + r, n);
  const emi = (principal * r * factor) / (factor - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}

// A few representative tenure options at a typical Indian car-loan rate,
// so buyers can see affordability at a glance without picking numbers
// themselves. Not tied to any real bank quote.
function buildEmiOptions(principal, annualInterestRate = 9.5) {
  return [36, 60, 84].map((tenureMonths) => ({
    tenureMonths,
    tenureYears: tenureMonths / 12,
    annualInterestRate,
    ...calculateEMI({ principal, annualInterestRate, tenureMonths }),
  }));
}

module.exports = { calculateEMI, buildEmiOptions };
