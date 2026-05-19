import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Home from '../pages/main/Home';
// 1. IMPORT YOUR REAL COMPONENTS
import Checkout from '../pages/main/Checkout'; 
import BookingConfirm from '../pages/main/BookingConfirm';
import AdminDashboard from '../pages/admin/AdminDashboard';
// Import other pages like Fleet, Login, etc.

const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<div>Fleet Listing</div>} />
      <Route path="/login" element={<div>Login Page</div>} />

      {/* 2. ADD BOOKING CONFIRM (Step 1) */}
      <Route path="/book/:id" element={<BookingConfirm />} />

      {/* PROTECTED USER ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<div>User Dashboard Layout</div>}>
          <Route index element={<div>My Bookings</div>} />
        </Route>
        
        {/* 3. USE THE REAL CHECKOUT COMPONENT (Step 2) */}
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* PROTECTED ADMIN ROUTES */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        {/* 4. USE THE REAL ADMIN DASHBOARD */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;