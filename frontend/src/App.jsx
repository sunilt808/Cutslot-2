import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Particles from './components/Particles';

// COMMON
import Landing from './pages/common/Landing';
import Services from './pages/common/Services';
import Booking from './pages/common/Booking';
import Auth from './pages/Auth';
import CommonProfile from './pages/common/Profile';

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

// CLIENT
import ClientDashboard from './pages/client/Dashboard';
import ClientWallet from './pages/client/Wallet';

import './index.css';

// Route Protection Logic
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  if (roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/services" element={<Services />} />
      <Route path="/booking" element={<Booking />} />
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

      {/* CLIENT ROUTES */}
      <Route path="/profile" element={<ProtectedRoute roles={['customer']}><ClientDashboard /></ProtectedRoute>} />
      <Route path="/profile/wallet" element={<ProtectedRoute roles={['customer']}><ClientWallet /></ProtectedRoute>} />

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
