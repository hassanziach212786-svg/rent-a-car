import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * SESSION PERSISTENCE
   * This runs immediately when the app loads. It checks for a token
   * and validates it with the backend before showing the UI.
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch current user data from your /auth/me or /auth/profile endpoint
        const { data } = await API.get('/auth/me');
        setUser(data.user || data);
      } catch {
        console.error("Auth Session Expired");
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await API.post('/auth/login', credentials);
      const userData = data.user || data;

      if (!data.token || !userData?._id) {
        throw new Error('Invalid login response from server');
      }
      
      // Store token for the Interceptor to use
      localStorage.setItem('token', data.token);
      
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, role: userData.role };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid email or password';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      const registeredUser = data.user || data;

      if (!data.token || !registeredUser?._id) {
        throw new Error('Invalid registration response from server');
      }

      localStorage.setItem('token', data.token);
      setUser(registeredUser);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };
const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    // The ProtectedRoute will automatically boot the user to /login
    // because user is now null. No reload needed!
  };

  const value = {
    user,
    setUser,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* CRITICAL: We do not render children until loading is false.
        This prevents ProtectedRoutes from flickering or redirecting 
        incorrectly during the session check.
      */}
      {!loading ? children : (
        <div className="h-screen bg-[#0a0a0c] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Securing Session...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
