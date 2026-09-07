import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import { getAllCars } from '../services/carService';
import './Home.css';

export default function Home() {
  const [popularCars, setPopularCars] = useState([]);

  useEffect(() => {
    getAllCars()
      .then((cars) => setPopularCars(cars.filter((c) => !c.isUsed).slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Know the real price.
            <br />
            Before you walk in.
          </h1>
          <p>
            Tell us your budget and needs. We match you to the right car,
            show every cost with nothing hidden, and guide you through
            booking to delivery — step by step, in real time.
          </p>
          <div className="hero-actions">
            <SearchBar />
            <Link to="/requirements" className="btn-primary hero-cta">
              Or find my car by budget
            </Link>
          </div>
        </div>
      </section>

      {popularCars.length > 0 && (
        <section className="popular-cars">
          <h2>Popular right now</h2>
          <div className="grid-cars">
            {popularCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      )}

      <section className="how-it-works">
        <h2>How ClearDrive works</h2>
        <div className="steps">
          <Step
            n="1"
            title="Tell us your budget"
            text="Fuel type, body style, must-have features — a two-minute form."
          />
          <Step
            n="2"
            title="See the true price"
            text="Ex-showroom, RTO, insurance, and any add-ons — itemized, with active discounts flagged."
          />
          <Step
            n="3"
            title="Track it to delivery"
            text="From booking to PDI to handover, watch every stage update live."
          />
        </div>
      </section>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="step">
      <div className="step-number">{n}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
