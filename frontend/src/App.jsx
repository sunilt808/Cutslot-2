import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Particles from './components/Particles';

// COMMON
import Landing from './pages/common/Landing';
import Services from './pages/common/Services';
import Booking from './pages/common/Booking';
import BookingConfirmation from './pages/common/BookingConfirmation';
import Auth from './pages/Auth';
import CommonProfile from './pages/common/Profile';
import Reviews from './pages/common/Reviews';

// ADMIN
import AdminDashboard from './pages/admin/Dashboard';
import AdminWorkers from './pages/admin/Workers';
import AdminCredentials from './pages/admin/Credentials';
import AdminServices from './pages/admin/Services';
import AdminRevenue from './pages/admin/Revenue';
import AdminAudits from './pages/admin/Audits';
import AdminProfile from './pages/admin/Profile';

// WORKER
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerPerformance from './pages/worker/Performance';
import WorkerQueue from './pages/worker/Queue';

// CLIENT
import ClientDashboard from './pages/client/Dashboard';
import ClientWallet from './pages/client/Wallet';
import ClientRevenue from './pages/client/Revenue';
import MyAppointments from './pages/client/MyAppointments';

import './index.css';

// Route Protection Logic
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  if (roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

// Home Redirect Component
const HomeRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Landing />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'staff') return <Navigate to="/staff" />;
    return <Navigate to="/profile" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/services" element={<Services />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/settings" element={<ProtectedRoute><CommonProfile /></ProtectedRoute>} />

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/workers" element={<ProtectedRoute roles={['admin']}><AdminWorkers /></ProtectedRoute>} />
      <Route path="/admin/credentials" element={<ProtectedRoute roles={['admin']}><AdminCredentials /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute roles={['admin']}><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/revenue" element={<ProtectedRoute roles={['admin']}><AdminRevenue /></ProtectedRoute>} />
      <Route path="/admin/audits" element={<ProtectedRoute roles={['admin']}><AdminAudits /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute roles={['admin']}><AdminProfile /></ProtectedRoute>} />

      {/* WORKER ROUTES */}
      <Route path="/staff" element={<ProtectedRoute roles={['staff']}><WorkerDashboard /></ProtectedRoute>} />
      <Route path="/staff/performance" element={<ProtectedRoute roles={['staff']}><WorkerPerformance /></ProtectedRoute>} />
      <Route path="/staff/queue" element={<ProtectedRoute roles={['staff']}><WorkerQueue /></ProtectedRoute>} />

      {/* CLIENT ROUTES */}
      <Route path="/profile" element={<ProtectedRoute roles={['customer']}><ClientDashboard /></ProtectedRoute>} />
      <Route path="/profile/appointments" element={<ProtectedRoute roles={['customer']}><MyAppointments /></ProtectedRoute>} />
      <Route path="/profile/wallet" element={<ProtectedRoute roles={['customer']}><ClientWallet /></ProtectedRoute>} />
      <Route path="/profile/revenue" element={<ProtectedRoute roles={['customer']}><ClientRevenue /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Particles />
        <Layout>
          <AppRoutes />
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
