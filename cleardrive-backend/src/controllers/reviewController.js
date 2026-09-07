const Review = require('../models/Review');
const Car = require('../models/Car');

exports.getReviewsForCar = async (req, res) => {
  try {
    const [reviews, summary] = await Promise.all([
      Review.getForCar(req.params.carId),
      Review.getSummaryForCar(req.params.carId),
    ]);
    res.json({ ...summary, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

exports.addReview = async (req, res) => {
  const { rating, comment, name } = req.body;
  const carId = req.params.carId;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }

  try {
    const car = await Car.getById(carId);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    const reviewerName = req.user ? req.user.name : name;
    if (!reviewerName) return res.status(400).json({ error: 'name is required when not logged in' });

    const review = await Review.create({
      carId,
      userId: req.user ? req.user.id : null,
      name: reviewerName,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};
