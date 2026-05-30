import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Home from '../pages/main/Home';
import Fleet from '../pages/main/Fleet';
import Checkout from '../pages/main/Checkout';
import BookingConfirm from '../pages/main/BookingConfirm';
import AuthPages from '../pages/auth/AuthPages';
import UserDashboard from '../pages/user/UserDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Community from '../pages/main/Community';
import InfoPage from '../pages/main/InfoPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<Fleet />} />
      <Route path="/login" element={<AuthPages mode="login" />} />
      <Route path="/signup" element={<AuthPages mode="signup" />} />
      <Route path="/community" element={<Community />} />
      <Route path="/about" element={<InfoPage slug="about" />} />
      <Route path="/locations" element={<InfoPage slug="locations" />} />
      <Route path="/contact" element={<InfoPage slug="contact" />} />
      <Route path="/privacy" element={<InfoPage slug="privacy" />} />
      <Route path="/terms" element={<InfoPage slug="terms" />} />
      <Route path="/faqs" element={<InfoPage slug="faqs" />} />

      <Route path="/book/:id" element={<BookingConfirm />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<UserDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
