import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Layout & Navigation
import { Navbar } from './components/shared/Navigation';
import Footer from './components/shared/Footer';

// Pages
import Home from './pages/main/Home';
import Fleet from './pages/main/Fleet';
import CarDetails from './pages/main/CarDetails';
import BookingConfirm from './pages/main/BookingConfirm';
import Checkout from './pages/main/Checkout';
import AuthPages from './pages/auth/AuthPages';
import UserDashboard from './pages/user/UserDashboard';
import ReviewPage from './pages/user/ReviewPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Community from './pages/main/Community';

// Helper to reset scroll on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#0a0a0c]">
          <Navbar />
          {/* position="top-right" matches the luxury dashboard feel */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'glass-card border-white/10 text-white bg-[#161618]',
              duration: 4000,
            }}
          />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Fleet />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/login" element={<AuthPages />} />
              <Route path="/community" element={<Community />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/booking/:id/confirm" element={<BookingConfirm />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/review/:carId" element={<ReviewPage />} />
                {/* Use /* to support nested dashboard tabs */}
                <Route path="/dashboard/*" element={<UserDashboard />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>

              {/* 404 Catch-all (Optional) */}
              <Route path="*" element={
                <div className="h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-white">404</h1>
                  <p className="text-gray-500">Page not found</p>
                </div>
              } />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
