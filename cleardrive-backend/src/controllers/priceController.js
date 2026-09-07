const Car = require('../models/Car');
const { buildPriceBreakdown } = require('../utils/priceCalculator');
const { buildEmiOptions } = require('../utils/emiCalculator');

exports.calculatePrice = async (req, res) => {
  const {
    carId,
    state,
    insuranceType,
    wantsExtendedWarranty,
    accessoriesTotal,
    applyDiscount,
  } = req.body;

  try {
    const car = await Car.getById(carId);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    if (!state) return res.status(400).json({ error: 'state is required' });

    const rtoRates = require('../data/rtoRates.json');
    if (!rtoRates[state]) {
      return res.status(400).json({ error: `Unsupported state: ${state}. Valid states: ${Object.keys(rtoRates).join(', ')}` });
    }

    const discount = applyDiscount ? await Car.getDiscountForCar(carId) : null;

    const breakdown = buildPriceBreakdown({
      exShowroomPrice: car.exShowroomPrice,
      state,
      insuranceType,
      wantsExtendedWarranty: Boolean(wantsExtendedWarranty),
      accessoriesTotal: Number(accessoriesTotal) || 0,
      discount,
    });

    const emiOptions = buildEmiOptions(breakdown.totals.finalOnRoadPrice);

    res.json({
      car: { id: car.id, brand: car.brand, model: car.model, variant: car.variant },
      state,
      breakdown,
      emiOptions,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getDiscount = async (req, res) => {
  try {
    const discount = await Car.getDiscountForCar(req.params.carId);
    if (!discount) return res.status(404).json({ error: 'No active discount found for this car' });
    res.json(discount);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch discount' });
  }
};
