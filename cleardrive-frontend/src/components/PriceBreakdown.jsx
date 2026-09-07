import './PriceBreakdown.css';

function formatINR(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export default function PriceBreakdown({ data }) {
  const { mandatory, optional, discount, totals } = data.breakdown;

  return (
    <div className="price-breakdown">
      <h3>Mandatory costs</h3>
      <Row label="Ex-showroom price" value={mandatory.exShowroomPrice} />
      <Row label="RTO tax" value={mandatory.rto} />
      <Row label="Insurance (comprehensive)" value={mandatory.insurance} />
      <Row label="Subtotal" value={totals.mandatoryTotal} strong />

      {(optional.extendedWarranty > 0 || optional.accessoriesTotal > 0) && (
        <>
          <h3>Optional add-ons <span className="optional-tag">you chose these</span></h3>
          {optional.extendedWarranty > 0 && (
            <Row label="Extended warranty" value={optional.extendedWarranty} />
          )}
          {optional.accessoriesTotal > 0 && (
            <Row label="Accessories" value={optional.accessoriesTotal} />
          )}
        </>
      )}

      {discount && totals.totalDiscount > 0 && (
        <>
          <h3>Active discounts <span className="discount-tag">{discount.note}</span></h3>
          {discount.cashDiscount > 0 && <Row label="Cash discount" value={-discount.cashDiscount} />}
          {discount.exchangeBonus > 0 && <Row label="Exchange bonus" value={-discount.exchangeBonus} />}
          {discount.corporateDiscount > 0 && (
            <Row label="Corporate discount" value={-discount.corporateDiscount} />
          )}
          <p className="discount-validity">Valid till {discount.validTill}</p>
        </>
      )}

      <div className="price-breakdown-total">
        <span>Final on-road price</span>
        <span>{formatINR(totals.finalOnRoadPrice)}</span>
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  const isNegative = value < 0;
  return (
    <div className={`price-row ${strong ? 'strong' : ''}`}>
      <span>{label}</span>
      <span className={isNegative ? 'negative' : ''}>
        {isNegative ? '-' : ''}
        {formatINR(Math.abs(value))}
      </span>
    </div>
  );
}
