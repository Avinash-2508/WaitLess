import { Link } from 'react-router-dom';

export default function Sidebar({ mobile = false }) {
  const shopName = localStorage.getItem("shopName") || "WaitLess";
  const shopId = localStorage.getItem("shopId");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkClasses = "px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-medium transition-colors min-h-[44px] flex items-center";

  return (
    <nav className={`flex flex-col gap-2 ${mobile ? "w-full" : ""}`}>
      {!mobile && (
        <div className="mb-4">
          <h2 className="font-bold text-lg lg:text-xl text-blue-600 truncate">{shopName}</h2>
        </div>
      )}

      <Link to={shopId ? `/owner/${shopId}` : "#"} className={linkClasses}>
        Dashboard
      </Link>
      <Link to={shopId ? `/counter/${shopId}` : "#"} className={linkClasses}>
        Counter Panel
      </Link>
      <Link to={shopId ? `/history/${shopId}` : "#"} className={linkClasses}>
        Token History
      </Link>
      <Link to={shopId ? `/shop/${shopId}/qr` : "#"} className={linkClasses}>
        View QR
      </Link>
      <Link to="/profile" className={linkClasses}>
        Profile
      </Link>

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors min-h-[44px] text-left"
      >
        Logout
      </button>
    </nav>
  );
}
