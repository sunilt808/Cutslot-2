import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Particles from './components/Particles';
import Home from './pages/Home';
import Floors from './pages/Floors';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Particles />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/floors" element={<Floors />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            {/* Admin and Staff dashboards to be added here */}
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
