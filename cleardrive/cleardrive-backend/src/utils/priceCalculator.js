const rtoRates = require('../data/rtoRates.json');

/**
 * Calculates insurance premium (simplified, real-world simulation).
 * Comprehensive insurance ~= 3.5% of ex-showroom price for year 1.
 */
function calculateInsurance(exShowroomPrice, type = 'comprehensive') {
  const rate = type === 'thirdParty' ? 0.008 : 0.035;
  return Math.round(exShowroomPrice * rate);
}

/**
 * Calculates RTO tax based on state.
 */
function calculateRTO(exShowroomPrice, state) {
  const rate = rtoRates[state];
  if (!rate) {
    throw new Error(`RTO rate not available for state: ${state}`);
  }
  return Math.round(exShowroomPrice * rate);
}

/**
 * Builds a fully itemized, transparent price breakdown.
 * Optional add-ons (extendedWarranty, accessories) are clearly separated
 * from mandatory costs so the buyer can see exactly what's optional.
 */
function buildPriceBreakdown({
  exShowroomPrice,
  state,
  insuranceType = 'comprehensive',
  wantsExtendedWarranty = false,
  accessoriesTotal = 0,
  discount = null,
}) {
  const rto = calculateRTO(exShowroomPrice, state);
  const insurance = calculateInsurance(exShowroomPrice, insuranceType);
  const extendedWarranty = wantsExtendedWarranty ? Math.round(exShowroomPrice * 0.03) : 0;

  const mandatoryTotal = exShowroomPrice + rto + insurance;
  const optionalTotal = extendedWarranty + accessoriesTotal;

  let totalDiscount = 0;
  let discountBreakdown = null;
  if (discount) {
    totalDiscount =
      (discount.cashDiscount || 0) +
      (discount.exchangeBonus || 0) +
      (discount.corporateDiscount || 0);
    discountBreakdown = {
      cashDiscount: discount.cashDiscount || 0,
      exchangeBonus: discount.exchangeBonus || 0,
      corporateDiscount: discount.corporateDiscount || 0,
      validTill: discount.validTill,
      note: discount.note,
    };
  }

  const finalOnRoadPrice = mandatoryTotal + optionalTotal - totalDiscount;

  return {
    mandatory: {
      exShowroomPrice,
      rto,
      insurance,
    },
    optional: {
      extendedWarranty,
      accessoriesTotal,
    },
    discount: discountBreakdown,
    totals: {
      mandatoryTotal,
      optionalTotal,
      totalDiscount,
      finalOnRoadPrice,
    },
  };
}

module.exports = { calculateInsurance, calculateRTO, buildPriceBreakdown };
