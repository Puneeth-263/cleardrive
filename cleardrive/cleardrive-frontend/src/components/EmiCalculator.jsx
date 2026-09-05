function formatINR(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export default function EmiCalculator({ emiOptions }) {
  if (!emiOptions || emiOptions.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 18, marginBottom: 8 }}>Loan EMI estimate</h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, marginBottom: 4 }}>
        Based on {emiOptions[0].annualInterestRate}% p.a. — a typical car-loan rate, not a quote from any specific bank.
      </p>
      <table className="emi-table">
        <thead>
          <tr>
            <th>Tenure</th>
            <th>Monthly EMI</th>
            <th>Total interest</th>
            <th>Total payment</th>
          </tr>
        </thead>
        <tbody>
          {emiOptions.map((opt) => (
            <tr key={opt.tenureMonths}>
              <td>{opt.tenureYears} years</td>
              <td>{formatINR(opt.emi)}</td>
              <td>{formatINR(opt.totalInterest)}</td>
              <td>{formatINR(opt.totalPayment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
