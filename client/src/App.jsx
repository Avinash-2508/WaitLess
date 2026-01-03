import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Setup from './pages/Setup';
import QRPage from './pages/QRPage';
import OwnerDashboard from './pages/OwnerDashboard';
import CustomerQueue from './pages/CustomerQueue';
import CustomerStatus from './pages/CustomerStatus';
import Profile from './pages/Profile';
import CounterPanel from './pages/CounterPanel';
import TokenHistory from './pages/TokenHistory';
import StaffLogin from './pages/StaffLogin';
import StaffRegister from './pages/StaffRegister';
import Layout from './components/Layout';
import API from './api';

function App() {
  // Always fetch fresh shop data for the current owner on app load
  useEffect(() => {
    const ownerId = localStorage.getItem('ownerId');
    if (ownerId) {
      API.get(`/shop/owner/${ownerId}`).then((res) => {
        if (res.data?.id) {
          localStorage.setItem('shopId', res.data.id);
        }
      }).catch(() => {});
    }
  }, []);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#111827',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            duration: 5000,
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/staff-register" element={<StaffRegister />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/counter/:shopId" element={<Layout><CounterPanel /></Layout>} />
        <Route path="/history/:shopId" element={<Layout><TokenHistory /></Layout>} />
        <Route path="/shop/:shopId/qr" element={<Layout><QRPage /></Layout>} />
        <Route path="/owner/:shopId" element={<Layout><OwnerDashboard /></Layout>} />
        <Route path="/customer/:shopId" element={<CustomerQueue />} />
        <Route path="/customer/:shopId/status/:token" element={<CustomerStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
