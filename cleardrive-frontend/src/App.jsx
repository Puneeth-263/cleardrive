import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RequirementForm from './pages/RequirementForm';
import Recommendations from './pages/Recommendations';
import PriceDetails from './pages/PriceDetails';
import BookingTracker from './pages/BookingTracker';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyBookings from './pages/MyBookings';
import UsedCars from './pages/UsedCars';
import CompareCars from './pages/CompareCars';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/requirements" element={<RequirementForm />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/car/:id/price" element={<PriceDetails />} />
        <Route path="/booking/:id/track" element={<BookingTracker />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/used-cars" element={<UsedCars />} />
        <Route path="/compare" element={<CompareCars />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
}
