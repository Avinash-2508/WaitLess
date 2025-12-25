import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Setup from './pages/Setup';
import QRPage from './pages/QRPage';
import OwnerDashboard from './pages/OwnerDashboard';
import CustomerQueue from './pages/CustomerQueue';
import CustomerStatus from './pages/CustomerStatus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/shop/:shopId/qr" element={<QRPage />} />
        <Route path="/owner/:shopId" element={<OwnerDashboard />} />
        <Route path="/customer/:shopId" element={<CustomerQueue />} />
        <Route path="/customer/:shopId/status/:token" element={<CustomerStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
