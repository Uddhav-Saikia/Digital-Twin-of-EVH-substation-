import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import AssetDetail from './pages/AssetDetail';
import Monitoring from './pages/Monitoring';
import Analytics from './pages/Analytics';
import Visualization from './pages/Visualization';
import Maintenance from './pages/Maintenance';
import Simulation from './pages/Simulation';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<AssetManagement />} />
          <Route path="/assets/:type/:id" element={<AssetDetail />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/visualization" element={<Visualization />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
