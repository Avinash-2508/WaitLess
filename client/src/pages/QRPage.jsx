import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Button from '../components/Button';
import API from '../api';
import { showSuccess, showError } from '../utils/toastManager';

export default function QRPage() {
  const { shopId: paramShopId } = useParams();
  const navigate = useNavigate();
  const shopId = paramShopId || localStorage.getItem("shopId");
  const customerUrl = `${window.location.origin}/customer/${shopId}`;
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState(280);
  const [paymentId, setPaymentId] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [assignedToken, setAssignedToken] = useState(null);

  // Calculate QR size based on viewport width
  useEffect(() => {
    const calculateSize = () => {
      const width = window.innerWidth;
      // Mobile: 70% of screen width, max 280px, min 200px
      // Desktop: fixed 280px
      if (width < 640) {
        setQrSize(Math.min(280, Math.max(200, width * 0.7)));
      } else {
        setQrSize(280);
      }
    };
    
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(customerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // Fallback for older browsers: create a temp input and copy
      const temp = document.createElement('input');
      temp.value = customerUrl;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!paymentId.trim()) {
      showError('Enter a payment ID');
      return;
    }
    setClaiming(true);
    try {
      const res = await API.post('/queue/customer/claim', { shopId, paymentId: paymentId.trim() });
      if (!res.data.success) {
        throw new Error(res.data.error || 'Failed to claim token');
      }
      const tokenNumber = res.data.data?.tokenNumber;
      setAssignedToken(tokenNumber);
      showSuccess(`Your Token is #${String(tokenNumber).padStart(2, '0')}`);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to claim token';
      showError(msg);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-white">
      <div className="w-full max-w-md space-y-6">
        {/* QR Code - Optimized for mobile scanning */}
        <div className="flex justify-center">
          <div className="p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
            <QRCodeSVG 
              value={customerUrl} 
              size={qrSize} 
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        {/* Instructions for mobile users */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Scan to Join Queue
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Customers can scan this QR code to get their token
          </p>
        </div>

        {/* URL Input and Copy Button - Mobile optimized */}
        <div className="w-full space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customerUrl}
              readOnly
              className="flex-1 px-4 py-3 text-sm sm:text-base break-all border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-5 py-3 min-h-[44px] font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Dashboard Button */}
        <div className="w-full">
          <Button
            variant="primary"
            onClick={() => navigate(`/owner/${shopId}`)}
            className="w-full py-3 px-6 rounded-xl font-semibold min-h-[44px]"
          >
            Go To Dashboard
          </Button>
        </div>

        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Enter Payment ID to confirm your spot:</h3>
          <form className="space-y-3" onSubmit={handleClaim}>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="Payment ID / Bill Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              disabled={claiming}
            >
              {claiming ? 'Confirming...' : 'Confirm Payment & Claim Token'}
            </Button>
          </form>
          {assignedToken && (
            <div className="text-center text-green-700 font-semibold">
              Your Token is #{String(assignedToken).padStart(2, '0')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

